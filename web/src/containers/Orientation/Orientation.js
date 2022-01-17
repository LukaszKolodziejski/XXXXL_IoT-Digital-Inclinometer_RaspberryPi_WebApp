import React, { useState, useEffect, useCallback, useRef } from "react";

import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import styles from "./Orientation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { countAnglesHandler } from "../../utils/utils";
import * as actions from "../../store/actions/index";

const NAMES = ["X", "Y", "Z"];

const Orientation = React.memo((props) => {
  const [options, setOptions] = useState(
    NAMES.map((name) => ({ text: name, active: false }))
  );

  const websocketRawData = useSelector(
    (state) => state.protocols.websocket.rawData
  );
  const syncTime = useSelector((state) => state.protocols.websocket.syncTime);

  const dispatch = useDispatch();
  const onSocketValue = (ws) => dispatch(actions.socketValueHandler(ws));

  const clickOptionItemHandler = (option, active) => {
    const newOptions = options.map((opt) =>
      opt.text === option ? { ...opt, active } : opt
    );
    setOptions(newOptions);
  };

  const receivedDataHandler = useCallback(
    (proof) => {
      if (proof.rawData) {
        const { data, startTime } = proof.rawData;
        const endTime = new Date().getTime();
        const transferTime = endTime - startTime - syncTime;
        const angle = countAnglesHandler(data);
        // console.log("transferTime");
        // console.log(transferTime);

        return {
          angle,
          transferTime,
        };
      }
    },
    [syncTime]
  );

  // Websocket
  useEffect(() => {
    onSocketValue(receivedDataHandler(websocketRawData));
  }, [websocketRawData]);

  return (
    <div className={styles.Orientation}>
      <Options text="Axis" values={NAMES} onClick={clickOptionItemHandler} />
      <Chart kind="orientation" options={options} />
    </div>
  );
});

export default Orientation;
