import React, { Component } from "react";
import SelectData from "./SelectData";
import ViewData from "./ViewData";
import CleanData from "./CleanData";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Button from "react-bootstrap/Button";

// TODO Uncouple the data manipulation logic from the pages
class Main extends Component {
  state = {
    //current page
    step: 1,

    //selected data type
    DataType: "csv",

    //can be data or a URL
    InputData:
      "https://en.wikipedia.org/wiki/List_of_slow_rotators_(minor_planets)",

    TestLinks: [
      "https://raw.githubusercontent.com/AndyStobirski/tabular-vis.js/main/v1/demo.html",
      "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes",
      "https://en.wikipedia.org/wiki/List_of_slow_rotators_(minor_planets)",
    ],

    HeaderPresent: true,

    dataSelected: null,
    dataArray: null,

    columnDefinitions: null,
    dataToClean: null,

    dataToView: null,
    colHeadersView: null,

    visualise: null,

    isPaneOpenLeft: false,

    screenTitles: ["Select Data", "Clean Data", "View Data"],
  };

  /**
   *
   * @param {*} property
   * @param {*} value
   * @param {*} func optional callback parameter - see https://stackoverflow.com/a/37401726
   */
  UpdateStateValue = (property, value, func) => {
    this.setState({ [property]: value }, func);

    //console.log(this.state.dataArray);
  };

  //proceed to the next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };
  gotoStep = (newStep) => {
    this.setState({
      step: newStep,
    });
  };

  //Handle fields change
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  //proceed to the previos step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  getPage = () => {
    const { step } = this.state;
    const {
      DataType,
      InputData,
      HeaderPresent,
      dataSelected,
      dataArray,
      columnDefinitions,
      dataToView,
      colHeadersView,
      dataToClean,
      visualise,
      TestLinks,
    } = this.state;

    const values = {
      DataType,
      InputData,
      HeaderPresent,
      dataSelected,
      dataArray,
      columnDefinitions,
      dataToView,
      colHeadersView,
      dataToClean,
      visualise,
      TestLinks,
    };

    // eslint-disable-next-line default-case
    switch (step) {
      case 1:
        return (
          <SelectData
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
            updateStateValue={this.UpdateStateValue}
          />
        );

      case 2:
        return (
          <CleanData
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
            updateStateValue={this.UpdateStateValue}
          />
        );

      case 3:
        return (
          <ViewData
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
            updateStateValue={this.UpdateStateValue}
          />
        );
    }
  };

  //https://codepen.io/ekros/pen/MeeMGj
  //https://ticlo.github.io/rc-dock/examples/#basic

  //figure out what step we're on and display the relevant page
  render() {
    return <div>{this.getPage()}</div>;
  }
}

export default Main;
