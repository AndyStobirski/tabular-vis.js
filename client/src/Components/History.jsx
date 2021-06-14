import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { BiCopy, BiTrash } from "react-icons/bi";
import Button from "react-bootstrap/Button";

// TODO Implement copy to clipboard

class History extends Component {
  state = {};

  render() {
    return (
      <Form style={{ wordBreak: "break-all" }}>
        <Navbar bg="primary" expand="sm" variant="dark">
          <Navbar.Brand>History</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          <Button>
            <BiCopy />
          </Button>
          <Button onClick={this.props.clearHistory}>
            <BiTrash />
          </Button>
        </Navbar>
        <Form.Group style={{ fontSize: 13 }}>
          {this.props.history.map((historyItem, index) => {
            return (
              <Form.Label>
                {historyItem.action}
                {": "}
                {historyItem.description}
              </Form.Label>
            );
          })}
        </Form.Group>
      </Form>
    );
  }
}

export default History;
