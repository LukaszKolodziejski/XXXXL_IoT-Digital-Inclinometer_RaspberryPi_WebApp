import React from "react";
import styles from "./Options.module.css";
import OptionsItem from "./OptionsItem/OptionsItem";

const Options = React.memo((props) => {
  return (
    <div className={styles.Options}>
      {props.values.map((value) => {
        return (
          <OptionsItem
            key={value}
            value={value}
            text={props.text}
            onValue={props.onClick}
          />
        );
      })}
    </div>
  );
});

export default Options;
