const path = require('path');
const fs = require('fs');
const ProgressBar = require('progress');
const download = require('download');

const pkg = require(path.resolve('package.json'));
const platform = process.env.npm_config_platform || process.platform;
const url = pkg[pkg.name][`iris_sdk_${platform}`];

try {
  const dir = (fs.readdirSync(path.resolve('.iris')) || [])[0];
  if (url.includes(dir)) {
    console.warn(`${dir} already exist, skip downloading`);
    return;
  }
} catch (e) {
  console.error(e);
}

let bar = undefined;

download(url, '.iris', {
  extract: true,
  strip: 0,
  // fix unzip error https://github.com/kevva/decompress/issues/46
  filter: (file) => !file.path.endsWith('/'),
  map: (file) => {
    console.log('  unzipping ', file.path);
    return file;
  },
}).on('response', (res) => {
  const len = parseInt(res.headers['content-length'], 10);

  console.log();
  console.log(`Start download ${url}`);
  bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: len,
  });

  res.on('data', function (chunk) {
    bar.tick(chunk.length);
  });

  res.on('end', function () {
    console.log();
    console.log(`Start unzip`);
  });
});
