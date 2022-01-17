import { Leds } from "node-sense-hat";

import { IMU } from "./constants/IMU";
import { ValueX, AxisX, AxisY } from "./models/Matrix";
import { fillOutMatirx } from "./controllers/matrix";
import { initProtocols } from "./controllers/initProtocols";
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
  // HTTP
  Http.setRawData(rawDataHandler(data));

  // Websocket
  Socket.getIO().emit("serverData", {
    action: "create",
    rawData: rawDataHandler(data),
  });

  // MQTT
  const TOPIC = Mqtt.getTopic();

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
  const start = new Date().getTime() + 5;
  Socket.getIO().emit("syncTime", { action: "sync", start });
};

const main = () => {
  let actualSample = 0;
  let ax_sum = 0;
  let ay_sum = 0;
  let az_sum = 0;

  let xSamplesArray = new Array(20).fill(0);
  let ySamplesArray = new Array(20).fill(0);

  const angleArrayX = [];
  const angleArrayY = [];

  const timeArray = [];

  const loop = IMU.length;
  const countSample = 10; // approximation 10
  const delay = 21;
  // const stack = 10;
  const stack = 5;
  let start, end, time;

  initProtocols();

  const samplesHandler = (angle, samplesArray) => {
    const ang = Math.floor(angle);
    const copySamples = [...samplesArray];
    copySamples.shift();
    const newSamples = copySamples.concat(ang);
    return newSamples;
  };

  const getApproximationData = (samples) => {
    const angle = [...samples];
    angle.sort((a, b) => a - b);
    const avg = Math.floor((angle[15] + angle[16] + angle[17]) / 3);
    return avg;
  };

  const timeHandler = (start) => {
    end = new Date().getTime();
    time = end - start;
    timeArray.push(time);
    if (actualSample >= countSample) {
      let sumeOfTime = 0;
      const loopDelay = delay / loop;
      timeArray.forEach((time) => (sumeOfTime += time));
      const sensorDelay = sumeOfTime / timeArray.length;
      // console.log(timeArray);
      // console.log(`loopDelay: ${loopDelay} | sensorDelay: ${sensorDelay}`);
      actualSample = 0;
      timeArray.length = 0;
    }
  };

  setInterval(() => {
    timeSynchronization();
    for (let i = 0; i < loop; i++) {
      setTimeout(() => {
        start = new Date().getTime();
        IMU[i].getValue((err, data) => {
          sendRawData(data);
          timeHandler(start);
          const x = data.accel["x"];
          const y = data.accel["y"];
          const z = data.accel["z"];

          const angle_x =
            Math.atan2(x, Math.sqrt(y * y + z * z)) / (Math.PI / 180);
          const angle_y =
            Math.atan2(y, Math.sqrt(x * x + z * z)) / (Math.PI / 180);

          xSamplesArray = samplesHandler(angle_x, xSamplesArray);
          ySamplesArray = samplesHandler(angle_y, ySamplesArray);

          const xApprox = getApproximationData(xSamplesArray);
          const yApprox = getApproximationData(ySamplesArray);

          angleArrayX.push(xApprox);
          angleArrayY.push(yApprox);

          actualSample++;
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

      // console.log("angleMedianArrayX");
      // console.log(angleMedianArrayX);

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
