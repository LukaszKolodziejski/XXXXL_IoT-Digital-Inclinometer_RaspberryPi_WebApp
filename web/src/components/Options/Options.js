import React from "react";
import styles from "./Options.module.css";
import OptionsItem from "./OptionsItem/OptionsItem";

const Options = React.memo((props) => {
  return (
    <div className={styles.Options}>
      {props.options.map((opt, index) => {
        return (
          <OptionsItem
            key={opt.index}
            index={index}
            value={opt.text}
            text={props.text}
            active={opt.active}
            selected={props.selected}
            onValue={props.onClick}
          />
        );
      })}
    </div>
  );
});

export default Options;
