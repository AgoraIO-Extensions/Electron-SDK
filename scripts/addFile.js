var fs = require("fs");
path = require("path");

walk = function (r) {
  let t,
    e = [],
    n = null;
  try {
    t = fs.readdirSync(r);
  } catch (r) {
    n = r.toString();
  }
  if (n) return n;
  var a = 0;
  return (function n() {
    var i = t[a++];
    if (!i) return e;
    let u = path.resolve(r, i);
    i = r + "/" + i;
    let c = fs.statSync(u);
    if (c && c.isDirectory()) {
      let r = walk(i);
      return (e = e.concat(r)), n();
    }
    return e.push(i), n();
  })();
};

console.log(`${process.argv }`)
console.log(`add File ${process.argv[2]}`)
const res = walk(process.argv[2])
res.join(" ");
console.log(res);
