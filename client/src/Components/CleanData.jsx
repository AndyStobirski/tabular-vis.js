import React, { Component } from "react";
import NavBar from "./NavBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// TODO add auto detection of data types
// TODO add utilities to clean data such as distinct, remove rows with blank values or rows with bad data

class CleanData extends Component {
  nextStep = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  /**
   * Data has been selected, so move onto the view step
   * @param {*} e
   */
  buildDataSet = (e) => {
    //console.log(this.props.values);

    const dataToClean = this.props.values.dataToClean;

    //console.log(dataToClean);

    //get the column information: colsToDelete and colsToView
    const columnDefinitions = this.props.values.columnDefinitions;
    let colsToRemove = [];
    let colsToView = [];
    columnDefinitions.forEach((el, ind) => {
      if (!el.required) {
        colsToRemove.push(ind);
      } else {
        colsToView.push(el.colName);
      }
    });

    colsToRemove.sort().reverse();

    //delete the columns that are not checked
    var data = dataToClean.slice(0);
    data.forEach((row, ind) => {
      colsToRemove.forEach((d) => {
        row.splice(d, 1);
      });
    });

    this.props.updateStateValue("colsToView", colsToView);
    this.props.updateStateValue("dataToView", data, this.nextStep(e));
  };

  componentDidMount() {}

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
      <Container>
        <Row>
          <Col sm={1}>Required</Col>
          <Col>Column Name</Col>
          <Col>Data Type</Col>
        </Row>
        {columnDefinitions.map((item, index) => (
          <Row key={index}>
            <InputGroup className="mb-1" key={index}>
              <Col sm={1}>
                <InputGroup.Prepend>
                  <InputGroup.Checkbox
                    checked={item["required"]}
                    onChange={this.update1(index, "required")}
                  />
                </InputGroup.Prepend>
              </Col>
              <Col>
                <FormControl
                  as="input"
                  value={item["colName"]}
                  onChange={this.update(index, "colName")}
                />
              </Col>

              <Col>
                <FormControl
                  as="select"
                  custom
                  value={item["dataType"]}
                  onChange={this.update(index, "dataType")}
                >
                  <option value="string">text</option>
                  <option value="date">date</option>
                  <option value="number">numeric</option>
                  <option value="time">time</option>
                </FormControl>
              </Col>
            </InputGroup>
          </Row>
        ))}
      </Container>
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
              Title={"Clean Data Source"}
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
