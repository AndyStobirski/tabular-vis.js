import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import BarChar from "./BarChart";

/**
 * VisualiseModal
 *    this.props:
 *      show - boolean to cause modal to show
 *      close - function to close modal
 *      columnDefs - array of objects defining columns: their names and datatypes
 *      gridData - all the data on the grid
 *      selectedCells - selected cells on the grid, an array of arrays consistsing of row, column, row2, column2
 *
 *
 *
 */
class VisualiseModal extends Component {
  constructor(props) {
    //console.log("VisualiseModal", "constructor");
    super(props);

    //console.log(this.props);

    this.state = {
      graphData: null,
    };
  }

  componentDidMount() {
    this.graphData();
  }

  convertToNumber = (pNum) => {
    var num = Number(pNum);
    //console.log(num);
    if (typeof num === "number" && isFinite(num)) return num;
    return null;
  };

  /**
   * Build graph data used by D3 to display
   */
  graphData = () => {
    const values = [];

    const iAm = this.whatIsI();
    const columnDefs = this.props.columnDefs;
    const gridData = this.props.gridData;

    if (iAm.structure === "row") {
      for (var ctr = 0; ctr < columnDefs.length; ctr++) {
        values.push({
          name: columnDefs[ctr],
          value: gridData[iAm.value][ctr],
        });
      }
    } else {
      gridData.map((row) => {
        values.push({
          name: row[0],
          value: row[iAm.value],
        });
        return null;
      });
    }

    //console.log(values);

    if (iAm.dataType === "number") {
      for (var n = 0; n < values.length; n++) {
        values[n].value = this.convertToNumber(values[n].value);
      }
    }

    var graphData = {
      dataType: iAm.dataType,
      values: values,
    };

    this.setState({ graphData: graphData });
  };

  /**
   * The buttons available are dependant upon the data type of the first
   * cell of the structure selected.
   */
  setButtons = () => {
    if (this.state.graphData.dataType === "number") {
      return (
        <div>
          <Button variant="secondary" value="bar">
            Bar chart
          </Button>
          <Button variant="secondary" value="pie">
            Pie Chart
          </Button>
          <Button variant="secondary" value="line">
            Line Chart
          </Button>
          <Button variant="secondary" value="box">
            Box Chart
          </Button>
          <Button variant="secondary" value="point">
            Point Plot
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button variant="secondary" value="bar">
            Bar chart
          </Button>
          <Button variant="secondary" value="pie">
            Pie Chart
          </Button>
          <Button variant="secondary" value="word">
            Word Cloud
          </Button>
        </div>
      );
    }
  };

  visualiserSelected = (e) => {
    // eslint-disable-next-line default-case
    switch (e.target.value) {
      case "bar":
        break;

      case "line":
        break;

      case "box":
        break;
    }
  };

  /**
   * Work out whether a row or column is selected by examining
   * the selected cell data.
   *
   * @returns object defining the selected data and it's datatype which
   *          determines the visualisations
   */
  whatIsI = () => {
    const sel = this.props.selectedCells[0];

    const ret = {
      structure: sel[0] === sel[2] ? "row" : "col",
      value: sel[0] === sel[2] ? sel[2] : sel[3],
    };

    var dataType = "string";
    if (ret.structure === "col") {
      //console.log("col", this.props.columnDefs[ret.value]);
      if (this.props.columnDefs[ret.value].dataType === "number")
        dataType = "number";
    } else {
      //console.log("row", this.props.columnDefs[0]);
      if (this.props.columnDefs[0].dataType === "number") dataType = "number";
    }
    ret.dataType = dataType;

    return ret;
  };

  render() {
    //this method is to block the rendering of the page until the
    //variable this.state.graphData is rendered
    //https://stackoverflow.com/a/35023545
    if (!this.state.graphData) {
      return <div />;
    }

    //console.log(this.state.graphData);

    return (
      <Modal
        show={this.props.show}
        centered
        onHide={this.props.close}
        animation={false}
        size="xl" //could be large as well
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualise data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ButtonGroup onClick={this.visualiserSelected} size="sm">
            {this.setButtons()}
          </ButtonGroup>
          <BarChar data={this.state.graphData} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VisualiseModal;
