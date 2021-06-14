import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import {
  BiFilterAlt,
  BiRightArrowAlt,
  BiArrowBack,
  BiHistory,
} from "react-icons/bi";

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
        <Button onClick={toggleHistory}>
          <BiHistory />
          Toggle History
        </Button>
        {prevStep != null && (
          <Button variant="primary" onClick={prevStep}>
            <BiArrowBack />
            Previous
          </Button>
        )}{" "}
        {nextStep != null && (
          <Button variant="primary" onClick={nextStep}>
            <BiRightArrowAlt />
            Next
          </Button>
        )}
        {refineStep != null && (
          <Button variant="primary" onClick={refineStep}>
            <BiFilterAlt /> Refine
          </Button>
        )}
      </Navbar>
    );
  }
}

export default NavBavr;
