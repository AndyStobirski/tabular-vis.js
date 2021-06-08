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

// TODO Clean up load HTML tables dialogue
// TODO Add drag and drop functionality for CSV files
// TODO Add modal loading screen for URL load

class SelectData extends Component {
  state = {
    response: "",
    post: "",
    tablesFound: 0,
    TablesReturned: null,
  };

  componentDidMount() {}

  nextStep = (e) => {
    //    e.preventDefault();
    this.props.nextStep();
  };

  /**
   * Call TableToJSON, a Node.js application
   * @param {*} e
   */
  handleSubmit = async (e) => {
    e.preventDefault();

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
    this.props.updateStateValue("dataArray", JSON.parse(body));
  };

  /**
   * We have selected a HTML table, so advance to the next page
   * @param {*} e
   */
  tableButtonClicked = (e) => {
    this.packageDataForNextStep(e);
    this.nextStep(e);
  };

  convertToNumber = (pNum) => {
    var num = Number(pNum);
    //console.log(num);
    if (typeof num === "number" && isFinite(num)) return num;
    return null;
  };

  packageDataForNextStep = (selectedTable) => {
    this.props.updateStateValue("dataSelected", selectedTable);

    const { dataArray } = this.props.values;

    const data = dataArray[selectedTable];

    //console.log(data[0]);

    //build the column definitions
    var colDef = [];
    for (const key in data[0])
      colDef.push({
        colName: key,
        required: true,
        dataType:
          this.convertToNumber(data[0][key]) === null ? "text" : "numeric",
        allowBlank: true,
      });

    //convert object array into array of arrays
    var conv = data.map(function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    });

    //console.log(conv);
    this.props.updateStateValue("dataToClean", conv);

    this.props.updateStateValue("columnDefinitions", colDef, this.nextStep());
  };

  parseTables = () => {
    if (this.props.values.dataArray === null) {
      return <h1>No tables found in URL</h1>;
    } else {
      return (
        <div>
          <h1>{this.props.values.dataArray.length} tables found</h1>
          <ListGroup onSelect={this.tableButtonClicked}>
            {this.props.values.dataArray.map((option, index) => (
              <ListGroup.Item eventKey={index} key={index}>
                Table {index}({this.props.values.dataArray[index].length} Rows)
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      );
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
            <NavBar Title={"Select Data Source"} />
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
            {/* <Dropdown.Item href="#">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#">Separated link</Dropdown.Item> */}
          </DropdownButton>
        </InputGroup>

        <FormGroup>{this.parseTables()}</FormGroup>
      </React.Fragment>
    );
  }
}

export default SelectData;
