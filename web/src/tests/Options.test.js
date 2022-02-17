import React, { Fragment } from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import styles from "../components/Options/Options.module.css";

import Options from "../components/Options/Options";
import OptionsItem from "../components/Options/OptionsItem/OptionsItem";

configure({ adapter: new Adapter() });

describe("<Options />", () => {
  let wrapper;

  const text = "Axis";
  const options = [];
  const selected = 0;
  const onClick = () => {};

  beforeEach(() => {
    wrapper = shallow(
      <Options
        text={text}
        options={options}
        selected={selected}
        onClick={onClick}
      />
    );
  });

  it("should render <OptionsItem /> ", () => {
    expect(wrapper.find(<OptionsItem />)).toHaveLength(0);
  });

  it("should contains image with styles ", () => {
    expect(
      wrapper.contains(
        <div className={styles.Options}>
          {options.map((opt, index) => (
            <Fragment key={index}>
              <OptionsItem
                index={index}
                value={opt.text}
                text={text}
                active={opt.active}
                selected={selected}
                onValue={onClick}
              />
            </Fragment>
          ))}
        </div>
      )
    ).toEqual(true);
  });

  it("should render <Fragment /> ", () => {
    expect(wrapper.find(<Fragment key={0} />)).toHaveLength(0);
  });
});
