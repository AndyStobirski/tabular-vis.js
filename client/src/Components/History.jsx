import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { BiCopy, BiTrash } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import { CopyToClipboard } from "react-copy-to-clipboard";

// DONE Implement copy to clipboard
// DONE Implement text formatting of copy to clipboard

class History extends Component {
  state = {};

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

  render() {
    return (
      <Form style={{ wordBreak: "break-all" }}>
        <Navbar bg="primary" expand="sm" variant="dark">
          <Navbar.Brand>History</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          <CopyToClipboard text={this.getHistory().join("\r\n")}>
            <Button>
              <BiCopy />
            </Button>
          </CopyToClipboard>
          <Button onClick={this.props.clearHistory}>
            <BiTrash />
          </Button>
        </Navbar>
        <Form.Group style={{ fontSize: 13 }}>
          {this.getHistory().map((historyItem, index) => {
            return <Form.Label>{historyItem}</Form.Label>;
          })}
        </Form.Group>
      </Form>
    );
  }
}

export default History;
