import React, { useState, useEffect, useCallback, useRef } from "react";
import openSocket from "socket.io-client";

import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import styles from "./Orientation.module.css";
import {
  CLIENT_ID,
  CONNECT_URL,
  TOPIC,
  OPTIONS,
} from "../../constants/protocols";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../store/actions/index";

const NAMES = ["X", "Y", "Z"];

// >>>>>>>>>>>>>>>>>>>>>>>> New
// const initData = {
//   data: null,
//   transferTime: 0,
//   angle: {
//     X: 0,
//     Y: 0,
//     Z: 0,
//   },
// };
// <<<<<<<<<<<<<<<<<<<<<<<<

const Orientation = React.memo((props) => {
  const [options, setOptions] = useState(
    NAMES.map((name) => ({ text: name, active: false }))
  );
  const [syncTime, setSyncTime] = useState(0);
  const syncTimeRef = useRef();

  const dispatch = useDispatch();
  const onSocketValue = (ws) => dispatch(actions.socketValueHandler(ws));

  useEffect(() => {
    syncTimeRef.current = syncTime;
  });

  const clickOptionItemHandler = (option, active) => {
    const newOptions = options.map((opt) =>
      opt.text === option ? { ...opt, active } : opt
    );
    setOptions(newOptions);
  };

  useEffect(() => {
    console.log(options);
  }, [options]);

  const receivedDataHandler = useCallback(
    (proof) => {
      if (proof.rawData) {
        const { data, startTime } = proof.rawData;
        const endTime = new Date().getTime();
        const transferTime = endTime - startTime - syncTimeRef.current;
        // console.log("transferTime");
        // console.log(transferTime);

        const x = data.accel["x"];
        const y = data.accel["y"];
        const z = data.accel["z"];

        const angle_x =
          Math.atan2(x, Math.sqrt(y * y + z * z)) / (Math.PI / 180);
        const angle_y =
          Math.atan2(y, Math.sqrt(x * x + z * z)) / (Math.PI / 180);
        const angle_z =
          Math.atan2(z, Math.sqrt(x * x + y * y)) / (Math.PI / 180);

        const angle = {
          X: angle_x,
          Y: angle_y,
          Z: angle_z,
        };

        return {
          data,
          angle,
          transferTime,
        };
      }
    },
    [syncTimeRef]
  );

  const timeSynchronizationHandler = (socket) => {
    socket.on("syncTime", (data) => {
      if (data.action === "sync") {
        const end = new Date().getTime();
        setSyncTime(end - data.start);
      }
    });
  };

  useEffect(() => {
    // Websocket
    const socket = openSocket("http://192.168.1.131:8080/", OPTIONS);
    timeSynchronizationHandler(socket);
    socket.on("serverData", (data) => {
      // if (data.action === "create") setSocketValue(receivedDataHandler(data));
      if (data.action === "create") onSocketValue(receivedDataHandler(data));
    });
  }, []);

  return (
    <div className={styles.Orientation}>
      <Options values={NAMES} onClick={clickOptionItemHandler} />
      <Chart options={options} />
      {/* <div></div> Suwak */}
    </div>
  );
});

export default Orientation;
