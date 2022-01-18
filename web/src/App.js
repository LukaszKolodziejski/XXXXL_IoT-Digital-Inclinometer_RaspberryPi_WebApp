import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Layout from "./hoc/Layout/Layout";
import Orientation from "./containers/Orientation/Orientation";
import Shipping from "./containers/Shipping/Shipping";
import Transfer from "./containers/Transfer/Transfer";
import { useDispatch } from "react-redux";
import * as actions from "./store/actions/index";

const App = () => {
  const dispatch = useDispatch();
  const onWebSocketInit = () => dispatch(actions.websocketInit());
  const onHttpInit = () => dispatch(actions.httpInit());
  const onMqttInit = () => dispatch(actions.mqttInit());
  const onTcpInit = () => dispatch(actions.tcpInit());
  const onUdpInit = () => dispatch(actions.udpInit());

  useEffect(() => {
    onWebSocketInit();
    onHttpInit();
    onMqttInit();
    onTcpInit();
    onUdpInit();
  }, []);

  return (
    <Router>
      <Layout>
        <Route path="/" component={Orientation} exact />
        <Route path="/shipping" component={Shipping} />
        <Route path="/transfer-time" component={Transfer} />
      </Layout>
    </Router>
  );
};

export default App;
