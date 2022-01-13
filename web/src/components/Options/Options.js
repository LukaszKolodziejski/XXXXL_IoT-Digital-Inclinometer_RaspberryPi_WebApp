import React, { useState, useEffect } from "react";
import styles from "./Options.module.css";
import OptionsItem from "./OptionsItem/OptionsItem";

const Options = (props) => {
  const [options, setOptions] = useState(
    props.values.map((value) => ({ text: value, active: false }))
  );

  const clickOptionItemHandler = (option, active) => {
    const newOptions = options.map((opt) =>
      opt.text === option ? { ...opt, active } : opt
    );
    setOptions(newOptions);
  };

  useEffect(() => {
    console.log(options);
  }, [options]);

  return (
    <div className={styles.Options}>
      {props.values.map((value) => {
        return (
          <OptionsItem
            key={value}
            text={value}
            onValue={clickOptionItemHandler}
          />
        );
      })}
    </div>
  );
};

export default Options;
