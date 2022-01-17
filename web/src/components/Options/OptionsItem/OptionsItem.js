import React, { useState } from "react";
import styles from "./OptionsItem.module.css";
import Status from "../../Status/Status";
import { COLORS } from "../../../constants/colors";

const OptionsItem = React.memo((props) => {
  const [active, setActive] = useState(false);
  const { value, text, onValue } = props;

  const getValueHandler = (option, activeState) => {
    setActive((prev) => !prev);
    onValue(option, !activeState);
  };

  const style = [styles.OptionsItem, active ? styles.Active : null].join(" ");
  const color = active ? COLORS[`${value}`] : COLORS.option;

  return (
    <span className={style} onClick={() => getValueHandler(value, active)}>
      {active ? <Status /> : null}
      <span style={{ color }}>
        {text} {value}
      </span>
    </span>
  );
});

export default OptionsItem;
