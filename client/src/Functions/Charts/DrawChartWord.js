import cloud from "d3-cloud";
import ChartBuildBody from "./ChartBuildBody";

//TODO Implement world cloud
const DrawChartWord = function (data, selector, dimensions) {
  //need a bigger left border for the labels
  dimensions.margins.left = 100;
  var svg = ChartBuildBody(selector, dimensions);
};

export default DrawChartWord;
