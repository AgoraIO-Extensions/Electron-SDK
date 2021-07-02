const fs = require("fs-extra");
const { getOS } = require("./util");
const path = require("path");

const destSDKDir = path.join(__dirname, `../sdk/lib/${getOS()}`);

exports.destSDKDir = destSDKDir;

exports.cleanLibsDir = async () => await fs.remove(destSDKDir);

exports.cleanBuildDir = async () =>
  await fs.remove(`${path.resolve(__dirname, "../build")}`);

exports.cleanJSDir = async () =>
  await fs.remove(`${path.resolve(__dirname, "../js")}`);

exports.cleanTypesDir = async () =>
  await fs.remove(`${path.resolve(__dirname, "../types")}`);
