import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

//V1 functionality
//if a row has been selected: show two slices for column 1 and not column 1 value
//if a col has been selected: show two slices for row 1 and not row one

const DrawChartPie = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);
  var radius =
    Math.min(dimensions.internalWidth(), dimensions.internalHeight()) / 2 -
    dimensions.margins.top;

  console.log(radius);
  var colour = d3.scaleOrdinal().domain(data).range(d3.schemeSet2);

  var pie = d3.pie().value(function (d) {
    return d.value;
  });
  var data_ready = pie(Object.entries(data));
  console.log(data_ready);

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", function (d) {
      return colour(d.data.key);
    })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  // Now add the annotation. Use the centroid method to get the best coordinates
  svg
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return "grp " + d.data.key;
    })
    .attr("transform", function (d) {
      return "translate(" + arcGenerator.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .style("font-size", 17);
};

export default DrawChartPie;
