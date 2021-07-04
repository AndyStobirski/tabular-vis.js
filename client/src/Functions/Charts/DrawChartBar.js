import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

//as per https://stackoverflow.com/a/41948540
const DrawChartBar = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);

  // set the ranges
  var x = d3.scaleBand().range([0, dimensions.internalWidth()]).padding(0.4);

  var y = d3.scaleLinear().range([dimensions.internalHeight(), 0]);

  // Scale the range of the data in the domains
  x.domain(
    data.map(function (n) {
      return n.name;
    })
  );

  var yMin = d3.min(data, function (n) {
    return n.value;
  });

  y.domain([
    yMin > 0 ? 0 : yMin,
    d3.max(data, function (n) {
      return n.value;
    }),
  ]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(data)
    .attr("fill", "#69b3a2")
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.name);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("height", function (d) {
      return dimensions.internalHeight() - y(d.value);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
  ////console.log("DrawChartBar", "End");
};

export default DrawChartBar;
