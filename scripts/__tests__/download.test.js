const { PassThrough } = require('stream');
const path = require('path');
const zlib = require('zlib');

const fs = require('fs-extra');
jest.mock('got', () => ({ stream: jest.fn() }));

const ZIP_FIXTURE = Buffer.from(
  'UEsDBBQAAAgIAIBYIlhBDH7HCwAAAAkAAAANAAAAcm9vdC9rZWVwLnR4dMtOTS3QTUksSQQAUEsDBBQAAAgIAIZ97lzspMnKCwAAAAkAAAANAAAAcm9vdC9kcm9wLnR4dEspyi/QTUksSQQAUEsDBBQAAAgAAIZ97lwAAAAAAAAAAAAAAAALAAAAcm9vdC9lbXB0eS9QSwECPwMUAAAICACAWCJYQQx+xwsAAAAJAAAADQAAAAAAAAAAAAAAoIEAAAAAcm9vdC9rZWVwLnR4dFBLAQI/AxQAAAgIAIZ97lzspMnKCwAAAAkAAAANAAAAAAAAAAAAAAC0gTYAAAByb290L2Ryb3AudHh0UEsBAj8DFAAACAAAhn3uXAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAP1BbAAAAHJvb3QvZW1wdHkvUEsFBgAAAAADAAMArwAAAJUAAAAAAA==',
  'base64'
);

const mockResponse = (data, contentType = 'application/octet-stream') => {
  const got = require('got');
  const stream = new PassThrough();
  stream.requestUrl = 'https://download.agora.io/sdk/archive.zip';
  got.stream.mockReturnValue(stream);
  process.nextTick(() => {
    stream.emit('response', {
      headers: { 'content-type': contentType },
      requestUrl: stream.requestUrl,
    });
    stream.end(data);
  });
};

describe('download', () => {
  let output;

  beforeEach(async () => {
    jest.resetModules();
    require('got').stream.mockReset();
    output = await fs.mkdtemp(
      path.join(require('os').tmpdir(), 'download-output-')
    );
  });

  afterEach(async () => {
    await fs.remove(output);
    jest.dontMock('../extractZip');
  });

  test('delegates ZIP extraction to extractZip', async () => {
    const extractZip = jest.fn().mockResolvedValue([]);
    jest.doMock('../extractZip', () => extractZip);
    const download = require('../download');
    mockResponse(ZIP_FIXTURE);

    await download('https://download.agora.io/sdk/archive.zip', output, {
      extract: true,
      strip: 1,
    });

    expect(extractZip).toHaveBeenCalledWith(
      ZIP_FIXTURE,
      output,
      expect.objectContaining({ extract: true, strip: 1 })
    );
  });

  test('extracts a ZIP response into output with extract options', async () => {
    jest.dontMock('../extractZip');
    const download = require('../download');
    mockResponse(ZIP_FIXTURE);

    await download('https://download.agora.io/sdk/archive.zip', output, {
      extract: true,
      strip: 1,
    });

    await expect(
      fs.readFile(path.join(output, 'keep.txt'), 'utf8')
    ).resolves.toBe('keep-data');
  });

  test('returns extracted entries when output is omitted', async () => {
    jest.dontMock('../extractZip');
    const download = require('../download');
    mockResponse(ZIP_FIXTURE);

    const entries = await download(
      'https://download.agora.io/sdk/archive.zip',
      null,
      {
        extract: true,
        strip: 1,
      }
    );

    expect(entries.map((entry) => entry.path)).toEqual([
      'drop.txt',
      'empty',
      'keep.txt',
    ]);
  });

  test('returns the response buffer when extract is false', async () => {
    const download = require('../download');
    const data = Buffer.from('plain data');
    mockResponse(data, 'text/plain');

    await expect(
      download('https://download.agora.io/sdk/file.txt', null, {
        extract: false,
      })
    ).resolves.toEqual(data);
  });

  test.each([
    ['a non-archive response', Buffer.from('plain data')],
    ['a recognized non-ZIP archive', zlib.gzipSync(Buffer.from('gzip data'))],
  ])('does not extract %s', async (_label, data) => {
    const extractZip = jest.fn();
    jest.doMock('../extractZip', () => extractZip);
    const download = require('../download');
    mockResponse(data);

    await expect(
      download('https://download.agora.io/sdk/archive', null, { extract: true })
    ).resolves.toEqual(data);
    expect(extractZip).not.toHaveBeenCalled();
  });
});
