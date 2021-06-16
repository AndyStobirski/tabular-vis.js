// TODO Clean up load HTML tables dialogue
// DONE Add drag and drop functionality for CSV files
// TODO clean up data loading and standardise between the two functions
// TODO Add modal loading screen for data load
// DONE decouple table processing logic to new function

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

/**
 * SelectData - first page of the application.
 *
 * The user loads either a URL containing HTML Tables or
 * a CSV file that is dragged and dropped onto to the form.
 *
 * If the provided data contains tabular data the user is
 * presented with a list of those tables and the option
 * to select one and move onto the next step.
 *
 */
class SelectData extends Component {
  state = {
    DataSource: null,
    TablesReturned: null,
    DataLoaded: false,
    UploadType: "",
    LoadErrors: null,
    draggedOver: false,
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

    try {
      this.props.addHistory("Loaded page", this.props.values.InputData);
      this.setLoadedInfoData(this.props.values.InputData, "CSV");

      const response = await fetch("/api/LoadTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post: this.props.values.InputData }),
      });

      const body = await response.text();

      console.log(JSON.parse(body).Data);

      this.setLoadedData(JSON.parse(body).Data);
    } catch (exception) {
      console.log("exception", exception);
    }
  };

  /**
   * Upload the received file
   * @param {*} e PapaParse Event
   */
  uploadCSV = (e) => {
    e.preventDefault();
    const addHistory = this.props.addHistory;
    const setLoadedData = this.setLoadedData;
    const setErrorData = this.setErrorData;
    const setLoadedInfoData = this.setLoadedInfoData;

    setErrorData(null);

    Array.from(e.dataTransfer.files).forEach(async (file) => {
      //console.log(file.name);
      const text = await file.text();

      parse(text, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          addHistory("Loaded CSV file", file.name);
          setLoadedInfoData(file.name, "CSV");
          if (results.errors.length === 0) {
            setLoadedData([results.data]);
          } else {
            const errors = results.errors
              .map((err) => {
                return (
                  "Code: " +
                  err.code +
                  ", Message: " +
                  err.message +
                  ", Row: " +
                  err.row
                );
              })
              .join("\r\n");

            addHistory("Error loading CSV", errors);
            setErrorData(errors);
          }
        },
      });
    });
  };

  /**
   *
   * @param {*} pError
   */
  setErrorData = (pError) => {
    this.setState({ LoadErrors: pError });
  };

  /**
   *
   * @param {*} pData
   */
  setLoadedData = (pData) => {
    this.setState({ DataLoaded: true });
    this.setState({ LoadErrors: null });
    this.props.updateStateValue("dataArray", pData);
  };

  /**
   *
   * @param {*} pSource
   * @param {*} pType
   */
  setLoadedInfoData = (pSource, pType) => {
    this.setState({ DataSource: pSource });
    this.setState({ UploadType: pType });
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
    if (this.state.LoadErrors) {
      console.log(this.state.LoadErrors);
      return (
        <Alert variant="danger">
          <Alert.Heading>
            Errors encountered loading {this.state.DataSource}{" "}
            {this.state.UploadType}
          </Alert.Heading>
          <p>{this.state.LoadErrors}</p>
        </Alert>
      );
    } else if (this.props.values.dataArray) {
      return (
        <div>
          <Alert variant="info">
            Loaded from {this.state.UploadType}
            {": "} {this.state.DataSource}{" "}
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
    } else if (this.state.DataLoaded) {
      return <Alert variant="warning">No tables found</Alert>;
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

        {/* */}
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
        {/* */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="CSV file to load"
            onDrop={(e) => {
              this.setState({ draggedOver: false });
              this.uploadCSV(e);
            }}
            onDragEnter={(e) => {
              this.setState({ draggedOver: true });
            }}
            onDragLeave={(e) => this.setState({ draggedOver: false })}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            className={`p-6 my-2 mx-auto max-w-md border-2 ${
              this.state.draggedOver
                ? "border-green-600 bg-green-100"
                : "border-gray-600"
            }`}
          />
        </InputGroup>
        {/* */}

        <FormGroup>{this.parseTables()}</FormGroup>
      </React.Fragment>
    );
  }
}

export default SelectData;
