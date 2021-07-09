import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

//as per https://stackoverflow.com/a/41948540
const DrawChartBar = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);

  // set the ranges
  var x = d3
    .scaleBand()
    .range([0, dimensions.internalWidth()])
    .padding(0.4)
    .domain(
      data.map(function (n) {
        return n.name;
      })
    );

  var y = d3.scaleLinear().range([dimensions.internalHeight(), 0]);

  var yMin = d3.min(data, function (n) {
    return n.value;
  });

  y.domain([
    yMin > 0 ? 0 : yMin,
    d3.max(data, function (n) {
      return n.value;
    }),
  ]);

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));

  // Create rectangles
  let bars = svg.selectAll(".bar").data(data).enter().append("g");

  bars
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.name);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return dimensions.internalHeight() - y(d.value);
    });

  //bar char values
  bars
    .append("text")
    .text(function (d) {
      return Math.round(d.value * 100) / 100;
    })
    .attr("x", function (d) {
      return x(d.name) + x.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return y(d.value) - 5;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  //x axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
};

export default DrawChartBar;
