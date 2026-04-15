console.log('mocking elements...');
if (HTMLCanvasElement) {
  HTMLCanvasElement.prototype.getContext = () => {
    return false;
  };
}
global.navigator = {
  userAgent: 'node.js'
};
