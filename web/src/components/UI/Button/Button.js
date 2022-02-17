import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = (props) => (
  <button
    className={[styles.Button, styles[props.btnType]].join(" ")}
    disabled={props.disabled}
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

Button.propTypes = {
  clicked: PropTypes.func,
  btnType: PropTypes.string.isRequired,
};

export default Button;
