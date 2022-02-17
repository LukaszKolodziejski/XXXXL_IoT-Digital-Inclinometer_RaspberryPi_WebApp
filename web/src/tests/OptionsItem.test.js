import React from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import styles from "../components/Options/OptionsItem/OptionsItem.module.css";
import Status from "../components/Status/Status";
import { COLORS } from "../constants/colors";

import OptionsItem from "../components/Options/OptionsItem/OptionsItem";

configure({ adapter: new Adapter() });
const value = "";
const text = "";
const onValue = () => {};
const active = true;
const selected = 0;
const index = 0;

const getValueHandler = (option, activeState) => onValue(option, !activeState);

const style = [styles.OptionsItem, active ? styles.Active : null].join(" ");
const color = active ? COLORS[`${value}`] : COLORS.option;

describe("<OptionsItem />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <OptionsItem
        value={value}
        text={text}
        onValue={onValue}
        active={active}
        selected={selected}
        index={index}
      />
    );
  });

  it("should render <Status /> ", () => {
    expect(wrapper.find(Status)).toHaveLength(1);
  });

  it("should contains image with styles ", () => {
    expect(
      wrapper.contains(
        <span className={style} onClick={() => getValueHandler(value, active)}>
          {active ? <Status /> : null}
          <span style={{ color }}>
            {text} {value}
            {selected === index ? <div className={styles.Selected} /> : null}
          </span>
        </span>
      )
    ).toEqual(false);
  });
});
