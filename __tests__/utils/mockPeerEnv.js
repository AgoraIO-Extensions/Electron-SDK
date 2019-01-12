console.log('mocking elements...');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
global.document = new JSDOM(`...`).window.document;
global.navigator = {
  userAgent: 'node.js'
};
