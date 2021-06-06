import React, { Component } from "react";
import SelectData from "./SelectData";
import ViewData from "./ViewData";
import CleanData from "./CleanData";

class Main extends Component {
  state = {
    //current page
    step: 1,

    //selected data type
    DataType: "csv",

    //can be data or a URL
    InputData:
      "https://raw.githubusercontent.com/AndyStobirski/tabular-vis.js/main/demo.html",
    //"https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes",
    //"Column1,Column2,Column3,Columb4\n1,2,3,9\n4,5,6,8\n7,8,9,8",

    HeaderPresent: true,

    dataSelected: null,
    dataArray: null,

    columnDefinitions: null,
    dataToClean: null,

    dataToView: null,
    colsToView: null,

    visualise: null,
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

  //figure out what step we're on and display the relevant page
  render() {
    const { step } = this.state;
    const {
      DataType,
      InputData,
      HeaderPresent,
      dataSelected,
      dataArray,
      columnDefinitions,
      dataToView,
      colsToView,
      dataToClean,
      visualise,
    } = this.state;

    const values = {
      DataType,
      InputData,
      HeaderPresent,
      dataSelected,
      dataArray,
      columnDefinitions,
      dataToView,
      colsToView,
      dataToClean,
      visualise,
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
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
            updateStateValue={this.UpdateStateValue}
          />
        );
    }
  }
}

export default Main;
