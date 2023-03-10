const { logger } = require("just-task");
const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const cleanup = require("./cleanup");

const productSrc = "../build/Release/agora_node_ext.node";
const productVideoSourceSrc = "../build/Release/VideoSource";

const tempSymbolsPath = "../symbols";
const productSymbolPath = "../build/Release";
const productSymbolName = "agora_node_ext.node.dSYM";
const productVideoSourceSymbolName = "VideoSource.dSYM";


const lipoCreate = (file1, file2) => {
  const cmd = `lipo -create ${file1.src} ${file2.src} -output ${path.join(
    __dirname,
    productSrc
  )}`;
  shell.exec(cmd, { silent: false }, () => {
    fs.remove(file1.src);
    fs.remove(file2.src);
  });
};
const lipoCreateVideoSource = (file1, file2) => {
  const cmd = `lipo -create ${file1.src} ${file2.src} -output ${path.join(
    __dirname,
    productVideoSourceSrc
  )}`;
  shell.exec(cmd, { silent: false }, () => {
    fs.remove(file1.src);
    fs.remove(file2.src);
  });
};
const createTmpProduct = async () => {
  const fileName = `agora_node_ext_${new Date().getTime()}.node`;
  const fileConfig = {
    src: path.join(__dirname, `../${fileName}`),
    fileName
  };
  await fs.move(path.join(__dirname, productSrc), fileConfig.src);
  return fileConfig;
};
const createTmpVideoSourceProduct = async () => {
  const fileName = `VideoSource_${new Date().getTime()}`;
  const fileConfig = {
    src: path.join(__dirname, `../${fileName}`),
    fileName
  };
  await fs.move(path.join(__dirname, productVideoSourceSrc), fileConfig.src);
  return fileConfig;
};

const backupSymbol = async arch => {
  const destPath = path.join(__dirname, tempSymbolsPath, arch);
  logger.info('backup symbols to ', destPath);

  await cleanup(destPath);
  await fs.mkdir(destPath, { recursive: true });
  await fs.move(
    path.join(__dirname, productSymbolPath, productSymbolName),
    path.join(destPath, productSymbolName)
  );
  await fs.move(
    path.join(__dirname, productSymbolPath, productVideoSourceSymbolName),
    path.join(destPath, productVideoSourceSymbolName)
  );
};

const restoreSymbols = async () => {
  const tempPath = path.join(__dirname, tempSymbolsPath);
  const destPath = path.join(__dirname, productSymbolPath, 'symbols');

  logger.info('restore symbols to ', destPath);
  await fs.move(tempPath, destPath);
};

module.exports = {
  lipoCreate,
  createTmpProduct,
  createTmpVideoSourceProduct,
  lipoCreateVideoSource,
  backupSymbol,
  restoreSymbols
};
