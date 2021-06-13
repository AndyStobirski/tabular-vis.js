import React, { Component } from "react";
import {
  ProSidebar,
  SidebarHeader,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import ListGroup from "react-bootstrap/ListGroup";

//  https://github.com/azouaoui-med/react-pro-sidebar
//  https://azouaoui-med.github.io/react-pro-sidebar/
//  https://reactjsexample.com/customizable-and-responsive-react-sidebar-library-with-dropdown-menus/
class History extends Component {
  state = {};
  render() {
    //return (
    //   this.props.collapsed && (
    //     <div
    //       style={{
    //         //padding: "24px",
    //         // textTransform: "uppercase",
    //         // fontWeight: "bold",
    //         fontSize: 12,
    //         //letterSpacing: "1px",
    //         overflow: "hidden",
    //         //textOverflow: "ellipsis",
    //         width: "200px",
    //       }}
    //     >
    //       {this.props.history.map((historyItem, index) => {
    //         return (
    //           <p key={index}>
    //             {historyItem.action}
    //             {": "}
    //             {historyItem.description}
    //           </p>
    //         );
    //       })}
    //     </div>
    //   )
    // );

    console.log(this.props.history);
    return (
      <ProSidebar
        collapsed={this.props.collapsed}
        collapsedWidth="0px"
        breakPoint="md"
      >
        <SidebarHeader>
          <div
            style={{
              padding: "24px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: "1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Transform History
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            {this.props.history.map((historyItem, index) => {
              return (
                <MenuItem key={index}>
                  {historyItem.action}
                  {": "}
                  {historyItem.description}
                </MenuItem>
              );
            })}
          </Menu>
        </SidebarContent>
        <SidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: "20px 24px",
            }}
          ></div>
        </SidebarFooter>
      </ProSidebar>
    );
  }
}

export default History;
