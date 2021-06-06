import React, { Component } from "react";
import NavBar from "./NavBar";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import VisualiseModal from "./VisualiseModal";
import ExportModal from "./ExportModal";

// DONE Add context menu support - https://handsontable.com/docs/8.4.0/frameworks-wrapper-for-react-custom-context-menu-example.html
// DONE Add Selected data support
// DONE add row dragging
// DONE add column dragging
// DONE add column filtering
// DONE add column ordering
// DONE Add options dialogue for export grid data
// TODO Add support for data appropriate filtering of columns
// TODO Investigate dynamic sizing of grid
// TODO Customise filter context menu to remove options for inserting / removing columns

class ViewData extends Component {
  constructor(props, context) {
    super(props, context);

    this.id = "hot";
    this.hotTableComponent = React.createRef();

    //modal
    this.downloadShow = this.downloadShow.bind(this);
    this.downloadClose = this.downloadClose.bind(this);
    this.visualiserShow = this.visualiserShow.bind(this);
    this.visualiserClose = this.visualiserClose.bind(this);
  }

  state = {
    showDownload: false,
    showVisualiser: false,

    exportHiddenRows: false, // default false
    exportHiddenColumns: false, // default false
    columnHeaders: true, // default false
    rowHeaders: false, // default false

    filename: "ExportedData_[YYYY]-[MM]-[DD]",
    rowDelimiter: "\r\n",
    columnDelimiter: ",",

    dataSelected: null,
  };

  UpdateStateValue = (property, value, func) => {
    this.setState({ [property]: value }, func);
  };

  //#region Page navigation

  /**
   * This will take us back to step2: clean data.
   * @param {*} e
   */
  refineStep = (e) => {
    e.preventDefault();

    //we want to remove the columns that have not been selected
    const columnDefinitions = this.props.values.columnDefinitions;
    this.props.updateStateValue(
      "columnDefinitions",
      columnDefinitions.filter((col) => col.required === true)
    );

    //get all the displayed data on the grid
    this.props.updateStateValue(
      "dataToClean",
      this.visibleGridData(),
      this.prevStep(e)
    );
  };

  prevStep = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };
  //#endregion

  //#region Grid configuration
  hotSettings = () => {
    return {
      licenseKey: "non-commercial-and-evaluation",
      data: this.data(),
      colHeaders: this.colHeaders(),
      colWidths: this.colWidths(),
      rowHeaders: true,
      overflow: "auto",
      readOnly: false,
      manualColumnMove: true,
      manualRowMove: true,
      manualColumnResize: true,
      manualRowResize: true,
      filters: true,
      dropdownMenu: true,
      columnSorting: true,
      contextMenu: this.contextMenus(),
      //width: "400px",
    };
  };

  colHeaders = () => {
    const colDefs = this.props.values.columnDefinitions;
    return colDefs
      .filter((col) => col.required === true)
      .map((col) => {
        return col.colName;
      });
  };

  //https: //handsontable.com/docs/8.4.0/demo-custom-renderers.html
  columns = () => {
    const colDefs = this.props.values.columnDefinitions;
    return colDefs
      .filter((col) => col.required === true)
      .map((col) => {
        return { data: col.colName, renderer: col.dataType };
      });
  };

  colWidths = () => {
    const colDefs = this.props.values.columnDefinitions;
    return colDefs
      .filter((col) => col.required === true)
      .map((col) => {
        return 150;
      });
  };

  /**
   * Right clicking on a cell will launch two visualisation options: row and col
   */
  contextMenus = () => {
    const visualiserShow = this.visualiserShow;

    return {
      items: {
        Rows: {
          // Own custom option
          name: "Row...",
          callback: function (key, selection, clickEvent) {
            const start = selection[0].start;
            this.selectRows(start.row, start.row);
            visualiserShow();
          },
        },
        Columns: {
          // Own custom option
          name: "Column...",
          callback: function (key, selection, clickEvent) {
            const start = selection[0].start;
            this.selectColumns(start.col, start.col);
            visualiserShow();
          },
        },
      },
    };
  };

  data = () => {
    return this.props.values.dataToView;
  };

  visibleGridData = () => {
    //the ? is the Optional Chaining Operator
    //If a property exists, it proceeds to the next check, or returns the value.
    //Any failure will immediately short-circuit and return undefined.

    //On initial page load, current will be null
    return this.hotTableComponent.current?.hotInstance.getData();
  };

  /**
   * Returns indexes of the currently selected cells as an array of
   * arrays [[startRow, startCol, endRow, endCol],...]
   * @returns array of arrays
   */
  getSelectedCells = () => {
    //console.log("getSelectedCells");
    return this.hotTableComponent.current?.hotInstance.getSelected();
  };

  //#endregion

  /**
   * Attached required events to HotTable grid
   */
  componentDidMount() {
    const ht = this.hotTableComponent;
    ht.current.hotInstance.addHook("afterColumnMove", this.afterColumnMove);
    ht.current.hotInstance.addHook("afterFilter", this.afterFilter);
    ht.current.hotInstance.addHook("afterRowMove", this.afterFilter);
  }

  afterFilter = () => {
    //console.log("afterRowMove");
  };

  afterFilter = () => {
    //console.log("afterFiler");
  };

  /**
   * After columns or column have been moved in the grid we wish to reorde
   * https://handsontable.com/docs/9.0.0/Hooks.html#event:afterColumnMove
   * @param {*} movedColumns Array of visual column indexes to be moved.
   * @param {*} finalIndex a start index for the moved columns
   * @param {*} dropIndex  drop index for the moved columns, based on the indexes BEFORE the move
   * @param {*} movePossible possible to move columns to the desired position?
   * @param {*} orderChanged order of columns was changed by move?
   */
  afterColumnMove = (
    movedColumns,
    finalIndex,
    dropIndex,
    movePossible,
    orderChanged
  ) => {
    if (orderChanged) {
      var columnDefinitions = this.props.values.columnDefinitions;
      console.log("columnDefinitions", columnDefinitions);

      var removed = columnDefinitions.splice(
        movedColumns[0],
        movedColumns.length
      );

      columnDefinitions.splice(dropIndex - movedColumns.length, 0, ...removed);

      this.props.updateStateValue("columnDefinitions", columnDefinitions);
    }
  };

  //#region open close modals

  downloadClose() {
    this.setState({ showDownload: false });
  }

  downloadShow() {
    this.setState({ showDownload: true });
  }

  visualiserShow() {
    this.setState({ showVisualiser: true });
  }

  visualiserClose() {
    this.setState({ showVisualiser: false });
  }
  //#endregion

  render() {
    return (
      <React.Fragment>
        {this.state.showVisualiser && (
          <VisualiseModal
            show={this.state.showVisualiser}
            close={this.visualiserClose}
            columnDefs={this.props.values.columnDefinitions}
            gridData={this.visibleGridData()}
            selectedCells={this.getSelectedCells()}
          />
        )}
        <ExportModal
          show={this.state.showDownload}
          close={this.downloadClose}
          tableInstance={this.hotTableComponent.current?.hotInstance}
        />
        <Form>
          <FormGroup>
            <NavBar
              PrevStep={this.prevStep}
              RefineStep={this.refineStep}
              Title={"View Data Source"}
            />
          </FormGroup>
        </Form>

        <Form>
          <FormGroup>
            <ButtonGroup aria-label="Basic example">
              <Button variant="secondary" onClick={this.downloadShow}>
                Export to file
              </Button>
              <Button variant="secondary">Middle</Button>
              <Button variant="secondary">Right</Button>
            </ButtonGroup>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup>
            <HotTable
              ref={this.hotTableComponent}
              id={this.id}
              settings={this.hotSettings()}
              style={{
                width: "1110px",

                height: "800px",

                overflow: "hidden",
              }}
            />
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default ViewData;
