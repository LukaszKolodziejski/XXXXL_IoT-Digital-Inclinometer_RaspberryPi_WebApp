import React from "react";
import Options from "../../components/Options/Options";
import styles from "./Orientation.module.css";

const Orientation = (props) => {
  return (
    <div className={styles.Orientation}>
      <Options values={["X", "Y", "Z"]} />
      <div>Wykres</div>
      <div>Suwak</div>
    </div>
  );
};

export default Orientation;
