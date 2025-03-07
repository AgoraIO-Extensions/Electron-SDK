const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const extract = require('extract-zip');
const os = require('os');

/**
 * 下载文件到指定目录
 * @param {string} url - 下载URL
 * @param {string} destDir - 目标目录
 * @param {Object} options - 选项
 * @param {boolean} [options.extract=false] - 是否解压缩
 * @param {number} [options.strip=0] - 解压时忽略的目录层级
 * @param {Function} [options.filter] - 过滤文件的函数
 * @param {Function} [options.map] - 修改文件的函数
 * @returns {Promise<string>} - 下载的文件路径或解压后的目录路径
 */
async function download(url, destDir, options = {}) {
    // 确保URL正确编码
    if (!url.includes('%')) {
        url = encodeURI(url);
    }

  // 确保目标目录存在 - 使用递归创建确保父目录也存在
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`Created directory: ${destDir}`);
    }
  } catch (error) {
    throw new Error(`Failed to create destination directory: ${error.message}`);
    }

    // 从URL中获取文件名
    const fileName = path.basename(url);
    const filePath = path.join(destDir, fileName);

  // 确保文件所在目录存在
  const fileDir = path.dirname(filePath);
  try {
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
      console.log(`Created directory: ${fileDir}`);
    }
  } catch (error) {
    throw new Error(`Failed to create file directory: ${error.message}`);
  }

    // 下载文件
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
    }

    if (!response.body) {
        throw new Error('Response body is null');
    }

    // 再次确保目录存在（以防在下载过程中被删除）
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
      console.log(`Re-created directory: ${fileDir}`);
    }

    // 保存文件
    const fileStream = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
        if (response.body) {
          response.body.pipe(fileStream);
          response.body.on('error', reject);
          fileStream.on('finish', resolve);
        } else {
          reject(new Error('Response body is null'));
        }
    });
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }

    // 如果需要解压缩
    if (options.extract && filePath.endsWith('.zip')) {
        try {
            // 创建临时目录用于解压
            const tempDir = path.join(os.tmpdir(), `extract-${Date.now()}`);
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // 先解压到临时目录
            await extract(filePath, { dir: tempDir });

          // 再次确保目标目录存在（以防在解压过程中被删除）
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
            console.log(`Re-created directory before extraction: ${destDir}`);
          }

          // 处理解压后的文件
          await processExtractedFiles(tempDir, destDir, options);

          // 清理临时目录
          fs.rmSync(tempDir, { recursive: true, force: true });

        return destDir;
      } catch (error) {
        throw new Error(`Failed to extract: ${error.message}`);
      }
    }

  return filePath;
}

/**
 * 处理解压后的文件
 * @param {string} tempDir - 临时目录
 * @param {string} destDir - 目标目录
 * @param {Object} options - 选项
 */
async function processExtractedFiles(tempDir, destDir, options) {
  // 确保目标目录存在
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 获取解压后的所有文件和目录
  const entries = await getAllFilesAndDirs(tempDir);

  // 应用map函数修复文件类型
  // 默认的map函数，修复文件类型不一致的问题
  const defaultMap = (file) => {
    if (file.type === 'file' && file.path.endsWith('/')) {
      file.type = 'directory';
    }
    return file;
  };

  // 使用用户提供的map函数或默认map函数
  const mapFunc = options.map || defaultMap;

  // 处理strip参数（忽略目录层级）
  const strip = options.strip || 0;

  // 创建一个映射，存储文件信息
  const fileInfoMap = new Map();

  // 首先收集所有文件信息
  for (const entry of entries) {
    const relativePath = path.relative(tempDir, entry);
    if (!relativePath) continue; // 跳过根目录

    const stat = fs.lstatSync(entry); // 使用lstatSync代替statSync，以便能够检测符号链接
    let fileInfo = {
      path: relativePath,
      type: stat.isSymbolicLink() ? 'symlink' : (stat.isDirectory() ? 'directory' : 'file'),
      data: stat.isFile() && !stat.isSymbolicLink() ? fs.readFileSync(entry) : Buffer.from([]),
      linkTarget: stat.isSymbolicLink() ? fs.readlinkSync(entry) : null
    };

    // 应用map函数
    fileInfo = mapFunc(fileInfo);

    fileInfoMap.set(relativePath, { entry, fileInfo });
  }

  // 处理strip和应用filter
  for (const [relativePath, { entry, fileInfo }] of fileInfoMap.entries()) {
    // 处理strip
    const parts = relativePath.split(path.sep);
    if (parts.length <= strip) continue;

    const strippedParts = parts.slice(strip);
    const strippedPath = strippedParts.join(path.sep);

    // 更新fileInfo.path为strippedPath
    fileInfo.path = strippedPath;

    // 应用filter函数
    if (options.filter) {
      // 创建fileInfo的副本，以便filter函数可以修改它
      const fileInfoCopy = { ...fileInfo };

      // 调用filter函数，如果返回false则跳过此文件
      const shouldKeep = options.filter(fileInfoCopy);
      if (!shouldKeep) {
        continue;
      }

      // 如果filter函数修改了文件属性，更新fileInfo
      fileInfo.path = fileInfoCopy.path;
      fileInfo.type = fileInfoCopy.type;
    }

    // 确保目标目录存在
    const targetDir = path.dirname(path.join(destDir, fileInfo.path));
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    } catch (error) {
      throw new Error(`Failed to create directory ${targetDir}: ${error.message}`);
    }

    // 根据修正后的类型处理
    if (fileInfo.type === 'directory') {
      const dirPath = path.join(destDir, fileInfo.path);
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      } catch (error) {
        throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
      }
    } else if (fileInfo.type === 'symlink') {
      // 处理符号链接
      try {
        const targetPath = path.join(destDir, fileInfo.path);
        // 如果目标已存在，先删除
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }
        // 创建符号链接
        fs.symlinkSync(fileInfo.linkTarget, targetPath);
      } catch (error) {
        throw new Error(`Failed to create symlink ${path.join(destDir, fileInfo.path)}: ${error.message}`);
      }
    } else {
      try {
        fs.copyFileSync(entry, path.join(destDir, fileInfo.path));
      } catch (error) {
        throw new Error(`Failed to copy file ${entry} to ${path.join(destDir, fileInfo.path)}: ${error.message}`);
      }
    }
  }
}

/**
 * 递归获取目录下的所有文件
 * @param {string} dir - 目录路径
 * @returns {Promise<string[]>} - 文件路径数组
 */
async function getAllFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...await getAllFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * 递归获取目录下的所有文件和目录
 * @param {string} dir - 目录路径
 * @returns {Promise<string[]>} - 文件和目录路径数组
 */
async function getAllFilesAndDirs(dir) {
  const result = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
      result.push(fullPath);

        if (entry.isDirectory()) {
          result.push(...await getAllFilesAndDirs(fullPath));
        }
    }

    return result;
}

module.exports = download;
