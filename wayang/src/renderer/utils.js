const os = require("os");
const path = require("path");
let appFolder = path.resolve(__dirname, "../");
if (process.env.NODE_ENV === "production") {
  appFolder = path.resolve(process.resourcesPath, "./app");
}

let usrFolder = path.resolve(os.homedir(), "wayang");

let binFolder = path.resolve(appFolder, "./bin");
let libFolder = path.resolve(appFolder, "./lib");

export { appFolder, usrFolder, binFolder, libFolder };
