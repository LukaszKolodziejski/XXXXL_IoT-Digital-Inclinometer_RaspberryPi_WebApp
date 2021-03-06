import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./Options.module.css";
import OptionsItem from "./OptionsItem/OptionsItem";

const Options = React.memo((props) => {
  return (
    <div className={styles.Options}>
      {props.options.map((opt, index) => (
        <Fragment key={index}>
          <OptionsItem
            index={index}
            value={opt.text}
            text={props.text}
            active={opt.active}
            selected={props.selected}
            onValue={props.onClick}
          />
        </Fragment>
      ))}
    </div>
  );
});

Options.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default Options;
