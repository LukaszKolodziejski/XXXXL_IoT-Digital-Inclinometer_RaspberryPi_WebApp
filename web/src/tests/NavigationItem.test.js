import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../components/Navigation/Navigation.module.css";
import NavigationItem from "../components/Navigation/NavigationItem/NavigationItem";

import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Navigation from "../components/Navigation/Navigation";

configure({ adapter: new Adapter() });

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/",
  }),
}));

describe("<SingleArticle />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Navigation />);
  });

  it("should render <NavigationItem /> ", () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it("shouldn't contain <NavLink to='/' exact> Reconnect </NavLink> without clicked function", () => {
    expect(
      wrapper.contains(
        <NavLink to={`/`} exact>
          Reconnect
        </NavLink>
      )
    ).toEqual(false);
  });

  it("should contains image with styles ", () => {
    expect(
      wrapper.contains(
        <nav className={styles.DeskopOnly}>
          <ul className={styles.NavigationItems}>
            <NavigationItem link="/" exact>
              ORIENTATION
            </NavigationItem>
            <NavigationItem link="/shipping" exact>
              SHIPPING TECHNOLOGIES
            </NavigationItem>
            <NavigationItem link="/transfer-time" exact>
              TRANSFER TIME
            </NavigationItem>
          </ul>
        </nav>
      )
    ).toEqual(true);
  });
});
