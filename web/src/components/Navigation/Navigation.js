import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const Navigation = (props) => {
  const location = useLocation();
  const refreshPage = () => window.location.reload();
  return (
    <header className={styles.Navigation}>
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
      <div className={styles.Logout} onClick={refreshPage}>
        <NavLink to={`${location.pathname}`} exact>
          Reconnect
        </NavLink>
      </div>
    </header>
  );
};

export default Navigation;
