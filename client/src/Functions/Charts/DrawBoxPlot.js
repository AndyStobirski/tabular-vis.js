import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

/**
 * Draw a box plot
 *
 * Test the accuracy here http://www.alcula.com/calculators/statistics/box-plot/
 *
 * @param {*} data
 * @param {*} selector
 * @param {*} dimensions
 */
const DrawBoxPlot = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);

  //Compute summary statistics used for the box
  var data_sorted = data.sort(d3.ascending);
  var q1 = d3.quantile(data_sorted, 0.25);
  var median = d3.quantile(data_sorted, 0.5);
  var q3 = d3.quantile(data_sorted, 0.75);
  var min = d3.min(data_sorted);
  var max = d3.max(data_sorted);

  // Show the Y scale
  var y = d3
    .scaleLinear()
    .domain([d3.min(data_sorted) - 10, d3.max(data_sorted) + 10])
    .range([dimensions.internalHeight(), 0]);

  svg.call(d3.axisLeft(y));

  // a few features for the box
  const center = 200;
  const boxWidth = 100;

  //Vertical line
  svg
    .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min))
    .attr("y2", y(max))
    .attr("stroke", "black");

  //Draw the box
  svg
    .append("rect")
    .attr("x", center - boxWidth / 2)
    .attr("y", y(q3))
    .attr("height", y(q1) - y(q3))
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill", "#69b3a2");

  //Draw median, min and max horizontal lines
  svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", center - boxWidth / 2)
    .attr("x2", center + boxWidth / 2)
    .attr("y1", function (d) {
      return y(d);
    })
    .attr("y2", function (d) {
      return y(d);
    })
    .attr("stroke", "black");

  //draw text labels
  const rightEdge = center + boxWidth / 2 + 20;

  //max label
  svg
    .append("text")
    .style("text-anchor", "start")
    .style("fill", "black")
    .attr("x", rightEdge)
    .attr("y", y(max)) //get the SVG coordinate associated number value
    .text("max: " + max);

  svg
    .append("text")
    .style("text-anchor", "start")
    .style("fill", "black")
    .attr("x", rightEdge)
    .attr("y", y(min))
    .text("min: " + min);

  svg
    .append("text")
    .style("text-anchor", "start")
    .style("fill", "black")
    .attr("x", rightEdge)
    .attr("y", y(q1))
    .text("lower quartile: " + q1);

  svg
    .append("text")
    .style("text-anchor", "start")
    .style("fill", "black")
    .attr("x", rightEdge)
    .attr("y", y(q3))
    .text("upper quartile: " + q3);

  //doing this on the other side as it is possible for
  //a median to be the same as q1 or q3
  const leftEdge = center - boxWidth / 2 - 20;
  svg
    .append("text")
    .style("text-anchor", "right")
    .style("fill", "black")
    .attr("x", leftEdge)
    .attr("y", y(median))
    .text("median: " + median);
};

export default DrawBoxPlot;
