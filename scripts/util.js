const logger = require("./logger");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("shelljs");
const os = require("os");

const tmpDir = os.tmpdir();
const productSrc = "../build/Release/agora_node_ext.node";

exports.lipoCreate = async (file1, file2) => {
  const cmd = `lipo -create ${file1.src} ${file2.src} -output ${path.join(
    __dirname,
    productSrc
  )}`;
  await exec(cmd, { silent: false });
  await fs.remove(file1.src);
  await fs.remove(file2.src);
};
exports.createTmpProduct = async () => {
  const fileName = `agora_node_ext_${new Date().getTime()}.node`;
  const fileConfig = {
    src: path.join(__dirname, `../${fileName}`),
    fileName,
  };
  await fs.move(path.join(__dirname, productSrc), fileConfig.src);
  return fileConfig;
};

exports.getOS = () => {
  const platform = process.platform;
  if (platform === "darwin") {
    return "mac";
  } else if (platform === "win32") {
    return "win32";
  } else {
    // not supported in temp
    logger.error("Unsupported platform!");
    throw new Error("Unsupported platform!");
  }
};

exports.createTmpDir = async () => await fs.mkdtemp(`${tmpDir}Tmp`);
