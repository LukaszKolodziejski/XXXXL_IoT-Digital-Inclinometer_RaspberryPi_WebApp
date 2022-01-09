import { Leds } from "node-sense-hat";

import { IMU } from "./constants/IMU";
import { ValueX, AxisX, AxisY } from "./models/Matrix";
import { fillOutMatirx } from "./controllers/matrix";
import { initProtocols } from "./functions/initProtocols";
import Socket from "./protocols/Socket";
import Mqtt from "./protocols/Mqtt";
import Http from "./protocols/Http";
import Tcp from "./protocols/Tcp";
import Udp from "./protocols/Udp";
import { topic } from "./constants/mqtt";

Leds.setRotation(180);

const rawDataHandler = (data) => {
  const startTime = new Date().getTime();
  return { data, startTime };
};

const sendRawData = (data) => {
  //TODO: rawData -> data
  // HTTP || transferTime => OK
  Http.setRawData(rawDataHandler(data));
  // Websocket || transferTime => OK
  Socket.getIO().emit("serverData", {
    action: "create",
    rawData: rawDataHandler(data),
  });
  // Socket.getIO().emit("serverData", { action: "create", rawData });
  // // MQTT
  // Mqtt.getClient().publish(topic, rawData, { qos: 0, retain: false });
  // TCP || transferTime => OK
  Tcp.getSocket().write(Buffer.from(JSON.stringify(rawDataHandler(data))));
  // // UDP
  // Udp.getSocket().send(rawData);
};

const timeSynchronizationHandler = () => {
  const start = new Date().getTime() + 10;
  Socket.getIO().emit("syncTime", { action: "sync", start });
};

const main = () => {
  let actualSample = 0;
  let ax_sum = 0;
  let ay_sum = 0;
  let az_sum = 0;

  const angleArrayX = [];
  const angleArrayY = [];
  const timeArray = [];

  const loop = IMU.length;
  const countSample = 10; // aproximation 10
  const delay = 21;
  const stack = 10;
  let start, end, time;

  initProtocols();

  setInterval(() => {
    timeSynchronizationHandler();
    for (let i = 0; i < loop; i++) {
      setTimeout(() => {
        start = new Date().getTime();
        IMU[i].getValue((err, data) => {
          sendRawData(data);
          const ax = data.accel["x"];
          const ay = data.accel["y"];
          const az = data.accel["z"];
          ax_sum += ax;
          ay_sum += ay;
          az_sum += az;
          end = new Date().getTime();
          time = end - start;
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
      // console.log(`> > ${angleArrayXCopy}`);

      const medianPointerArrayX = Math.floor(angleArrayXCopy.length / 2);
      const medianPointerArrayY = Math.floor(angleArrayYCopy.length / 2);

      const angleMedianArrayX = angleArrayXCopy[medianPointerArrayX];
      const angleMedianArrayY = angleArrayYCopy[medianPointerArrayY];

      // console.log("angleMedianArrayX");
      // console.log(angleMedianArrayX);

      ValueX.angle = angleMedianArrayX;
      AxisX.angle = angleMedianArrayX;
      AxisY.angle = angleMedianArrayY;

      //TODO: This work.
      // sendRawData(ValueX.angle);

      fillOutMatirx(ValueX, AxisX, AxisY);

      angleArrayX.length = 0;
      angleArrayY.length = 0;

      let sumeOfTime = 0;
      const loopDelay = delay / loop;
      timeArray.forEach((time) => (sumeOfTime += time));
      const sensorDelay = sumeOfTime / timeArray.length;

      // console.log(`loopDelay: ${loopDelay} | sensorDelay: ${sensorDelay}`);

      timeArray.length = 0;
    }
  }, delay);
};

main();
