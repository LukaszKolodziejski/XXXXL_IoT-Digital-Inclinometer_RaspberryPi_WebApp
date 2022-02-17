import React from "react";
import PropTypes from "prop-types";
import styles from "./OptionsItem.module.css";
import Status from "../../Status/Status";
import { COLORS } from "../../../constants/colors";

const OptionsItem = React.memo((props) => {
  const { value, text, onValue, active, selected, index } = props;

  const getValueHandler = (option, activeState) =>
    onValue(option, !activeState);

  const style = [styles.OptionsItem, active ? styles.Active : null].join(" ");
  const color = active ? COLORS[`${value}`] : COLORS.option;

  return (
    <span className={style} onClick={() => getValueHandler(value, active)}>
      {active ? <Status /> : null}
      <span style={{ color }}>
        {text} {value}
        {selected === index ? <div className={styles.Selected} /> : null}
      </span>
    </span>
  );
});

OptionsItem.propTypes = {
  value: PropTypes.string,
  text: PropTypes.string,
  onValue: PropTypes.func,
  active: PropTypes.bool,
  index: PropTypes.number,
};

export default OptionsItem;
