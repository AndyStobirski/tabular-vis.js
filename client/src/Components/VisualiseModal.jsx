import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import * as d3 from "d3";
import DrawChart from "../Functions/Charts/DrawChart";

// TODO investigate data visualisations, https://towardsdatascience.com/the-art-of-effective-visualization-of-multi-dimensional-data-6c7202990c57

/**
 * VisualiseModal
 *    this.props:
 *      show - boolean to cause modal to show
 *      close - function to close modal
 *      columnDefs - array of objects defining columns: their names and datatypes
 *      gridData - all the data on the grid
 *      selectedData - selected cells on the grid, an array of arrays consistsing of row, column, row2, column2
 */
class VisualiseModal extends Component {
  state = {
    graphData: null,
    selectedGraph: null,
  };

  componentDidMount() {
    //The presence of this code produces an error
    //    index.js:1 Warning: Cannot update during an existing state transition
    //    (such as within `render`). Render methods should be a pure function of
    //    props and state.
    //this.props.addHistory("Loaded visualiser", this.props.description);
  }

  /**
   * The buttons available are dependant upon the data type of the first
   * cell of the structure selected.
   */
  setButtons = () => {
    //console.log("setButtons");
    if (this.state.selectedGraph === null) {
      //console.log("Default chart");
      this.visualiserSelected("bar");
    }

    if (this.props.data.dataType === "numeric") {
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
    this.setState({ selectedGraph: e });
  };

  DrawChart = () => {
    //console.log("DrawChart");
    const graphData = this.props.data.values;
    const width = this.getContainerWidth();
    DrawChart(graphData, width, this.state.selectedGraph);
  };

  /**
   * Get the width of the container the graph will be drawn into
   * @returns
   */
  getContainerWidth = () => {
    var element = d3.select("#container").node();
    if (!element) return 800;
    return element.getBoundingClientRect().width;
  };

  render() {
    //this method is to block the rendering of the page until the
    //variable this.state.graphData is rendered
    //https://stackoverflow.com/a/35023545
    // if (!this.state.graphData) {
    //   return <div />;
    // }

    const styles = {
      container: {
        display: "grid",
        justifyItems: "center",
      },
    };

    return (
      <Modal
        show={this.props.show}
        centered
        onHide={this.props.close}
        animation={false}
        size="xl" //could be large as well
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Data visualisation of {this.props.description}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ButtonGroup
            onClick={(e) => {
              this.visualiserSelected(e.target.value);
            }}
            size="sm"
          >
            {this.setButtons()}
          </ButtonGroup>

          <div id="container" style={styles.container}></div>
          {this.DrawChart()}
          <p />
          <p />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VisualiseModal;
