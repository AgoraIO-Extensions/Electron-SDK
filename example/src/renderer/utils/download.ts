import * as fs from 'fs';

import * as os from 'os';
import * as path from 'path';

import fetch from 'node-fetch';

// 使用 require 导入 extract-zip
const extract = require('extract-zip');

/**
 * 文件信息接口
 */
interface FileInfo {
  path: string;
  type: 'file' | 'directory';
  data: Buffer;
}

/**
 * 下载选项接口
 */
interface DownloadOptions {
  extract?: boolean;
  strip?: number;
  filter?: (file: FileInfo) => boolean;
  map?: (file: FileInfo) => FileInfo;
}

/**
 * 下载文件到指定目录
 * @param url 下载URL
 * @param destDir 目标目录
 * @param options 选项，包括是否解压缩、忽略目录层级和文件过滤
 * @returns 下载的文件路径
 */
export async function download(
  url: string,
  destDir: string,
  options: DownloadOptions = {}
): Promise<string> {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
    } catch (error: any) {
      throw new Error(`Failed to extract: ${error.message}`);
    }
  }

  return filePath;
}

/**
 * 处理解压后的文件
 * @param tempDir 临时目录
 * @param destDir 目标目录
 * @param options 选项
 */
async function processExtractedFiles(
  tempDir: string,
  destDir: string,
  options: DownloadOptions
): Promise<void> {
  // 确保目标目录存在
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 获取解压后的所有文件和目录
  const entries = await getAllFilesAndDirs(tempDir);

  // 应用map函数修复文件类型
  // 默认的map函数，修复文件类型不一致的问题
  const defaultMap = (file: FileInfo): FileInfo => {
    if (file.type === 'file' && file.path.endsWith('/')) {
      return { ...file, type: 'directory' };
    }
    return file;
  };

  // 使用用户提供的map函数或默认map函数
  const mapFunc = options.map || defaultMap;

  // 处理strip参数（忽略目录层级）
  const strip = options.strip || 0;

  // 创建一个映射，存储文件信息
  const fileInfoMap = new Map<
    string,
    {
      entry: string;
      fileInfo: FileInfo;
    }
  >();

  // 首先收集所有文件信息
  for (const entry of entries) {
    const relativePath = path.relative(tempDir, entry);
    if (!relativePath) continue; // 跳过根目录

    const stat = fs.statSync(entry);
    let fileInfo: FileInfo = {
      path: relativePath,
      type: stat.isDirectory() ? 'directory' : 'file',
      data: stat.isFile() ? fs.readFileSync(entry) : Buffer.from([]),
    };

    // 应用map函数
    fileInfo = mapFunc(fileInfo);

    fileInfoMap.set(relativePath, { entry, fileInfo });
  }

  // 处理strip和应用filter
  for (const [relativePath, { entry, fileInfo }] of Array.from(
    fileInfoMap.entries()
  )) {
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
    } catch (error: any) {
      throw new Error(
        `Failed to create directory ${targetDir}: ${error.message}`
      );
    }

    // 根据修正后的类型处理
    if (fileInfo.type === 'directory') {
      const dirPath = path.join(destDir, fileInfo.path);
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      } catch (error: any) {
        throw new Error(
          `Failed to create directory ${dirPath}: ${error.message}`
        );
      }
    } else {
      try {
        fs.copyFileSync(entry, path.join(destDir, fileInfo.path));
      } catch (error: any) {
        throw new Error(
          `Failed to copy file ${entry} to ${path.join(
            destDir,
            fileInfo.path
          )}: ${error.message}`
        );
      }
    }
  }
}

/**
 * 递归获取目录下的所有文件和目录
 * @param dir 目录路径
 * @returns 文件和目录路径数组
 */
async function getAllFilesAndDirs(dir: string): Promise<string[]> {
  const result: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    result.push(fullPath);

    if (entry.isDirectory()) {
      result.push(...(await getAllFilesAndDirs(fullPath)));
    }
  }

  return result;
}

export default download;
