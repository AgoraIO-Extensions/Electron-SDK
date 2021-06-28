const { logger } = require("just-task");
const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");

const productSrc = "../build/Release/agora_node_ext.node";

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
const createTmpProduct = async () => {
  const fileName = `agora_node_ext_${new Date().getTime()}.node`;
  const fileConfig = {
    src: path.join(__dirname, `../${fileName}`),
    fileName
  };
  await fs.move(path.join(__dirname, productSrc), fileConfig.src);
  return fileConfig;
};

module.exports = {
  lipoCreate,
  createTmpProduct
};
