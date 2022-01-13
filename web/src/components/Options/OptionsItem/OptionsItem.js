import React, { useState, useEffect } from "react";
import styles from "./OptionsItem.module.css";

const OptionsItem = (props) => {
  const [active, setActive] = useState(false);
  const { text, onValue } = props;

  const getValueHandler = (option, activeState) => {
    setActive((prev) => !prev);
    onValue(option, !activeState);
  };

  const style = [styles.OptionsItem, active ? styles.Active : null].join(" ");

  return (
    <div className={style} onClick={() => getValueHandler(text, active)}>
      {text}
    </div>
  );
};

export default OptionsItem;
