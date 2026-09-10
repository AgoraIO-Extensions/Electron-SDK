'use strict';

// Adapted from extract-zip 2.0.1 (MIT): https://github.com/max-mapper/extract-zip

const { createWriteStream, promises: fs } = require('fs');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');

const getStream = require('get-stream');
const yauzl = require('yauzl');

const openZip = promisify(yauzl.open);
const pipeline = promisify(stream.pipeline);

const isOutside = (root, target) => {
  const relative = path.relative(root, target);
  return (
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  );
};

class Extractor {
  constructor(zipPath, opts) {
    this.zipPath = zipPath;
    this.opts = opts;
  }

  async extract() {
    this.zipfile = await openZip(this.zipPath, { lazyEntries: true });
    this.canceled = false;

    return new Promise((resolve, reject) => {
      this.zipfile.on('error', (error) => {
        this.canceled = true;
        reject(error);
      });
      this.zipfile.on('close', () => {
        if (!this.canceled) resolve();
      });
      this.zipfile.on('entry', async (entry) => {
        if (this.canceled) return;
        if (entry.fileName.startsWith('__MACOSX/')) {
          this.zipfile.readEntry();
          return;
        }

        try {
          const destinationDirectory = path.dirname(
            path.join(this.opts.dir, entry.fileName)
          );
          await fs.mkdir(destinationDirectory, { recursive: true });
          const canonicalDirectory = await fs.realpath(destinationDirectory);
          if (isOutside(this.opts.dir, canonicalDirectory)) {
            throw new Error(
              `Out of bound path "${canonicalDirectory}" found while processing file ${entry.fileName}`
            );
          }

          await this.extractEntry(entry);
          this.zipfile.readEntry();
        } catch (error) {
          this.canceled = true;
          this.zipfile.close();
          reject(error);
        }
      });
      this.zipfile.readEntry();
    });
  }

  async extractEntry(entry) {
    if (this.canceled) return;
    if (this.opts.onEntry) this.opts.onEntry(entry, this.zipfile);

    const destination = path.join(this.opts.dir, entry.fileName);
    const mode = (entry.externalFileAttributes >> 16) & 0xffff;
    const fileTypeMask = 0xf000;
    const directoryType = 0x4000;
    const symlinkType = 0xa000;
    const isSymlink = (mode & fileTypeMask) === symlinkType;
    let isDirectory = (mode & fileTypeMask) === directoryType;

    if (!isDirectory && entry.fileName.endsWith('/')) isDirectory = true;
    const madeBy = entry.versionMadeBy >> 8;
    if (!isDirectory) {
      isDirectory = madeBy === 0 && entry.externalFileAttributes === 16;
    }

    const extractedMode = this.getExtractedMode(mode, isDirectory) & 0o777;
    const destinationDirectory = isDirectory
      ? destination
      : path.dirname(destination);
    await fs.mkdir(destinationDirectory, {
      recursive: true,
      ...(isDirectory ? { mode: extractedMode } : {}),
    });
    if (isDirectory) return;

    const readStream = await promisify(
      this.zipfile.openReadStream.bind(this.zipfile)
    )(entry);

    if (isSymlink) {
      const link = await getStream(readStream);
      const realParent = await fs.realpath(path.dirname(destination));
      const resolvedLink = path.resolve(realParent, link);
      if (isOutside(this.opts.dir, resolvedLink)) {
        throw new Error(
          `Out of bound symlink target "${link}" found while processing file ${entry.fileName}`
        );
      }
      await fs.symlink(link, destination);
      return;
    }

    await pipeline(
      readStream,
      createWriteStream(destination, { mode: extractedMode })
    );
  }

  getExtractedMode(entryMode, isDirectory) {
    if (entryMode !== 0) return entryMode;
    const configuredMode = isDirectory
      ? this.opts.defaultDirMode
      : this.opts.defaultFileMode;
    return configuredMode
      ? parseInt(configuredMode, 10)
      : isDirectory
      ? 0o755
      : 0o644;
  }
}

module.exports = async (zipPath, opts) => {
  if (!path.isAbsolute(opts.dir)) {
    throw new Error('Target directory is expected to be absolute');
  }
  await fs.mkdir(opts.dir, { recursive: true });
  opts.dir = await fs.realpath(opts.dir);
  return new Extractor(zipPath, opts).extract();
};
