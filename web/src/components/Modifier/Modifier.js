import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./Modifier.module.css";
import Keyboard from "../../components/Keyboard/Keyboard";

const Modifier = React.memo((props) => {
  return (
    <Fragment>
      <Keyboard keys={["up", "down"]} onChangeApprox={props.onChangeApprox} />
      <div className={styles.Modifier}>
        <div className={styles.Modifier__Percent}>Approx: {props.approx}</div>
        <div className={styles.Modifier__Block}>
          <div
            className={styles.Modifier__Zip}
            style={{ marginTop: `${29.6 - props.approx * 0.7}vh` }}
          ></div>
        </div>
      </div>
    </Fragment>
  );
});

Modifier.propTypes = {
  approx: PropTypes.number.isRequired,
  onChangeApprox: PropTypes.func.isRequired,
};

export default Modifier;
