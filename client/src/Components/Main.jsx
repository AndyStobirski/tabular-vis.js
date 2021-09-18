import React, { Component } from "react";
import SelectData from "./SelectData";
import ViewData from "./ViewData";
import CleanData from "./CleanData";
import History from "./History";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HistoryUtilties from "../Functions/HistoryUtilties";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

/*

  Main.jsx

  This page is the parent of
    1. LoadData.jsx, 
    2. SelectData.jsx
    3. ViewData.jsx

  It decides which of the above pages to display based on the user interactivity.

  On application startup it displays LoadData.jsx - selecting a tabular data 
  source loaded in this page will display the page SelectData.jsx

  SelectData.jsx can navigate back to the page LoadData.jsx or forwards to
  ViewData.jsx
  
  ViewData.jsx can navigate back to the page SelectData.jsx

*/

// TODO Uncouple the data manipulation logic from the pages
class Main extends Component {
  state = {
    step: 1, //current page

    //selected data type
    DataType: "csv",

    //can be data or a URL
    InputData:
      "https://en.wikipedia.org/wiki/List_of_slow_rotators_(minor_planets)", //"https://en.wikipedia.org/wiki/Internet_traffic",

    TestLinks: [
      "https://en.wikipedia.org/wiki/Internet_traffic",
      "https://raw.githubusercontent.com/AndyStobirski/tabular-vis.js/main/v1/demo.html",
      "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes",
      "https://en.wikipedia.org/wiki/List_of_slow_rotators_(minor_planets)",
      "https://en.wikipedia.org/wiki/74th_Illinois_General_Assembly",
      "https://en.wikipedia.org/wiki/Template:Known_and_suspected_companions_of_Earth",
      "https://en.wikipedia.org/wiki/Temporary_satellite",
      "https://en.wikipedia.org/wiki/Quasi-satellite",
    ],

    HeaderPresent: true,

    dataSelected: null,
    dataArray: null,

    columnDefinitions: null,
    dataToClean: null,

    dataToView: null,
    colHeadersView: null,

    history: [],

    historyHidden: true,
  };

  /**
   *
   * @param {*} property
   * @param {*} value
   * @param {*} func optional callback parameter - see https://stackoverflow.com/a/37401726
   */
  UpdateStateValue = (property, value, func) => {
    this.setState({ [property]: value }, func);
  };

  /**
   * Increment the step counter
   */
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  //Handle fields change
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  /**
   * Decrement the step counter
   */
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  /**
   * Add an item or items to the history.
   *
   * The properties action and description are used together
   * OR itemArray which is an collecton history items. The latter
   * is used in ViewData to add many items in one go as calling this function
   * repetitively in a short time only seems to add the last item.
   * Something to do with the asynchronous nature of this.setState,
   * I think.
   *
   * @param {*} action The history action being carried out
   * @param {*} description Associated data
   * @param {*} itemArray Optional item, if defined it is an array of items to
   *                      add in one go
   */
  addHistory = (action, description, itemArray) => {
    const history = this.state.history;

    if (itemArray === undefined) {
      var item = HistoryUtilties.MakeHistoryItem(action, description);
      this.setState({ history: [...history, item] });
    } else this.setState({ history: [...history, ...itemArray] });
  };

  /**
   * Reset the history
   */
  clearHistory = () => {
    this.setState({ history: [] });
  };

  /**
   * Toggle the display of the history panel
   */
  toggleHistoryDisplay = () => {
    const historyHidden = this.state.historyHidden;
    this.setState({ historyHidden: !historyHidden });
  };

  // navbarButtons = () => {
  //   // eslint-disable-next-line default-case
  //   switch (this.state.step) {
  //     case 2: //clean data
  //       return (
  //         <React.Fragment>
  //           <Button variant="primary" onClick={this.prevStep}>
  //             Previous
  //           </Button>
  //           <Button variant="primary" onClick={this.nextStep}>
  //             Next
  //           </Button>
  //         </React.Fragment>
  //       );
  //     case 3: //view data
  //       return (
  //         <React.Fragment>
  //           <Button variant="primary" onClick={this.prevStep}>
  //             Previous
  //           </Button>
  //         </React.Fragment>
  //       );
  //   }
  // };

  getPageTitle = () => {
    // eslint-disable-next-line default-case
    switch (this.state.step) {
      case 1:
        return "Select Data Source";
      case 2:
        return "Clean Data Source";
      case 3:
        return "View Data";
    }
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

    console.log();

    // eslint-disable-next-line default-case
    switch (step) {
      case 1:
        return (
          <SelectData
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
            updateStateValue={this.UpdateStateValue}
            addHistory={this.addHistory}
            toggleHistoryDisplay={this.toggleHistoryDisplay}
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
            addHistory={this.addHistory}
            toggleHistoryDisplay={this.toggleHistoryDisplay}
          />
        );

      case 3:
        return (
          <ViewData
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
            updateStateValue={this.UpdateStateValue}
            addHistory={this.addHistory}
            toggleHistoryDisplay={this.toggleHistoryDisplay}
          />
        );
    }
  };

  //https://codepen.io/ekros/pen/MeeMGj
  //https://ticlo.github.io/rc-dock/examples/#basic

  //figure out what step we're on and display the relevant page

  render() {
    return (
      <Container>
        <Row>
          {!this.state.historyHidden && (
            <Col sm={4}>
              <History
                collapsed={this.state.historyHidden}
                history={this.state.history}
                clearHistory={this.clearHistory}
              />
            </Col>
          )}
          {/* <Navbar bg="primary" expand="sm" variant="dark">
            <Navbar.Brand>{this.getPageTitle()}</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          </Navbar> */}
          <Col sm={this.state.historyHidden ? 12 : 8}>{this.getPage()}</Col>
        </Row>
      </Container>
    );
  }
}

export default Main;
