import { Leds } from "node-sense-hat";
import { IMU } from "./constants/IMU";
import { ValueX, AxisX, AxisY } from "./models/Matrix";
import { fillOutMatirx } from "./controllers/matrix";
import { initProtocols } from "./controllers/initProtocols";
import { TOPIC } from "./constants/mqtt";
import Socket from "./protocols/Socket";
import Mqtt from "./protocols/Mqtt";
import Http from "./protocols/Http";
import Tcp from "./protocols/Tcp";
import Udp from "./protocols/Udp";

Leds.setRotation(180);

const rawDataHandler = (data) => {
  const startTime = new Date().getTime();

  return { data, startTime };
};

const sendRawData = (data) => {
  // console.log(rawDataHandler(data));
  // HTTP
  Http.setRawData(rawDataHandler(data));

  // Websocket
  Socket.getIO().emit("serverData", {
    action: "create",
    rawData: rawDataHandler(data),
  });

  // MQTT
  Mqtt.getClient().publish(TOPIC, JSON.stringify(rawDataHandler(data)), {
    qos: 0,
    retain: false,
  });

  // TCP
  Tcp.getSocket().write(Buffer.from(JSON.stringify(rawDataHandler(data))));

  // UDP
  Udp.getSocket().send(Buffer.from(JSON.stringify(rawDataHandler(data))));
};

const timeSynchronization = () => {
  const start = new Date().getTime() + 10;
  Socket.getIO().emit("syncTime", { action: "sync", start });
};

const main = () => {
  const stack = 5;
  const delay = 21;
  const loop = IMU.length;
  const angleArrayX = [];
  const angleArrayY = [];
  const timeArray = [];
  let timeSample = 0;
  let start, end, time;

  let xSamplesArray = new Array(20).fill(0);
  let ySamplesArray = new Array(20).fill(0);

  initProtocols();

  const samplesHandler = (angle, samplesArray) => {
    const ang = Math.floor(angle);
    const copySamples = [...samplesArray];
    copySamples.shift();
    const newSamples = copySamples.concat(ang);
    return newSamples;
  };

  const getApproximationDataHandler = (samples) => {
    const angle = [...samples];
    angle.sort((a, b) => a - b);
    const avg = Math.floor((angle[15] + angle[16] + angle[17]) / 3);
    return avg;
  };

  const timeHandler = (start) => {
    end = new Date().getTime();
    time = end - start;
    timeArray.push(time);
    if (timeSample >= 10) {
      let sumeOfTime = 0;
      const loopDelay = delay / loop;
      timeArray.forEach((time) => (sumeOfTime += time));
      const sensorDelay = sumeOfTime / timeArray.length;
      // console.log(timeArray);
      // console.log(
      //   `loopDelay: ${loopDelay} ms | sensorDelay: ${sensorDelay} ms`
      // );
      timeSample = 0;
      timeArray.length = 0;
    }
  };

  function y(x) {
    // Declaring the function
    // f(x) = 1/(1+x*x)
    return 1 / (1 + x * x);
  }

  // Function to evaluate the value of integral
  function trapezoidal(a, b, n) {
    // Grid spacing
    let h = (b - a) / n;

    // Computing sum of first and last terms
    // in above formula
    let s = y(a) + y(b);

    // Adding middle terms in above formula
    for (let i = 1; i < n; i += 1) s += 2 * y(a + i * h);

    // h/2 indicates (b-a)/2n. Multiplying h/2
    // with s.
    return (h / 2) * s;
  }

  let angleX = 0;
  let previousGyroAngleX = 0;
  let angle = 0;
  setInterval(() => {
    timeSynchronization();
    for (let i = 0; i < loop; i++) {
      setTimeout(() => {
        start = new Date().getTime();
        IMU[i].getValue((err, data) => {
          end = new Date().getTime();
          sendRawData(data);
          timeHandler(start);
          // console.log(rawDataHandler(data));

          const x = data.accel["x"];
          const y = data.accel["y"];
          const z = data.accel["z"];
          const gx = data.gyro["x"];
          const gy = data.gyro["y"];
          const gz = data.gyro["z"];

          const angle_x =
            Math.atan2(x, Math.sqrt(y * y + z * z)) / (Math.PI / 180);
          const angle_y =
            Math.atan2(y, Math.sqrt(x * x + z * z)) / (Math.PI / 180);

          // Imitacja !!
          const accAngleX = Math.atan2(x, Math.sqrt(y * y + z * z));
          const accAngleY = Math.atan2(y, Math.sqrt(x * x + z * z));

          const dt = end - start;
          const f = 200; // Hz
          const T = 1 / (2 * Math.PI * f);

          const K = T / (T + dt);

          const gyroAngleX = trapezoidal(0, gx, dt);

          if (angleX === 0) {
            angleX = K * (gyroAngleX * dt) + (1 - K) * accAngleX;
          } else {
            angleX =
              K * (angleX + gyroAngleX - previousGyroAngleX) +
              (1 - K) * accAngleX;
          }
          previousGyroAngleX = gyroAngleX;

          // angle = Math.floor(angleX * 58);
          // console.log(angle);

          xSamplesArray = samplesHandler(angle_x, xSamplesArray);
          ySamplesArray = samplesHandler(angle_y, ySamplesArray);

          const xApprox = getApproximationDataHandler(xSamplesArray);
          const yApprox = getApproximationDataHandler(ySamplesArray);

          angleArrayX.push(xApprox);
          angleArrayY.push(yApprox);

          timeSample++;
        });
      }, (delay / loop) * i);
    }

    if (angleArrayX.length >= stack) {
      const angleArrayXCopy = [...angleArrayX];
      const angleArrayYCopy = [...angleArrayY];
      angleArrayXCopy.sort((a, b) => a - b);
      angleArrayYCopy.sort((a, b) => a - b);

      const medianPointerArrayX = Math.floor(angleArrayXCopy.length / 2);
      const medianPointerArrayY = Math.floor(angleArrayYCopy.length / 2);

      const angleMedianArrayX = angleArrayXCopy[medianPointerArrayX];
      const angleMedianArrayY = angleArrayYCopy[medianPointerArrayY];

      ValueX.angle = angleMedianArrayX;
      AxisX.angle = angleMedianArrayX;
      AxisY.angle = angleMedianArrayY;

      fillOutMatirx(ValueX, AxisX, AxisY);

      angleArrayX.length = 0;
      angleArrayY.length = 0;
    }
  }, delay);
};

main();
