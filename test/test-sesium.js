const Cesium = require('cesium');

const f = [
  [120.17753627294758, 30.247268759701008],
  [120.18045704287958, 30.249902530047656],
];
const dest = Cesium.Rectangle.fromCartesianArray(f.map((x) => {
  const r = Cesium.Cartesian3.fromDegrees(...x)
  console.log(x, r);
  return r;
}));
console.log(dest);
