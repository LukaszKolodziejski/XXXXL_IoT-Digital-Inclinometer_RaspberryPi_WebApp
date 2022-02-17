import React from "react";

import styles from "../../../styles/styles.module.css";
import Navigation from "../components/Navigation/Navigation";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Layout from "../hoc/Layout/Layout";

configure({ adapter: new Adapter() });

describe("<Layout />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Layout />);
  });

  it("should render <Layout /> which has only one div ", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });

  it("should contain Navigation component", () => {
    expect(wrapper.contains(<Navigation />)).toEqual(true);
  });
});
