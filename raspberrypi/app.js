import express from "express";

import { Leds, Imu as imu } from "node-sense-hat";

import * as Matrix from "./models/matrix.js";
import {
  setAxisRangePixel,
  separatedNumberX_,
  separatedNumber_X,
  setMainCross,
} from "./controllers/matrix";
import { O, Xcolors } from "./models/colors";

const IMU = new imu.IMU();
// const { Test } = require("./models/matrix");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Serwer działa");
// });

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: err.message });
// });

// const port = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log(`Serve at http://localhost:${port}`);
// });

/////////<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const valueX = {
  angle: 64,
  color: [Xcolors[0], Xcolors[1]],
};
const axisX = {
  angle: 0,
  color: Xcolors[3],
};
const axisY = {
  angle: -60,
  color: Xcolors[2],
};

const fillOutMatirx = (valueX, axisX, axisY) => {
  Leds.setRotation(180);
  const newMatrix = [...Matrix.emptyModel];
  const separatedArrayX_ =
    Matrix.modelsFrom0to9[separatedNumberX_(valueX.angle)];
  const separatedArray_X =
    Matrix.modelsFrom0to9[separatedNumber_X(valueX.angle)];

  const X_ = separatedArrayX_.map((px) => px + Matrix.startX_);
  const _X = separatedArray_X.map((px) => px + Matrix.start_X);

  const axisXpx = setAxisRangePixel("X", axisX.angle);
  const axisYpx = setAxisRangePixel("Y", axisY.angle);

  const matrixArray = X_.concat(_X)
    .concat(axisXpx)
    .concat(axisYpx)
    .sort((a, b) => a - b);

  let pixel = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      pixel = i * 8 + j;
      if (matrixArray.includes(pixel)) {
        if (X_.includes(pixel)) newMatrix[i][j] = valueX.color[0];
        if (_X.includes(pixel)) newMatrix[i][j] = valueX.color[1];
        if (axisYpx.includes(pixel)) newMatrix[i][j] = axisY.color;
        if (axisXpx.includes(pixel)) newMatrix[i][j] = axisX.color;
      } else {
        newMatrix[i][j] = O;
      }
    }
  }
  Leds.setPixels(setMainCross(newMatrix));
};

fillOutMatirx(valueX, axisX, axisY);

// const intervalDelay = delay * matrixArray.length;
// console.log(Leds);
// setInterval(() => {
//   for (let i = 0; i < matrixArray.length; i++)
//     setTimeout(() => {
//       const cross = matrixArray[i];
//       const Xcolor = Xcolors[i];
//       Leds.setPixels(setMainCross(cross(Xcolor)));
//     }, delay * (i + 1));
// }, intervalDelay);

// const axisY = [0, 8, 16, 24, 32, 40, 48, 56];

// console.log(setAxisRangePixel("X", -90));
// console.log(setAxisRangePixel("X", -60));
// console.log(setAxisRangePixel("X", -40));
// console.log(setAxisRangePixel("X", -20));
// console.log(setAxisRangePixel("X", 0));
// console.log(setAxisRangePixel("X", 20));
// console.log(setAxisRangePixel("X", 40));
// console.log(setAxisRangePixel("X", 60));
// console.log(setAxisRangePixel("X", 80));

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const pi = Math.PI;
let ax = 0;
let ay = 0;
let az = 0;
let x = 0;
let y = 0;
let z = 0;

let angle_x = 0;
let angle_y = 0;
let ax_sum = 0;
let ay_sum = 0;
let az_sum = 0;

const angleArray = [];

const countSample = 10; // aproximation 10
const delay = 10; // 400
const show = 20;

setInterval(() => {
  for (let sample = 0; sample < countSample; sample++) {
    //TODO: IMU nie w pętli for tylko, z opóźnieniem delay i od tego aproximation
    IMU.getValue((err, data) => {
      ax = data.accel["x"];
      ay = data.accel["y"];
      az = data.accel["z"];
      ax_sum = ax_sum + ax;
      ay_sum = ay_sum + ay;
      az_sum = az_sum + az;
    });
  }

  x = ax_sum / countSample;
  y = ay_sum / countSample;
  z = az_sum / countSample;

  // Calculate of roll and pitch in deg
  angle_x = Math.atan2(x, Math.sqrt(y * y + z * z)) / (pi / 180);
  angle_y = Math.atan2(y, Math.sqrt(x * x + z * z)) / (pi / 180);

  // Reset values for next aproximation
  ax_sum = 0;
  ay_sum = 0;
  az_sum = 0;

  // console.log("angle_x");
  // console.log(angle_x);
  // console.log("angle_y");
  // console.log(angle_y);

  angleArray.push(angle_x.toFixed(0));
  if (angleArray.length === show) {
    // const angle = angleArray.sort((a, b) => a - b)[show / 2];
    const angle = angleArray.sort((a, b) => a - b);
    console.log(`> > ${angle}`);
    angleArray.length = 0;
    console.log(Math.floor(delay / countSample));
  }
}, delay);
