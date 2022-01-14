import React from "react";
import styles from "./Options.module.css";
import OptionsItem from "./OptionsItem/OptionsItem";

const Options = (props) => {
  return (
    <div className={styles.Options}>
      {props.values.map((value) => {
        return <OptionsItem key={value} text={value} onValue={props.onClick} />;
      })}
    </div>
  );
};

export default Options;
