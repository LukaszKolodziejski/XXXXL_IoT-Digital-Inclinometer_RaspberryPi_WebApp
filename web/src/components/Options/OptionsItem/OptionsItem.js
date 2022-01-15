import React, { useState, useEffect } from "react";
import styles from "./OptionsItem.module.css";
import Status from "../../Status/Status";

const OptionsItem = React.memo((props) => {
  const [active, setActive] = useState(false);
  const { text, onValue } = props;

  const getValueHandler = (option, activeState) => {
    setActive((prev) => !prev);
    onValue(option, !activeState);
  };

  const style = [styles.OptionsItem, active ? styles.Active : null].join(" ");

  return (
    <span className={style} onClick={() => getValueHandler(text, active)}>
      {active ? <Status /> : null}
      <span>Axis {text}</span>
    </span>
  );
});

export default OptionsItem;
