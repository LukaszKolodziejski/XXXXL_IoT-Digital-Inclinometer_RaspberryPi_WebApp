import React from "react";
import styles from "../../styles/styles.module.css";
import Navigation from "../../components/Navigation/Navigation";
const Layout = (props) => {
  return (
    <div className={styles.Layout}>
      <Navigation />
      {props.children}
    </div>
  );
};

export default Layout;
