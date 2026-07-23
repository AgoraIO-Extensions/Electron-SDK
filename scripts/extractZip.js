'use strict';

const os = require('os');
const path = require('path');

const extract = require('extract-zip');
const fs = require('fs-extra');

const toArchivePath = (filePath) => filePath.split(path.sep).join('/');

const stripPath = (filePath, count) => {
  if (!count) {
    return filePath;
  }

  return filePath.split('/').slice(count).join('/');
};

const collectEntries = async (root, metadata, relativeDir = '') => {
  const directory = path.join(root, relativeDir);
  const names = (await fs.readdir(directory)).sort();
  const entries = [];

  for (const name of names) {
    const relativePath = path.join(relativeDir, name);
    const archivePath = toArchivePath(relativePath);
    const sourcePath = path.join(root, relativePath);
    const stat = await fs.lstat(sourcePath);

    const entryMetadata = metadata.get(archivePath) || {};
    const isDirectory = stat.isDirectory();
    const isSymbolicLink = stat.isSymbolicLink();
    const linkname = isSymbolicLink ? await fs.readlink(sourcePath) : null;
    const entry = {
      path: archivePath,
      type: isSymbolicLink ? 'symlink' : isDirectory ? 'directory' : 'file',
      data: isDirectory
        ? Buffer.alloc(0)
        : isSymbolicLink
        ? Buffer.from(linkname)
        : await fs.readFile(sourcePath),
      mode: entryMetadata.mode || stat.mode,
      mtime: entryMetadata.mtime || stat.mtime,
    };
    if (isSymbolicLink) {
      entry.linkname = linkname;
    }
    entries.push(entry);

    if (isDirectory) {
      entries.push(...(await collectEntries(root, metadata, relativePath)));
    }
  }

  return entries;
};

const validateDestination = (output, filePath, allowRoot = false) => {
  if (allowRoot && filePath === '') {
    return output;
  }

  if (typeof filePath !== 'string' || !filePath || path.isAbsolute(filePath)) {
    throw new Error(
      `Refusing to write outside the output directory: ${filePath}`
    );
  }

  const destination = path.resolve(output, filePath);
  const relative = path.relative(output, destination);
  if (
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(
      `Refusing to write outside the output directory: ${filePath}`
    );
  }

  return destination;
};

const validateSymlinkTarget = (output, entry) => {
  if (!entry.linkname || path.isAbsolute(entry.linkname)) {
    throw new Error(
      `Refusing to link outside the output directory: ${entry.linkname}`
    );
  }

  const linkPath = validateDestination(output, entry.path);
  const targetPath = path.resolve(path.dirname(linkPath), entry.linkname);
  const relativeTarget = path.relative(output, targetPath);
  if (
    relativeTarget === '..' ||
    relativeTarget.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeTarget)
  ) {
    throw new Error(
      `Refusing to link outside the output directory: ${entry.linkname}`
    );
  }
};

const writeEntry = async (entry, output, realOutput) => {
  const destination = validateDestination(output, entry.path);

  if (entry.type === 'directory') {
    await fs.ensureDir(destination);
    const realDestination = await fs.realpath(destination);
    validateDestination(
      realOutput,
      path.relative(realOutput, realDestination),
      true
    );
    await fs.chmod(destination, entry.mode & 0o777);
    await fs.utimes(destination, new Date(), entry.mtime);
    return;
  }

  const parent = path.dirname(destination);
  await fs.ensureDir(parent);
  const realParent = await fs.realpath(parent);
  validateDestination(realOutput, path.relative(realOutput, realParent), true);

  if (entry.type === 'symlink') {
    validateSymlinkTarget(output, entry);
    await fs.symlink(entry.linkname, destination);
    return;
  }

  if (await fs.pathExists(destination)) {
    const destinationStat = await fs.lstat(destination);
    if (destinationStat.isSymbolicLink()) {
      throw new Error(`Refusing to write into a symbolic link: ${entry.path}`);
    }
  }

  await fs.writeFile(destination, entry.data, { mode: entry.mode & 0o777 });
  await fs.chmod(destination, entry.mode & 0o777);
  await fs.utimes(destination, new Date(), entry.mtime);
};

module.exports = async (buffer, output, opts = {}) => {
  const temporaryRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), 'agora-electron-sdk-')
  );
  const archivePath = path.join(temporaryRoot, 'archive.zip');
  const extractDirectory = path.join(temporaryRoot, 'content');

  try {
    await fs.writeFile(archivePath, buffer);
    const metadata = new Map();
    await extract(archivePath, {
      dir: extractDirectory,
      onEntry: (entry) => {
        const mode = (entry.externalFileAttributes >> 16) & 0xffff;
        metadata.set(entry.fileName.replace(/\/$/, ''), {
          mode,
          mtime: entry.getLastModDate(),
        });
      },
    });

    let entries = await collectEntries(extractDirectory, metadata);
    entries = entries
      .map((entry) => ({
        ...entry,
        path: stripPath(entry.path, opts.strip || 0),
      }))
      .filter((entry) => entry.path && (!opts.filter || opts.filter(entry)))
      .map((entry) => (opts.map ? opts.map(entry) : entry));

    for (const entry of entries) {
      validateDestination(output || path.sep, entry.path);
    }

    if (!output) {
      return entries;
    }

    await fs.ensureDir(output);
    const realOutput = await fs.realpath(output);
    for (const entry of entries) {
      await writeEntry(entry, output, realOutput);
    }

    return entries;
  } finally {
    await fs.remove(temporaryRoot);
  }
};
