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
  angle: 30,
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

const delay = 250;
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

// setInterval(() => {
//   const IMU = new imu.IMU();

//   IMU.getValue((err, data) => {
//     // if (err !== null) {
//     //   console.error("Could not read sensor data: ", err);
//     //   return;
//     // }

//     const headingToDegree = (heading) => {
//       // Convert radians to degrees for readability.
//       // return (heading * 180) / Math.PI;
//       return 1 / heading;
//     };
//     // console.log("Gyroscope is: ", JSON.stringify(data.gyro["x"], null, "  "));
//     console.log("Gyroscope is: ");
//     console.log(
//       "x: ",
//       JSON.stringify(headingToDegree(data.gyro["x"]), null, "  ")
//     );
//     console.log(
//       "y: ",
//       JSON.stringify(headingToDegree(data.gyro["y"]), null, "  ")
//     );
//     console.log(
//       "z: ",
//       JSON.stringify(headingToDegree(data.gyro["z"]), null, "  ")
//     );

//     //   console.log("Accelleration is: ", JSON.stringify(data.accel, null, "  "));
//     //   console.log("Compass is: ", JSON.stringify(data.compass, null, "  "));
//     //   console.log("Fusion data is: ", JSON.stringify(data.fusionPose, null, "  "));

//     //   console.log("Temp is: ", data.temperature);
//     //   console.log("Pressure is: ", data.pressure);
//     //   console.log("Humidity is: ", data.humidity);
//   });
// });

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// const IMU = new imu.IMU();
// console.log("<<<<<<<<<<<<< ");

// const headingCorrection = (heading, offset = 0) => {
//   // Once you have your heading, you must then add your 'Declination Angle', which is the 'Error' of the magnetic field in your location.
//   // Find yours here: http://www.magnetic-declination.com/
//   const declinationAngle = 0.03106686;

//   heading += declinationAngle + offset;

//   // Correct for when signs are reversed.
//   if (heading < 0) {
//     heading += 2 * Math.PI;
//   }

//   // Check for wrap due to addition of declination.
//   if (heading > 2 * Math.PI) {
//     heading -= 2 * Math.PI;
//   }

//   return heading;
// };

// const headingToDegree = (heading) => {
//   // Convert radians to degrees for readability.
//   return (heading * 180) / Math.PI;
// };

// IMU.getValue((err, data) => {
//   if (err !== null) {
//     console.error("Could not read data: ", err);
//   }

//   console.log(
//     "Tilt heading is: ",
//     headingToDegree(headingCorrection(data.tiltHeading, Math.PI / 2))
//   );
// });
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
