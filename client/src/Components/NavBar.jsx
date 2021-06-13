import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

class NavBavr extends Component {
  state = {};
  render() {
    const title = this.props.Title;
    const nextStep = this.props.NextStep;
    const prevStep = this.props.PrevStep;
    const refineStep = this.props.RefineStep;
    const toggleHistory = this.props.toggleHistory;

    return (
      <Navbar bg="primary" expand="sm" variant="dark">
        <Navbar.Brand>{title}</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
        <Button onClick={toggleHistory}>Toggle History</Button>
        {prevStep != null && (
          <Button variant="primary" onClick={prevStep}>
            Previous
          </Button>
        )}{" "}
        {nextStep != null && (
          <Button variant="primary" onClick={nextStep}>
            Next
          </Button>
        )}
        {refineStep != null && (
          <Button variant="primary" onClick={refineStep}>
            Refine
          </Button>
        )}
      </Navbar>
    );
  }
}

export default NavBavr;
