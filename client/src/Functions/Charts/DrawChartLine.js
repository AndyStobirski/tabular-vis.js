import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

//as per https://stackoverflow.com/a/41948540
const DrawChartLine = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);

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

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));

  // Add the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.name);
        })
        .y(function (d) {
          return y(d.value);
        })
    );
};

export default DrawChartLine;
