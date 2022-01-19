import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import thunk from "redux-thunk";
import { Provider } from "react-redux";
import orientationReducer from "./store/reducers/orientation";
import shippingReducer from "./store/reducers/shipping";
import protocolsReducer from "./store/reducers/protocols";
import handtrackReducer from "./store/reducers/handtrack";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = {
  orientation: orientationReducer,
  shipping: shippingReducer,
  protocols: protocolsReducer,
  handtrack: handtrackReducer,
};

const store = createStore(
  combineReducers(rootReducer),
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
