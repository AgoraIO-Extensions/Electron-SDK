import fs from 'fs';
import jsdoc2md from 'jsdoc-to-markdown';
import path from 'path';

const jsDocWriteStream = fs.createWriteStream(
  path.resolve(__dirname, '../docs/apis.md')
);

const getData = jsdoc2md.getTemplateData({
  files: path.resolve(__dirname, '../js/Api/index.js')
});

// generate js api doc
getData.then(res => {
  jsdoc2md.render({
    data: res
  }).then(res => {
    jsDocWriteStream.write(res);
  });
});