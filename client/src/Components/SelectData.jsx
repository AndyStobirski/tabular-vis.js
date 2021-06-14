import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import NavBar from "./NavBar";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ConversionUtilities from "../Functions/ConversionUtilities";
import Alert from "react-bootstrap/Alert";

// TODO Clean up load HTML tables dialogue
// TODO Add drag and drop functionality for CSV files
// TODO Add modal loading screen for URL load
// DONE decouple table processing logic to new function

class SelectData extends Component {
  state = {
    response: "",
    post: "",
    tablesFound: 0,
    TablesReturned: null,
    DataLoaded: false,
  };

  nextStep = (e) => {
    this.props.nextStep();
  };

  /**
   * Call TableToJSON, a Node.js application
   * @param {*} e
   */
  handleSubmit = async (e) => {
    e.preventDefault();

    this.props.addHistory("Loaded page", this.props.values.InputData);

    const response = await fetch("/api/LoadTable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: this.props.values.InputData }),
    });
    const body = await response.text();

    //a response of JSON.parse(body).length == 0
    //indicates the page contains no tables

    this.setState({ DataLoaded: true });

    this.props.updateStateValue("dataArray", JSON.parse(body));
  };

  /**
   * We have selected a HTML table, so process it and advance to the next page
   * @param {*} e
   */
  tableButtonClicked = (e) => {
    this.props.addHistory("Selected table", Number(e) + 1);

    const { dataArray } = this.props.values;
    const data = dataArray[e];

    var convertedData = ConversionUtilities.processTableTable(data);

    this.props.updateStateValue("dataSelected", e);
    this.props.updateStateValue("dataToClean", convertedData.data);
    this.props.updateStateValue(
      "columnDefinitions",
      convertedData.columnDefinitions,
      this.nextStep()
    );
  };

  /**
   * Build the table array returned from the page load into a list
   * @returns
   */
  parseTables = () => {
    if (this.state.DataLoaded || this.props.values.dataArray) {
      if (this.props.values.dataArray === null) {
        return <Alert variant="warning">No tables found</Alert>;
      } else {
        return (
          <div>
            <Alert variant="info">
              {this.props.values.dataArray.length} tables found at{" "}
              {this.props.values.InputData}
            </Alert>
            <ListGroup onSelect={this.tableButtonClicked}>
              {this.props.values.dataArray.map((option, index) => (
                <ListGroup.Item eventKey={index} key={index}>
                  Table {index + 1}({this.props.values.dataArray[index].length}{" "}
                  Rows)
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        );
      }
    }
  };

  predefinedDataSources = (e) => {
    console.log(this.props.values.TestLinks[e]);
    this.props.updateStateValue("InputData", this.props.values.TestLinks[e]);
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <React.Fragment>
        <Form>
          <FormGroup>
            <NavBar
              Title={"Select Data Source"}
              toggleHistory={this.props.toggleHistory}
            />
          </FormGroup>
        </Form>
        <Form onSubmit={this.handleSubmit}>
          <InputGroup className="mb-4">
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title="Handy Links"
              id="input-group-dropdown-1"
              onSelect={this.predefinedDataSources}
            >
              {this.props.values.TestLinks.map((item, idx) => {
                return (
                  <Dropdown.Item eventKey={idx} key={idx}>
                    {item}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <FormControl
              placeholder="URL to load"
              aria-describedby="basic-addon2"
              value={values.InputData}
              onChange={handleChange("InputData")}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" type="submit">
                Load URL
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Local file to load"
            aria-describedby="basic-addon2"
          />
          <DropdownButton
            as={InputGroup.Append}
            variant="outline-secondary"
            title="Load File"
            id="input-group-dropdown-2"
            onSelect={this.loadFile}
          >
            <Dropdown.Item eventKey="1">Webpage</Dropdown.Item>
            <Dropdown.Item eventKey="2">CSV</Dropdown.Item>
          </DropdownButton>
        </InputGroup>

        <FormGroup>{this.parseTables()}</FormGroup>
      </React.Fragment>
    );
  }
}

export default SelectData;
