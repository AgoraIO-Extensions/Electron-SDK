import { src, dest } from "gulp";
import zip from "gulp-zip";

const zipBuild = () => {
  const destPath = process.cwd();
  return src(["./build", "./js"], {
    cwd: destPath,
  })
    .pipe(zip("electron.zip"))
    .pipe(dest(destPath));
};

export default zipBuild;
