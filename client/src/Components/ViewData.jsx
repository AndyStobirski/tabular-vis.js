// DONE Add context menu support - https://handsontable.com/docs/8.4.0/frameworks-wrapper-for-react-custom-context-menu-example.html
// DONE Add Selected data support
// DONE add row dragging
// DONE add column dragging
// DONE add column filtering
// DONE add column ordering
// DONE Add options dialogue for export grid data
// DONE Add support for data appropriate filtering of columns
// TODO Investigate dynamic sizing of grid
// FIXME Clear filters button appears not to work
// DONE Add clear sort function
// DONE Customise filter context menu to remove options for inserting / removing columns
// TODO Add warning of data loss on back navigate
// FIXME Loading a visualisation for will reset the dataset, removing order
// TODO implement display of  this.state.selectedCellValue
// TODO implement display of  this.state.rowsDisplayed

import React, { Component } from "react";
import NavBar from "./NavBar";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import VisualiseModal from "./VisualiseModal";
import ExportModal from "./ExportModal";
import Handsontable from "handsontable";
import VisualisationData from "../Functions/VisualisationData";

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

    //this.afterFilter = this.afterFilter.bind(this);
  }

  state = {
    showDownload: false,
    showVisualiser: false,
    gridIsFiltered: false,

    dataSelected: null,
    selectedCellValue: null,
    rowsDisplayed: 0,
    selectedCell: null,
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
    //Build the column definitions based on live instance data
    const hi = this.hotTableComponent.current.hotInstance;
    var colDefs = hi.getColHeader().map((item, idx) => {
      return {
        colName: item,
        required: true,
        dataType: hi.getDataType(1, idx, 1, idx),
      };
    });

    this.props.updateStateValue("columnDefinitions", colDefs);

    const rowsBefore = this.props.values.dataToView.length;
    const rowsAfter = this.visibleGridData().length;

    this.props.addHistory(
      "Dataset refined",
      rowsAfter < rowsBefore ? rowsBefore - rowsAfter + " rows removed" : ""
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
    //console.log("HotSettings");
    return {
      licenseKey: "non-commercial-and-evaluation",
      data: this.props.values.dataToView,
      //data: Handsontable.helper.createSpreadsheetData(1000, 1000),
      colHeaders: this.colHeaders(),
      // colWidths: this.colWidths(),
      columns: this.columns(),
      rowHeaders: true,
      readOnly: true,
      manualColumnMove: true,
      manualRowMove: true,
      manualColumnResize: true,
      manualRowResize: true,
      filters: true,
      //Only display the specified items in the column drop down
      dropdownMenu: [
        "filter_by_condition",
        "filter_by_value",
        "filter_action_bar", //OK, Cancel button
      ],
      columnSorting: true,
      contextMenu: this.contextMenus(),
      //autoWrapRow: true,
      rowHeights: 24,
      autoRowSize: true,
    };
  };

  colHeaders = () => {
    return this.props.values.colHeadersView;
  };

  // https://handsontable.com/docs/9.0.0/demo-filtering.html
  columns = () => {
    const colDefs = this.props.values.columnDefinitions;
    return colDefs
      .filter((col) => col.required === true)
      .map((col) => {
        return { type: col.dataType };
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
   * Right clicking on a cell will launch a context menu that
   * contains two visualisation options: row and col, which causes
   * the Visualiser Modal to launch.
   */
  contextMenus = () => {
    const visualiserShow = this.visualiserShow;
    const addHistory = this.props.addHistory;

    return {
      items: {
        Rows: {
          // Own custom option
          name: "Row...",
          callback: function (key, selection, clickEvent) {
            const selectRows = this.selectRows;
            //Note the use of the time out
            setTimeout(function () {
              const start = selection[0].start;
              selectRows(start.row, start.row);
              //addHistory("Visualisation", "selected row " + (start.row + 1));

              visualiserShow();
            }, 300);
          },
        },
        Columns: {
          // Own custom option
          name: "Column...",
          callback: function (key, selection, clickEvent) {
            const selectColumns = this.selectColumns;
            //Note the use of the time out, which is used to fix an issue
            //described in this webpage for HandsOnTable
            //https://forum.handsontable.com/t/gh-5727-contextmenu-callback-the-runhooks-method-cannot-be-called/4134/9
            setTimeout(function () {
              const start = selection[0].start;
              selectColumns(start.col, start.col);
              //addHistory("Visualisation", "selected column " + (start.col + 1));

              visualiserShow();
            }, 300);
          },
        },
      },
    };
  };

  data = () => {
    return this.props.values.dataToView;
  };

  /**
   * Get a copy of the GridView's data
   * @returns Array of arrays representing the object data
   */
  visibleGridData = () => {
    //the ? is the Optional Chaining Operator
    //If a property exists, it proceeds to the next check, or returns the value.
    //Any failure will immediately short-circuit and return undefined.

    //On initial page load, current will be null
    const data = this.hotTableComponent.current.hotInstance.getData();
    var copy = data.map(function (arr) {
      return arr.slice();
    });

    return copy;
  };

  /**
   * Returns indexes of the currently selected cells as an array of
   * arrays [[startRow, startCol, endRow, endCol],...]
   * @returns oject describing the selected item
   */
  getSelectedCells = () => {
    var selectionData =
      this.hotTableComponent.current?.hotInstance.getSelected();
    const sel = selectionData[0];

    const ret = {
      structure: sel[0] === sel[2] ? "Row" : "Column",
      value: sel[0] === sel[2] ? sel[2] : sel[3],
      description: function () {
        return this.structure + " " + (this.value + 1);
      },
    };

    var dataType = "text";
    var columnDefinitions = this.props.values.columnDefinitions;
    if (ret.structure === "Column") {
      if (columnDefinitions[ret.value].dataType === "numeric")
        dataType = columnDefinitions[ret.value].dataType;
    } else {
      if (columnDefinitions[0].dataType === "numeric")
        dataType = columnDefinitions[0].dataType;
    }
    ret.dataType = dataType;

    return ret;
  };

  //#endregion

  /**
   * Attached required events to HotTable grid
   */
  componentDidMount() {
    this.props.addHistory(
      "Viewing data",
      this.props.values.dataToView.length + " rows present"
    );

    this.setState({ rowsDisplayed: this.props.values.dataToView.length });

    const hti = this.hotTableComponent.current.hotInstance;
    /*
      in the current version of 9.0.0. event notifications for common grid 
      events required by the history component of graphvis-tabular.js don’t work; 
      this issue is tracked in the Handsontable GitHub page:
      https://github.com/handsontable/handsontable/issues/7567

      So, we are using an older version 7.4.2 
    */
    hti.addHook("afterColumnMove", this.afterColumnMove);
    //hti.addHook("beforeFilter", this.beforeFilter);
    hti.addHook("afterFilter", this.afterFilter);
    hti.addHook("afterRowMove", this.afterRowMove);
    hti.addHook("afterColumnSort", this.afterColumnSort);
    hti.addHook("afterOnCellMouseUp", this.afterOnCellMouseUp);
  }

  afterOnCellMouseUp = (event, coords, TD) => {
    ////console.log(event, coords);
    ////console.log(TD);
    this.setState({ selectedCell: coords });
  };

  /**
   * https://handsontable.com/docs/9.0.0/Hooks.html#event:afterRowMove
   *
   * @param {*} movedRows Array of visual row indexes to be moved.
   * @param {*} finalIndex a start index for the moved columns
   */
  afterRowMove = (movedRows, finalIndex) => {
    ////console.log("afterRowMove", [movedRows, finalIndex]);

    this.props.addHistory(
      "Moved rows",
      "rows " +
        //added the one as it's a zero based index
        movedRows.map((r) => r + 1).join(", ") +
        " to row index " +
        (finalIndex + 1)
    );
  };

  /**
   * Fired after sorting the column
   * @param {*} currentSortConfig 	Current sort configuration
   * @param {*} destinationSortConfigs  Destination sort configuration
   */
  afterColumnSort = (currentSortConfig, destinationSortConfigs) => {
    ////console.log(currentSortConfig, destinationSortConfigs);
  };

  /**
   *
   * @param {*} e
   */
  beforeFilter = (e) => {
    this.props.addHistory(
      "Before filter action",
      this.props.values.dataToView.length + " rows present"
    );
  };

  /**
   * Fired after column filter called
   * @param {*} e An object array of the operations carried out, which
   * which takes the form
   * [
   *  {
   *    column: <columnIndex>,
   *    conditions:[
   *      {
   *        name: <operation description>
   *        args: array of values used
   *      }
   *    ],
   *    operation: "conjunction"
   *  }
   *  ...
   * ]
   */
  afterFilter = (e) => {
    this.setState({ rowsDisplayed: this.visibleGridData().length });

    ////console.log("afterFilter");
    var filterDescription = "";
    var args;

    //each item represents a filter operation
    e.forEach((item, index) => {
      //item.column = 0 based index of column

      item.conditions.forEach((condition, index) => {
        args = condition.args.join(", ");

        //  See here:
        //  https://handsontable.com/docs/9.0.0/Filters.html
        //

        //condition.name contains the filter type applied
        //filter types available are "filter by condition", "filter by value"
        //  "filter by value" is identified by the condition.name ==="by_value"
        //  "filter by condition" is identified by
        //      "empty","not_empty", "eq" (equals), "neq" (not equals),
        //      <string only>
        //      "begins_with", "ends_with","contains", "not_contains"
        //      <number based>
        //      "gt" greater than, "gte" greater than or equal to, "lt","lte"
        //      "between", "not_between"

        //condition.args contains the values provided.
        //in the case of "filter by value" it contains the values remaining
        //in the case of "filter by condition" it contains the arguments use

        if (condition.name === "by_value") {
          //values have been selected or removed
          //item.args contains an array of remain values

          this.props.addHistory(
            "Filter on values for column " + (item.column + 1),
            'selected values: "' + condition.args.join('","') + '"'
          );
        } else {
          //filtering by condition, args are dependant upon the data
          //type of the column, but some are in common to all
          switch (condition.name) {
            //args common to all
            case "empty":
              filterDescription = "show empty cells";
              break;

            case "not_empty":
              filterDescription = "show not empty cells";
              break;

            case "eq": //equals
              filterDescription = 'show cells whose text equals "' + args + '"';
              break;

            case "neq": //not equals
              filterDescription =
                'show cells whose text does not equal "' + args + '"';
              break;

            //args for number only
            case "gt": //greather than
              filterDescription =
                "show cells with a value greater than " + args;
              break;

            case "gte": //greather than or equal
              filterDescription =
                "show cells with a value greater than or equal to " + args;
              break;

            case "lt": //less than
              filterDescription = "show cells with a value less than " + args;
              break;

            case "lte": //less than
              filterDescription =
                "show cells with a value less than or equal to " + args;
              break;

            case "between":
              filterDescription = "show cells with values between " + args;
              break;

            case "not_between":
              filterDescription = "show cells with values not between " + args;
              break;

            //args for string only
            case "begins_with":
              filterDescription =
                'show cells whose text begins with "' + args + '"';
              break;

            case "ends_with":
              filterDescription =
                'show cells whose text ends with "' + args + '"';
              break;

            case "contains":
              filterDescription =
                'show cells whose text contains "' + args + '"';
              break;

            case "not_contains":
              filterDescription =
                'show cells whose text does not contain "' + args + '"';
              break;

            default:
              //none
              break;
          }

          this.props.addHistory(
            "Filter on column " + (item.column + 1),
            filterDescription
          );
        }
      });
    });

    this.props.addHistory(
      "After filter action",
      this.visibleGridData().length + " rows present"
    );
  };

  updategridIsFiltered = (pFiltered) => {
    this.setState({ gridIsFiltered: pFiltered });
  };

  /**
   * After columns or column have been moved in the grid we wish to reorde
   * https://handsontable.com/docs/9.0.0/Hooks.html#event:afterColumnMove
   * @param {*} movedColumns Array of visual column indexes to be moved.
   * @param {*} finalIndex a start index for the moved columns
   */
  afterColumnMove = (movedColumns, finalIndex) => {
    this.props.addHistory(
      "Moved columns",
      "columns " +
        //added the one as it's a zero based index
        movedColumns.map((r) => r + 1).join(", ") +
        " to column index " +
        (finalIndex + 1)
    );
  };

  /**
   * Remove all sort operations
   */
  clearSort = () => {
    const ht = this.hotTableComponent;
    ht.current.hotInstance.getPlugin("ColumnSorting").clearSort();
    this.props.addHistory("Grid clear", "all column sorts removed");
  };

  /**
   * Remove all column filters
   */
  clearFilters = () => {
    const ht = this.hotTableComponent;
    ht.current.hotInstance.getPlugin("filters").clearConditions();
    this.props.addHistory("Grid clear", "all column filters removed removed");
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
            description={this.getSelectedCells().description()}
            columnDefs={this.props.values.columnDefinitions}
            data={VisualisationData.MakeData(
              this.getSelectedCells(),
              this.props.values.columnDefinitions,
              this.visibleGridData()
            )}
            selectedCell={this.state.selectedCell}
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
              toggleHistory={this.props.toggleHistory}
            />
          </FormGroup>
        </Form>

        <Form>
          <FormGroup>
            <ButtonGroup aria-label="Basic example">
              <Button variant="secondary" onClick={this.downloadShow}>
                Export to file
              </Button>
              <Button variant="secondary" onClick={this.clearFilters}>
                Clear Filters
              </Button>
              <Button variant="secondary" onClick={this.clearSort}>
                Clear Sort
              </Button>
            </ButtonGroup>
            <Alert variant="info">
              Rows displayed: {this.state.rowsDisplayed}
            </Alert>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup>
            <HotTable
              ref={this.hotTableComponent}
              id={this.id}
              settings={this.hotSettings()}
              style={{
                width: "1000px",
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
