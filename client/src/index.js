import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./Components/Main";
import Container from "react-bootstrap/Container";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <Container className="container-fluid">
      <Main />
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
