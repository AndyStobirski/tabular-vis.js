import React, { Component } from "react";
import NavBar from "./NavBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// DONE add auto detection of data types
// TODO add utilities to clean data such as distinct, remove rows with blank values or rows with bad data

class CleanData extends Component {
  nextStep = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  convertToNumber = (pNum) => {
    var num = Number(pNum);
    //console.log(num);
    if (typeof num === "number" && isFinite(num)) return num;
    return null;
  };

  /**
   * Data has been selected, so move onto the view step
   * @param {*} e
   */
  buildDataSet = (e) => {
    //console.log(this.props.values);

    const dataToClean = this.props.values.dataToClean;

    //get the column information: colsToDelete and colsToView
    const columnDefinitions = this.props.values.columnDefinitions;
    let colsToRemove = [];
    let colHeadersView = [];
    columnDefinitions.forEach((el, ind) => {
      if (!el.required) {
        colsToRemove.push(ind);
      } else {
        colHeadersView.push(el.colName);
      }
    });
    colsToRemove.sort().reverse();

    //console.log("dataToClean", dataToClean);
    //perform the data conversions

    //make a value copy of the array or arrays
    //https://stackoverflow.com/a/13756775/500181
    var data = dataToClean.map(function (row) {
      return row.slice();
    });

    //console.log(columnDefinitions);
    data.forEach((row, rIdx) => {
      row.forEach((col, cIdx) => {
        if (
          columnDefinitions[cIdx].required &&
          columnDefinitions[cIdx].dataType === "numeric"
        ) {
          row[cIdx] = this.convertToNumber(col);
        }
      });
      //console.log(row);
    });

    //delete the columns that are not checked
    data.forEach((row, ind) => {
      colsToRemove.forEach((d) => {
        row.splice(d, 1);
      });
    });

    //console.log("colHeadersView", colHeadersView);
    this.props.updateStateValue("colHeadersView", colHeadersView);

    //console.log("dataToView", data);
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
          <Col>Column Name</Col>
          <Col sm={1}>Display</Col>
          {/* <Col sm={1}>Allow Blank</Col> */}
          <Col>Data Type</Col>
        </Row>
        {columnDefinitions.map((item, index) => (
          <Row key={index}>
            <InputGroup className="mb-1" key={index}>
              <Col>
                <FormControl
                  as="input"
                  value={item["colName"]}
                  onChange={this.update(index, "colName")}
                />
              </Col>
              <Col sm={1}>
                <InputGroup.Prepend>
                  <InputGroup.Checkbox
                    checked={item["required"]}
                    onChange={this.update1(index, "required")}
                  />
                </InputGroup.Prepend>
              </Col>
              {/* <Col sm={1}>
                <InputGroup.Prepend>
                  <InputGroup.Checkbox
                    checked={item["allowBlank"]}
                    onChange={this.update1(index, "allowBlank")}
                  />
                </InputGroup.Prepend>
              </Col> */}

              <Col>
                <FormControl
                  as="select"
                  custom
                  value={item["dataType"]}
                  onChange={this.update(index, "dataType")}
                >
                  <option value="text">text</option>
                  <option value="numeric">numeric</option>
                  <option value="date">date</option>
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
