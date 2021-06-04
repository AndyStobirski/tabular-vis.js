import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class VisualiseModal extends Component {
  state = {};

  render() {
    //console.log(this.props);
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
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VisualiseModal;
