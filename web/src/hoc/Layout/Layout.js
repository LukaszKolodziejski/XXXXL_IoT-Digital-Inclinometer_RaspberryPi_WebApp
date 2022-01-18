import React from "react";
import "./Layout.css";
import Navigation from "../../components/Navigation/Navigation";
const Layout = (props) => {
  return (
    <div className="Content">
      <Navigation />
      {props.children}
    </div>
  );
};

export default Layout;
