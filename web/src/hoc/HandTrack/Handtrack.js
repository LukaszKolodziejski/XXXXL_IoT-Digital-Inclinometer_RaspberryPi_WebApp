import React, { Fragment, useState, useEffect, useRef } from "react";
import * as handTrack from "handtrackjs";
import * as actions from "../../store/actions/index";
import { useDispatch, useSelector } from "react-redux";
import { modelParams } from "../../constants/modelParams";
import styles from "./Handtrack.module.css";

const Handtrack = (props) => {
  const [model, setModel] = useState(null);
  const dispatch = useDispatch();
  const onChangePredictions = (predictions) =>
    dispatch(actions.changePredictions(predictions));

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isVideo, setIsVideo] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const runDetectionInterval = async (model) => runDetection(model);

  const stopDetectionInterval = () => {
    setIntervalId(null);
    clearInterval(intervalId);
  };

  useEffect(() => {
    handTrack.load(modelParams).then((lmodel) => setModel(lmodel));
    const clear = async () => {
      stopDetectionInterval();
      handTrack.stopVideo(webcamRef.current);
    };
    clear();
  }, []);

  const toggleVideo = async () => {
    if (!isVideo) {
      startVideo();
      setIsVideo(true);
    } else {
      handTrack.stopVideo(webcamRef.current);
      setIsVideo(false);
      stopDetectionInterval();
    }
  };

  const startVideo = async () => {
    handTrack.startVideo(webcamRef.current).then((status) => {
      if (status) {
        setIsVideo(true);
        const detection = setInterval(() => {
          runDetectionInterval(model);
        }, 250);
        setIntervalId(detection);
      }
    });
  };

  const runDetection = async (modelImg) => {
    if (webcamRef.current) {
      modelImg.detect(webcamRef.current).then((predictions) => {
        // console.log("Predictions: ", predictions);
        onChangePredictions(predictions);
        if (canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          modelImg.renderPredictions(
            predictions,
            canvasRef.current,
            context,
            webcamRef.current
          );
          if (isVideo) requestAnimationFrame(runDetection);
        }
      });
    }
  };

  return (
    <Fragment>
      <div className={styles.Container}>
        <div onClick={toggleVideo} className={styles.Btn}>
          {isVideo ? "Close camera" : "Open camera"}
        </div>
        <div className={isVideo ? null : styles.Handtrack}>
          <video ref={webcamRef} className={styles.Video}></video>
          <canvas ref={canvasRef} className={styles.Canvas} />
        </div>
      </div>
      {props.children}
    </Fragment>
  );
};

export default Handtrack;
