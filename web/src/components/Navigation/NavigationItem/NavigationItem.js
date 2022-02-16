import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavigationItem.module.css";

const NavigationItem = React.memo((props) => {
  return (
    <div>
      <li className={styles.NavigationItem}>
        <NavLink
          activeClassName={styles.active}
          to={props.link}
          exact={props.exact}
        >
          {props.children}
        </NavLink>
      </li>
    </div>
  );
});

export default NavigationItem;
