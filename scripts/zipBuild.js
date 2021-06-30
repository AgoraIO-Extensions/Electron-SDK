const { getOS } = require("./util");
const { exec } = require("shelljs");

const zipBuild = async () => {
  const isMac = getOS() === "mac";
  const shellStr = isMac
    ? "zip -ry electron.zip build js"
    : "7z a electron.zip build js";
  const { code, stderr } = await exec(shellStr);
  if (code !== 0) {
    logger.error(stderr);
    cb();
    return;
  }
};

module.exports = zipBuild;
