const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')
const path = require('path')

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