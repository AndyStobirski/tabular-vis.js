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

// TODO Add options dialogue for export grid data

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
  };

  UpdateStateValue = (property, value, func) => {
    console.log("UpdateStateValue");
    console.log(property, value);
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
      this.hotTableComponent.current.hotInstance.getData(),
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
      width: "100%",
    };
  };

  exportToFile = () => {
    console.log(this.state);

    const hotInstance = this.hotTableComponent.current.hotInstance;
    const exportPlugin1 = hotInstance.getPlugin("exportFile");

    exportPlugin1.downloadFile("csv", {
      bom: false,

      exportHiddenRows: this.state.exportHiddenRows,
      exportHiddenColumns: this.state.exportHiddenColumns,
      columnHeaders: this.state.columnHeaders,
      rowHeaders: this.state.rowHeaders,

      filename: this.state.filename,
      columnDelimiter: this.state.columnDelimiter,
      rowDelimiter: this.state.rowDelimiter,

      fileExtension: "csv",

      mimeType: "text/csv",
    });
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
    console.log("afterRowMove");
  };

  afterFilter = () => {
    console.log("afterFiler");
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
    // // TODO Add context menu support - https://handsontable.com/docs/8.4.0/frameworks-wrapper-for-react-custom-context-menu-example.html
    // // TODO Add Selected data support
    // // TODO add row dragging
    // // TODO add column dragging
    // // TODO add column filtering
    // // TODO add column ordering

    return (
      <React.Fragment>
        <VisualiseModal
          show={this.state.showVisualiser}
          close={this.visualiserClose}
        />
        <ExportModal
          show={this.state.showDownload}
          close={this.downloadClose}
          updateSettings={this.UpdateStateValue}
          export={this.exportToFile}
          exportHiddenRows={this.state.exportHiddenRows}
          exportHiddenColumns={this.state.exportHiddenColumns}
          columnHeaders={this.state.columnHeaders}
          rowHeaders={this.state.rowHeaders}
          filename={this.state.filename}
          columnDelimiter={this.state.columnDelimiter}
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
            />
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default ViewData;
