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
 *      description - the name of the row/column being visualised
 *      data - the data to be visualised
 *      columnDefs - the definitions of all the columns in the grid
 */
class VisualiseModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.VisualiserContainerRef = React.createRef();
  }
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
    //console.log("VisualiseModal", this.props);
  }

  /**
   * The buttons available are dependant upon the data type of the first
   * cell of the structure selected.
   */
  setButtons = () => {
    if (this.state.selectedGraph === null) {
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
    const graphData = this.props.data;
    const width = this.getContainerWidth();
    const columnDefs = this.props.columnDefs;
    const selectedCell = this.props.selectedCell;
    DrawChart(
      graphData.values,
      width,
      this.state.selectedGraph,
      columnDefs,
      graphData.dataType,
      selectedCell
    );
  };

  /**
   * Get the width of the container the graph will be drawn into
   * @returns
   */
  getContainerWidth = () => {
    var element = d3.select("#container").node();
    if (!element) return 100;
    return element.getBoundingClientRect().width;
  };

  render() {
    //this method is to block the rendering of the page until the
    //variable this.state.graphData is rendered
    //https://stackoverflow.com/a/35023545
    // if (!this.state.graphData) {
    //   return <div />;
    // }

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

          <div id="container" ref={this.VisualiserContainerRef}></div>
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
