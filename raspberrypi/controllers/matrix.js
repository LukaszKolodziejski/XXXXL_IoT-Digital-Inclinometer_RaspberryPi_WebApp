import { Leds } from "node-sense-hat";
import * as Matrix from "../constants/pixels";
import * as Pixels from "../constants/pixels.js";
import { O } from "../constants/colors";

const setAxisRangePixel = (axis, angle) => {
  let matrixAxis;
  if (axis === "X") matrixAxis = Matrix.axisX;
  if (axis === "Y") matrixAxis = Matrix.axisY;

  let pixelY = 0;
  for (let rangeI = -90; rangeI <= 90; rangeI += 20) {
    if (rangeI <= angle && angle <= rangeI + 20) {
      if (pixelY === 0) {
        return [matrixAxis[pixelY]];
      } else if (pixelY === 8) {
        return [matrixAxis[pixelY - 1]];
      } else {
        return [matrixAxis[pixelY - 1], matrixAxis[pixelY]];
      }
    }
    pixelY++;
  }
};

const separatedNumberX_ = (number) => Math.abs((number - (number % 10)) / 10);
const separatedNumber_X = (number) => Math.abs(number % 10);

const setMainCross = (cross) => {
  let mainCross = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      mainCross.push(cross[i][j]);
    }
  }
  return mainCross;
};

const fillOutMatirx = (valueX, axisX, axisY) => {
  const newMatrix = [...Pixels.emptyModel];
  const separatedArrayX_ =
    Pixels.modelsFrom0to9[separatedNumberX_(valueX.angle)];
  const separatedArray_X =
    Pixels.modelsFrom0to9[separatedNumber_X(valueX.angle)];

  const X_ = separatedArrayX_.map((px) => px + Pixels.startX_);
  const _X = separatedArray_X.map((px) => px + Pixels.start_X);

  const axisXpx = setAxisRangePixel("X", axisX.angle);
  const axisYpx = setAxisRangePixel("Y", axisY.angle);

  const matrixArray = X_.concat(_X)
    .concat(axisXpx)
    .concat(axisYpx)
    .sort((a, b) => a - b);

  const absX_ = valueX.angle >= 0 ? 1 : 0;
  const abs_X = valueX.angle >= 0 ? 0 : 1;

  let pixel = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      pixel = i * 8 + j;
      if (matrixArray.includes(pixel)) {
        if (X_.includes(pixel)) newMatrix[i][j] = valueX.color[absX_];
        if (_X.includes(pixel)) newMatrix[i][j] = valueX.color[abs_X];
        if (axisYpx.includes(pixel)) newMatrix[i][j] = axisY.color;
        if (axisXpx.includes(pixel)) newMatrix[i][j] = axisX.color;
      } else {
        newMatrix[i][j] = O;
      }
    }
  }

  Leds.sync.setPixels(setMainCross(newMatrix));
};

// !!!!!!!!!!!! MATRIX !!!!!!!!!!!!!
// fillOutMatirx(valueX, axisX, axisY);

// const axisY = [0, 8, 16, 24, 32, 40, 48, 56];
// console.log(setAxisRangePixel("X", 80));

export { fillOutMatirx };
