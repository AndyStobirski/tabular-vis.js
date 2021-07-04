import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { BiCopy, BiTrash } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import { CopyToClipboard } from "react-copy-to-clipboard";

// DONE Implement copy to clipboard
// DONE Implement text formatting of copy to clipboard

class History extends Component {
  state = { showToast: false };

  /**
   * Output the history as a text array
   * @returns array
   */
  getHistory = () => {
    const history = this.props.history;

    return history.map((historyItem, index) => {
      return historyItem.action + ": " + historyItem.description;
    });
  };

  toggleToast = () => {
    this.setState({ showToast: !this.state.showToast });
  };

  render() {
    return (
      <Form style={{ wordBreak: "break-all" }}>
        <Navbar expand="sm" bg="light">
          <Navbar.Brand>History</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          <CopyToClipboard text={this.getHistory().join("\r\n")}>
            <Button variant="light" onClick={this.toggleToast}>
              <BiCopy />
            </Button>
          </CopyToClipboard>
          <Button onClick={this.props.clearHistory} variant="light">
            <BiTrash />
          </Button>
        </Navbar>
        <Toast
          bg="Info"
          onClose={() => this.toggleToast()}
          show={this.state.showToast}
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong>History copied to clipboard</strong>
          </Toast.Header>
        </Toast>
        {this.getHistory().map((historyItem, index) => {
          return (
            <p>
              <small>{historyItem}</small>
            </p>
          );
        })}
      </Form>
    );
  }
}

export default History;
