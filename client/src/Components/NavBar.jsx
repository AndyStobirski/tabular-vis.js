import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import {
  BiFilterAlt,
  BiRightArrowAlt,
  BiArrowBack,
  BiHistory,
  BiDownArrowAlt,
} from "react-icons/bi";

class NavBavr extends Component {
  state = {};
  render() {
    const title = this.props.Title;
    const nextStep = this.props.NextStep;
    const prevStep = this.props.PrevStep;
    const refineStep = this.props.RefineStep;
    const download = this.props.download;
    const toggleHistoryDisplay = this.props.toggleHistoryDisplay;

    return (
      <Navbar bg="primary" expand="sm" variant="dark">
        <Navbar.Brand>{title}</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
        <Button onClick={toggleHistoryDisplay}>
          <BiHistory />
          Toggle History
        </Button>
        {download != null && (
          <Button variant="primary" onClick={download}>
            <BiDownArrowAlt />
            Export Grid
          </Button>
        )}
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
