import * as Matrix from "../constants/pixels";

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

export {
  setAxisRangePixel,
  separatedNumberX_,
  separatedNumber_X,
  setMainCross,
};
