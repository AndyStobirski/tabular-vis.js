import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

//as per https://stackoverflow.com/a/41948540
const DrawChartLine = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);

  var x = d3
    .scaleBand()
    .range([0, dimensions.internalWidth()])
    .domain(
      data.map(function (d) {
        return d.name;
      })
    )
    .padding(1);

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

  //add value labels
  svg
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function (d) {
      return x(d.name) + x.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return y(d.value) - 5;
    })
    .text(function (d) {
      return Math.round(d.value * 100) / 100;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
};

export default DrawChartLine;
