import React, { useState, useEffect } from "react";
import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import styles from "./Orientation.module.css";

const NAMES = ["X", "Y", "Z"];

const Orientation = (props) => {
  const [options, setOptions] = useState(
    NAMES.map((name) => ({ text: name, active: false }))
  );

  const clickOptionItemHandler = (option, active) => {
    const newOptions = options.map((opt) =>
      opt.text === option ? { ...opt, active } : opt
    );
    setOptions(newOptions);
  };

  useEffect(() => {
    console.log(options);
  }, [options]);

  return (
    <div className={styles.Orientation}>
      <Options values={NAMES} onClick={clickOptionItemHandler} />
      <Chart options={options} />
      <div>Suwak</div>
    </div>
  );
};

export default Orientation;
