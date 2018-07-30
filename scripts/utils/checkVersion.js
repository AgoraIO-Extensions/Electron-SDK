const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

function checkVersion(url, callback) {
  let remoteString = checksum(url);
  let localCache = path.join(__dirname, '../../.version-cache');
  fs.readFile(localCache, 'utf8', (err, data) => {
    if (err) {
      fs.writeFile(localCache, remoteString, 'utf8', function(writeErr) {
        if (writeErr) {
          console.error(writeErr);
        }
        callback(false);
      });
    } else if (remoteString === data) {
      callback(true);
    } else {
      fs.writeFile(localCache, remoteString, 'utf8', function(writeErr) {
        if (writeErr) {
          console.error(writeErr);
        }
        callback(false);
      });
    }
  });
}

module.exports = checkVersion;
