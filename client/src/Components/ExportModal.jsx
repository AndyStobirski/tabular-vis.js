import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class ExportModal extends Component {
  state = {
    exportHiddenRows: false, // default false
    exportHiddenColumns: false, // default false
    columnHeaders: true, // default false
    rowHeaders: false, // default false

    filename: "ExportedData_[YYYY]-[MM]-[DD]",
    rowDelimiter: "\r\n",
    columnDelimiter: ",",
  };

  exportToFile = () => {
    const hotInstance = this.props.tableInstance;
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

  render() {
    return (
      <Modal show={this.props.show} centered onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Export data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="checkbox"
            label="Export Hidden Rows"
            checked={this.state.exportHiddenRows}
            onChange={(e) =>
              this.setState({ exportHiddenRows: e.target.checked })
            }
          />
          <Form.Check
            type="checkbox"
            label="Export Hidden Cols"
            checked={this.state.exportHiddenColumns}
            onChange={(e) =>
              this.setState({ exportHiddenColumns: e.target.checked })
            }
          />
          <Form.Check
            type="checkbox"
            label="Column Headers"
            checked={this.state.columnHeaders}
            onChange={(e) => this.setState({ columnHeaders: e.target.checked })}
          />
          <Form.Check
            type="checkbox"
            label="Row Headers"
            checked={this.state.rowHeaders}
            onChange={(e) => this.setState({ rowHeaders: e.target.checked })}
          />
          <Form.Label>Filename</Form.Label>
          <Form.Control
            value={this.state.filename}
            onChange={(e) => this.setState({ filename: e.target.value })}
          />
          <Form.Label>Column delimeter</Form.Label>
          <Form.Control
            value={this.state.columnDelimiter}
            onChange={(e) => this.setState({ columnDelimiter: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
          <Button onClick={this.exportToFile}>Export</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ExportModal;
