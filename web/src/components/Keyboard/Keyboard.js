import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

const Keyboard = React.memo((props) => {
  const keyDownHandler = (key) => {
    if (key === "up") {
      props.onChangeApprox((prevData) =>
        prevData + 1 <= 40 ? prevData + 1 : prevData
      );
    } else if (key === "down") {
      props.onChangeApprox((prevData) =>
        prevData - 1 >= 1 ? prevData - 1 : prevData
      );
    }
  };
  return (
    <KeyboardEventHandler handleKeys={props.keys} onKeyEvent={keyDownHandler} />
  );
});

export default Keyboard;
