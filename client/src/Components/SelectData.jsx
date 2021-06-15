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
import { parse } from "papaparse";

// TODO Clean up load HTML tables dialogue
// DONE Add drag and drop functionality for CSV files
// TODO clean up data loading and standardise between the two functions
// TODO Add modal loading screen for URL load
// DONE decouple table processing logic to new function

class SelectData extends Component {
  state = {
    DataSource: null,
    TablesReturned: null,
    DataLoaded: false,
    UploadType: "",
  };

  nextStep = (e) => {
    this.props.nextStep();
  };

  /**
   * Call TableToJSON, a Node.js application
   * @param {*} e
   */
  loadURL = async (e) => {
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
    this.setLoadedData(this.props.values.InputData, "URL", JSON.parse(body));
  };

  /**
   * Upload the received file
   * @param {*} e PapaParse Event
   */
  uploadCSV = (e) => {
    console.log(e);
    e.preventDefault();

    this.props.addHistory("Loaded CSV file", this.props.values.InputData);

    const file = e.dataTransfer.files;
    console.log(e);

    Array.from(file)
      //s.filter((file) => file.type === "text/csv")
      .forEach(async (file) => {
        const text = await file.text();
        const result = parse(text, { header: true });
        console.log(result);

        if (result.errors.length === 0) {
          this.setLoadedData("FILE", "CSV", [result.data]);
        } else {
          console.log("No");
        }
      });
  };

  /**
   *
   * @param {*} pType
   * @param {*} pData
   */
  setLoadedData = (pSource, pType, pData) => {
    this.setState({ DataSource: pSource });
    this.setState({ UploadType: pType });
    this.setState({ DataLoaded: true });
    this.props.updateStateValue("dataArray", pData);
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
    var successLabel =
      this.state.DataSource === "URL"
        ? this.props.values.dataArray.length +
          " at " +
          this.props.values.InputData
        : "CSV file uploaded";

    if (this.state.DataLoaded || this.props.values.dataArray) {
      if (this.props.values.dataArray === null) {
        return <Alert variant="warning">No tables found</Alert>;
      } else {
        return (
          <div>
            <Alert variant="info">{successLabel}</Alert>
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
    //console.log(this.props.values.TestLinks[e]);
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
        <Form onSubmit={this.loadURL}>
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
            placeholder="CSV file to load"
            onDrop={(e) => this.uploadCSV(e)}
            onDragEnter={(e) => {}}
            onDragLeave={(e) => {}}
            onDragOver={(e) => {}}
          />
        </InputGroup>

        <FormGroup>{this.parseTables()}</FormGroup>
      </React.Fragment>
    );
  }
}

export default SelectData;
