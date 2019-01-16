const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const path = require('path')

let jsdoc = fs.createWriteStream(
  path.resolve(__dirname, '../docs/apis.md')
);

jsdoc2md.render({ 
  files: path.resolve(__dirname, '../js/Api/index.js') 
}).then(res => {
  jsdoc.write(res)
})