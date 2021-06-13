import React, { Component } from "react";
import SelectData from "./SelectData";
import ViewData from "./ViewData";
import CleanData from "./CleanData";
import History from "./History";
import Table from "react-bootstrap/Table";
import Navbar from "react-bootstrap/Navbar";
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

    history: [],

    collapsed: true,

    titles: ["Select Data Source", "Clean Data", "View Data"],
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

  addHistory = (action, description) => {
    const history = this.state.history;
    history.push({ action: action, description: description });
    //this.setState({ history: history });
  };

  toggleHistory = () => {
    console.log("Toggle history");
    const collapsed = this.state.collapsed;
    this.setState({ collapsed: !collapsed });
  };

  navBarTitle = () => {
    return this.state.titles[this.state.step - 1];
  };

  navbarButtons = () => {
    // eslint-disable-next-line default-case
    switch (this.state.step) {
      case 2: //clean data
        return (
          <React.Fragment>
            <Button variant="primary" onClick={this.prevStep}>
              Previous
            </Button>
            <Button variant="primary" onClick={this.nextStep}>
              Next
            </Button>
          </React.Fragment>
        );
      case 3: //view data
        return (
          <React.Fragment>
            <Button variant="primary" onClick={this.prevStep}>
              Previous
            </Button>
          </React.Fragment>
        );
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
      History,
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
      History,
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
            addHistory={this.addHistory}
            toggleHistory={this.toggleHistory}
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
            toggleHistory={this.toggleHistory}
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
            toggleHistory={this.toggleHistory}
          />
        );
    }
  };

  //https://codepen.io/ekros/pen/MeeMGj
  //https://ticlo.github.io/rc-dock/examples/#basic

  //figure out what step we're on and display the relevant page
  render() {
    return (
      <Table>
        <tbody>
          <tr>
            <td>
              <History
                collapsed={this.state.collapsed}
                history={this.state.history}
              />
            </td>

            <td>
              {/* <Navbar bg="primary" expand="sm" variant="dark">
                <Navbar.Brand>{this.navBarTitle()}</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
                <Button onClick={this.toggleHistory}>Toggle History</Button>
                {this.navbarButtons()}
              </Navbar> */}
              {this.getPage()}
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default Main;
