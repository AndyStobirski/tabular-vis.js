import React, { Component } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Handsontable from "handsontable";

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

class ViewData extends Component {
  constructor(props, context) {
    super(props, context);

    this.id = "hot";
    this.hotTableComponent = React.createRef();
    this.handsontableData = Handsontable.helper.createSpreadsheetData(1000, 10);
  }

  state = {
    showDownload: false,
    showVisualiser: false,
    gridIsFiltered: false,

    dataSelected: null,
  };

  UpdateStateValue = (property, value, func) => {
    this.setState({ [property]: value }, func);
  };

  hotSettings = () => {
    //console.log(this.columns());
    //console.log("HotSettings");
    return {
      licenseKey: "non-commercial-and-evaluation",
      colHeaders: true,
      //data: this.props.values.dataToView,
      //data: Handsontable.helper.createSpreadsheetData(1000, 1000),
      data: this.handsontableData,
      //colHeaders: this.colHeaders(),
      //colWidths: this.colWidths(),
      //columns: this.columns(),
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
      // contextMenu: this.contextMenus(),
      //autoWrapRow: true,
      rowHeights: 19,
      autoRowSize: true,
    };
  };

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

export default ViewData;
