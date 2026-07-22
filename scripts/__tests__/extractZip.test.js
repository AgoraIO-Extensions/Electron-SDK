const os = require('os');
const path = require('path');

const fs = require('fs-extra');

const extractZip = require('../extractZip');

const ZIP_FIXTURE = Buffer.from(
  'UEsDBBQAAAgIAIBYIlhBDH7HCwAAAAkAAAANAAAAcm9vdC9rZWVwLnR4dMtOTS3QTUksSQQAUEsDBBQAAAgIAIZ97lzspMnKCwAAAAkAAAANAAAAcm9vdC9kcm9wLnR4dEspyi/QTUksSQQAUEsDBBQAAAgAAIZ97lwAAAAAAAAAAAAAAAALAAAAcm9vdC9lbXB0eS9QSwECPwMUAAAICACAWCJYQQx+xwsAAAAJAAAADQAAAAAAAAAAAAAAoIEAAAAAcm9vdC9rZWVwLnR4dFBLAQI/AxQAAAgIAIZ97lzspMnKCwAAAAkAAAANAAAAAAAAAAAAAAC0gTYAAAByb290L2Ryb3AudHh0UEsBAj8DFAAACAAAhn3uXAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAP1BbAAAAHJvb3QvZW1wdHkvUEsFBgAAAAADAAMArwAAAJUAAAAAAA==',
  'base64'
);
const SYMLINK_ZIP_FIXTURE = Buffer.from(
  'UEsDBBQAAAgIAIt97lwGUP3wDAAAAAoAAAAJAAAAcm9vdC9saW5r09PTzy8tKc5MSQUAUEsBAj8DFAAACAgAi33uXAZQ/fAMAAAACgAAAAkAAAAAAAAAAAAAAP+hAAAAAHJvb3QvbGlua1BLBQYAAAAAAQABADcAAAAzAAAAAAA=',
  'base64'
);

const listTemporaryRoots = async () => {
  const names = await fs.readdir(os.tmpdir());
  return names.filter((name) => name.startsWith('agora-electron-sdk-')).sort();
};

describe('extractZip', () => {
  let output;

  beforeEach(async () => {
    output = await fs.mkdtemp(path.join(os.tmpdir(), 'extract-zip-output-'));
  });

  afterEach(async () => {
    await fs.remove(output);
  });

  test('extracts files after applying strip, filter, and map in order', async () => {
    const filterPaths = [];
    const mapPaths = [];

    await extractZip(ZIP_FIXTURE, output, {
      strip: 1,
      filter: (file) => {
        filterPaths.push(file.path);
        return file.path !== 'drop.txt';
      },
      map: (file) => {
        mapPaths.push(file.path);
        if (file.path === 'keep.txt') {
          file.path = 'renamed.txt';
          file.data = Buffer.from('mapped-data');
        }
        return file;
      },
    });

    expect(filterPaths).toEqual(['drop.txt', 'empty', 'keep.txt']);
    expect(mapPaths).toEqual(['empty', 'keep.txt']);
    await expect(
      fs.readFile(path.join(output, 'renamed.txt'), 'utf8')
    ).resolves.toBe('mapped-data');
    await expect(fs.pathExists(path.join(output, 'drop.txt'))).resolves.toBe(
      false
    );
  });

  test('preserves mapped mode and mtime when writing', async () => {
    const mappedMtime = new Date('2023-06-07T08:09:10Z');

    await extractZip(ZIP_FIXTURE, output, {
      strip: 1,
      filter: (file) => file.path === 'keep.txt',
      map: (file) => ({ ...file, mode: 0o600, mtime: mappedMtime }),
    });

    const stat = await fs.stat(path.join(output, 'keep.txt'));
    expect(stat.mode & 0o777).toBe(0o600);
    expect(stat.mtime.getTime()).toBe(mappedMtime.getTime());
  });

  test('writes normalized directory entries', async () => {
    await extractZip(ZIP_FIXTURE, output, { strip: 1 });

    await expect(fs.stat(path.join(output, 'empty'))).resolves.toMatchObject({
      isDirectory: expect.any(Function),
    });
    expect((await fs.stat(path.join(output, 'empty'))).isDirectory()).toBe(
      true
    );
  });

  test.each(['relative', 'absolute'])(
    'rejects %s transformed paths',
    async (pathType) => {
      const mappedPath =
        pathType === 'absolute'
          ? path.resolve(output, '..', 'escape.txt')
          : '../escape.txt';
      await expect(
        extractZip(ZIP_FIXTURE, output, {
          strip: 1,
          filter: (file) => file.type === 'file',
          map: (file) => ({ ...file, path: mappedPath }),
        })
      ).rejects.toThrow('outside the output directory');
    }
  );

  test('rejects symbolic links', async () => {
    await expect(
      extractZip(SYMLINK_ZIP_FIXTURE, output, { strip: 1 })
    ).rejects.toThrow('symbolic links');
  });

  test('removes temporary files after success and failure', async () => {
    const before = await listTemporaryRoots();

    await extractZip(ZIP_FIXTURE, output, { strip: 1 });
    await expect(
      extractZip(ZIP_FIXTURE, output, {
        strip: 1,
        map: (file) => ({ ...file, path: '../escape.txt' }),
      })
    ).rejects.toThrow();

    expect(await listTemporaryRoots()).toEqual(before);
  });
});
