import React, { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import Modifier from "../../components/Modifier/Modifier";
import styles from "../../styles/styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { countAnglesHandler } from "../../utils/utils";
import * as actions from "../../store/actions/index";

const NAMES = ["X", "Y", "Z"];

const Orientation = React.memo((props) => {
  const [options, setOptions] = useState(
    NAMES.map((name) => ({ text: name, active: false }))
  );
  const [optionsIndex, setOptionsIndex] = useState(0);
  const [isPredict, setIsPredict] = useState(false);
  const [approx, setApprox] = useState(20);
  const [redirect, setRedirect] = useState("");

  const websocketRawData = useSelector(
    (state) => state.protocols.websocket.rawData
  );
  const syncTime = useSelector((state) => state.protocols.syncTime);
  const predictions = useSelector((state) => state.handtrack.predictions);

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

  /*eslint-disable */
  useEffect(() => {
    const findPredict = predictions.find((pred) => pred.label === "face");
    setIsPredict(findPredict ? true : false);
    if (predictions) {
      const pred = predictions
        .filter((pred) => pred.label !== "face")
        .sort((a, b) => (a.bbox[0] > b.bbox[0] && 1) || -1);

      if (pred.length === 1) {
        const optLength = options.length;
        const hand = pred[0];
        if (hand.label === "open") {
          setOptionsIndex((prev) => (prev < optLength - 1 ? prev + 1 : 0));
        } else if (hand.label === "point") {
          setOptions((prevOptions) => {
            const copyPrevOptions = [...prevOptions];
            copyPrevOptions[optionsIndex].active =
              hand.bbox[0] < 250 ? true : false;
            return copyPrevOptions;
          });
        }
      } else if (pred.length === 2) {
        const leftHand = pred[0].label;
        const rightHand = pred[1].label;
        setTimeout(() => {
          if (leftHand === "open" && rightHand === "closed") {
            setRedirect("/shipping");
          } else if (leftHand === "closed" && rightHand === "open")
            setRedirect("/transfer-time");
        }, 700);
      }
    }
  }, [predictions]);

  // Websocket
  useEffect(() => {
    onSocketValue(receivedDataHandler(websocketRawData));
  }, [websocketRawData]);
  /*eslint-enable */

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div className={styles.Orientation}>
      <Options
        text="Axis"
        options={options}
        selected={isPredict ? optionsIndex : null}
        onClick={clickOptionItemHandler}
      />
      <Chart kind="orientation" options={options} approx={approx} />
      <Modifier approx={approx} onChangeApprox={setApprox} />
    </div>
  );
});

export default Orientation;
