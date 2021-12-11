import express from "express";

import { Leds, Imu as imu } from "node-sense-hat";

import * as Pixels from "./constants/pixels.js";
import { O } from "./constants/colors";
import { ValueX, AxisX, AxisY } from "./models/Matrix";

import {
  setAxisRangePixel,
  separatedNumberX_,
  separatedNumber_X,
  setMainCross,
} from "./controllers/matrix";

const IMU1 = new imu.IMU();
const IMU2 = new imu.IMU();
const IMU3 = new imu.IMU();
const IMU4 = new imu.IMU();
const IMU = [IMU1, IMU2, IMU3, IMU4];

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

Leds.setRotation(180);

//TODO: fillOutMatirx to another folder
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

let actualSample = 0;
let ax_sum = 0;
let ay_sum = 0;
let az_sum = 0;

const angleArrayX = [];
const angleArrayY = [];
const timeArray = [];

const loop = IMU.length;
const countSample = 10; // aproximation 10
const delay = 21; // 400
const stack = 10;

setInterval(() => {
  for (let i = 0; i < loop; i++) {
    setTimeout(() => {
      const start = new Date().getTime();
      IMU[i].getValue((err, data) => {
        const ax = data.accel["x"];
        const ay = data.accel["y"];
        const az = data.accel["z"];
        ax_sum += ax;
        ay_sum += ay;
        az_sum += az;
        const end = new Date().getTime();
        const time = end - start;
        timeArray.push(time);
      });
      actualSample++;
    }, (delay / loop) * i);
  }

  if (actualSample >= countSample) {
    const x = ax_sum / countSample;
    const y = ay_sum / countSample;
    const z = az_sum / countSample;

    // Calculate of roll and pitch in deg
    const angle_x = Math.atan2(x, Math.sqrt(y * y + z * z)) / (Math.PI / 180);
    const angle_y = Math.atan2(y, Math.sqrt(x * x + z * z)) / (Math.PI / 180);

    actualSample = 0;
    ax_sum = ay_sum = az_sum = 0;
    angleArrayX.push(angle_x.toFixed(0));
    angleArrayY.push(angle_y.toFixed(0));
  }

  if (angleArrayX.length >= stack) {
    // Reset values for next aproximation

    const angleArrayXCopy = [...angleArrayX];
    const angleArrayYCopy = [...angleArrayY];
    angleArrayXCopy.sort((a, b) => a - b);
    angleArrayYCopy.sort((a, b) => a - b);
    console.log(`> > ${angleArrayXCopy}`);

    const medianPointerArrayX = Math.floor(angleArrayXCopy.length / 2);
    const medianPointerArrayY = Math.floor(angleArrayYCopy.length / 2);

    const angleMedianArrayX = angleArrayXCopy[medianPointerArrayX];
    const angleMedianArrayY = angleArrayYCopy[medianPointerArrayY];

    console.log("angleMedianArrayX");
    console.log(angleMedianArrayX);

    ValueX.angle = angleMedianArrayX;
    AxisX.angle = angleMedianArrayX;
    AxisY.angle = angleMedianArrayY;

    fillOutMatirx(ValueX, AxisX, AxisY);

    angleArrayX.length = 0;
    angleArrayY.length = 0;

    let sumeOfTime = 0;
    const loopDelay = delay / loop;
    timeArray.forEach((time) => (sumeOfTime += time));
    const sensorDelay = sumeOfTime / timeArray.length;

    console.log(`loopDelay: ${loopDelay} | sensorDelay: ${sensorDelay}`);

    timeArray.length = 0;
  }
}, delay);
