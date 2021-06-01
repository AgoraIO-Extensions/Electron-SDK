import { src, dest } from "gulp";
import zip from "gulp-zip";
import { join } from "path";
import { remove, copy } from "fs-extra";

const zipBuild = async () => {
  const destPath = process.cwd();
  const buildPath = `${join(destPath, "./build")}`;
  const jsPath = `${join(destPath, "./js")}`;
  const dist = `${join(destPath, "./dist")}`;
  await remove(dist);
  await copy(buildPath, `${join(dist, "./build")}`);
  await copy(jsPath, `${join(dist, "./js")}`);
  return src(["./dist/**"], {
    cwd: destPath,
  })
    .pipe(zip("electron.zip"))
    .pipe(dest(destPath));
};

export default zipBuild;
