import React, { Component } from "react";
import NavBar from "./NavBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import ConversionUtilities from "../Functions/ConversionUtilities";
import Table from "react-bootstrap/Table";
import HistoryUtilties from "../Functions/HistoryUtilties";

// DONE add auto detection of data types
// TODO add utilities to clean data such as distinct, remove rows with blank values or rows with bad data
// DONE decouple table processing logic to new function

class CleanData extends Component {
  nextStep = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  //if a row has been changed, store it here and use to update the history
  //when exiting the page
  state = {
    changedRows: [],
    historyItems: [],
  };

  /**
   * Data has been edited, so package it, update the history and move
   * onto the view step.
   *
   * @param {*} e event
   */
  buildDataSet = (e) => {
    const dataToClean = this.props.values.dataToClean;
    const columnDefinitions = this.props.values.columnDefinitions;

    var conversionResults = ConversionUtilities.buildDataToView(
      dataToClean,
      columnDefinitions
    );

    //
    // Check for changes and add any to the history list
    //
    var historyItems = [];

    this.state.changedRows.forEach((change, index) => {
      var currentCol = columnDefinitions[index];

      if (change.name) {
        historyItems.push(
          HistoryUtilties.MakeHistoryItem(
            "Column name",
            "changed column " + (index + 1) + " to " + currentCol.colName
          )
        );
      }

      if (change.visible) {
        historyItems.push(
          HistoryUtilties.MakeHistoryItem(
            "Column visibility",
            "changed column " + (index + 1) + " to " + currentCol.required
          )
        );
      }

      if (change.dataType) {
        historyItems.push(
          HistoryUtilties.MakeHistoryItem(
            "Column datatype",
            "changed column " + (index + 1) + " to " + currentCol.dataType
          )
        );
      }
    });

    //  The conversionResults object, generated above, contains a conversionHistory
    //  combine that result with the historyItems array and add it into the history
    //  list
    var histories = [...historyItems, ...conversionResults.conversionHistory];
    this.props.addHistory(null, null, histories);

    //  Update the properies in Main.jsx
    this.props.updateStateValue(
      "colHeadersView",
      conversionResults.colHeadersView
    );

    this.props.updateStateValue(
      "dataToView",
      conversionResults.dataToView,
      this.nextStep(e)
    );
  };

  /**
   * Set the changedRows array to null
   */
  componentDidMount() {
    const columnDefinitions = this.props.values.columnDefinitions;

    var data = columnDefinitions.map((cd) => {
      return { name: false, visible: false, dataType: false };
    });

    this.setState({
      changedRows: data,
    });
  }

  prevStep = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  /**
   * Update column name / data type properties
   * @param {*} index
   * @param {*} propName
   * @returns
   */
  update = (index, propName) => (e) => {
    const changedRows = this.state.changedRows;

    if (propName === "colName") changedRows[index].name = true;
    else if (propName === "dataType") changedRows[index].dataType = true;

    this.setState({
      changedRows: changedRows,
    });

    //https://stackoverflow.com/a/49502115
    const columnDefinitions = this.props.values.columnDefinitions;
    const item = { ...columnDefinitions[index] };
    item[propName] = e.target.value;
    columnDefinitions[index] = item;
    this.props.updateStateValue("columnDefinitions", columnDefinitions);
  };

  /**
   * Update input checkbox values
   * @param {*} index
   * @param {*} propName
   * @returns
   */
  update1 = (index, propName) => (e) => {
    const changedRows = this.state.changedRows;
    changedRows[index].visible = true;
    this.setState({
      changedRows: changedRows,
    });

    const columnDefinitions = this.props.values.columnDefinitions;
    const item = { ...columnDefinitions[index] };
    item[propName] = e.target.checked;
    columnDefinitions[index] = item;
    this.props.updateStateValue("columnDefinitions", columnDefinitions);
  };

  /**
   * Output the column definitions generated in the previous page into
   * a table used to configure the data source.
   * @returns Built table
   */
  outputColumns = () => {
    const columnDefinitions = this.props.values.columnDefinitions;

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Column Name</th>
            <th sm={1}>Display</th>
            <th>Data Type</th>
          </tr>
        </thead>
        <tbody>
          {columnDefinitions.map((item, index) => (
            <tr key={index}>
              <td>
                <FormControl
                  as="input"
                  value={item["colName"]}
                  onChange={this.update(index, "colName")}
                />
              </td>
              <td>
                <InputGroup.Prepend>
                  <InputGroup.Checkbox
                    checked={item["required"]}
                    onChange={this.update1(index, "required")}
                  />
                </InputGroup.Prepend>
              </td>
              <td>
                <FormControl
                  as="select"
                  custom
                  value={item["dataType"]}
                  onChange={this.update(index, "dataType")}
                >
                  <option value="text">text</option>
                  <option value="numeric">numeric</option>
                </FormControl>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  render() {
    //const { values, handleChange } = this.props;
    return (
      <React.Fragment>
        <Form>
          <FormGroup>
            <NavBar
              NextStep={this.buildDataSet}
              PrevStep={this.prevStep}
              Title={"Step 2: Clean Data Source"}
              toggleHistoryDisplay={this.props.toggleHistoryDisplay}
            />
          </FormGroup>
        </Form>
        <Form>
          <FormGroup>{this.outputColumns()}</FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default CleanData;
