import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class ExportModal extends Component {
  render() {
    //console.log(this.props);
    return (
      <Modal show={this.props.show} centered onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Export data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="checkbox"
            label="Export Hidden Rows"
            checked={this.props.exportHiddenRows}
            onChange={(e) =>
              this.props.updateSettings("exportHiddenRows", e.target.checked)
            }
          />
          <Form.Check
            type="checkbox"
            label="Export Hidden Cols"
            checked={this.props.exportHiddenColumns}
            onChange={(e) =>
              this.props.updateSettings("exportHiddenColumns", e.target.checked)
            }
          />
          <Form.Check
            type="checkbox"
            label="Column Headers"
            checked={this.props.columnHeaders}
            onChange={(e) =>
              this.props.updateSettings("columnHeaders", e.target.checked)
            }
          />
          <Form.Check
            type="checkbox"
            label="Row Headers"
            checked={this.props.rowHeaders}
            onChange={(e) =>
              this.props.updateSettings("rowHeaders", e.target.checked)
            }
          />
          <Form.Label>Filename</Form.Label>
          <Form.Control
            value={this.props.filename}
            onChange={(e) =>
              this.props.updateSettings("filename", e.target.value)
            }
          />
          <Form.Label>Column delimeter</Form.Label>
          <Form.Control
            value={this.props.columnDelimiter}
            onChange={(e) =>
              this.props.updateSettings("columnDelimiter", e.target.value)
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
          <Button onClick={this.props.export}>Export</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ExportModal;
