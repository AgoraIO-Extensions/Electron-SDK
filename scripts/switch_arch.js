const { logger } = require("just-task");
const path = require("path");
const fs = require('fs-extra')

module.exports = ({
  arch = 'ia32'
}) => {
    logger.info(`switching to ${arch}`)
    if(arch === "ia32") {
        // win32 config
        fs.copyFileSync(path.join(__dirname, '../configs/binding32.gyp'), path.join(__dirname, '../binding.gyp'))
    } else {
        fs.copyFileSync(path.join(__dirname, '../configs/binding64.gyp'), path.join(__dirname, '../binding.gyp'))
    }
};
