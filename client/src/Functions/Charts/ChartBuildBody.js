import * as d3 from "d3";

/**
 * Base selector for building chart body
 */
const ChartBuildBody = function (selector, dimensions) {
  return d3
    .select(selector)
    .append("svg")
    .attr("width", dimensions.containerWidth)
    .attr("height", dimensions.containerHeight)
    .append("g")
    .attr(
      "transform",
      "translate(" +
        dimensions.margins.left +
        "," +
        dimensions.margins.top +
        ")"
    );
};

export default ChartBuildBody;
