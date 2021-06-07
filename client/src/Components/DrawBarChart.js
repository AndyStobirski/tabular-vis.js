"use strict";

import * as d3 from "d3";

//as per https://stackoverflow.com/a/41948540
const DrawBarChart = function (values, selector) {
  console.log("DrawBarChart", values);
  console.log(
    values.map(function (n) {
      return n.name;
    })
  );
  //get the width of the container the graph will be drawn into to prevent fallout
  var element = d3.select("#container").node();
  const containerWidth = 800; //= element.getBoundingClientRect().width;

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = containerWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.4);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain(
    values.map(function (n) {
      return n.name;
    })
  );
  y.domain([
    d3.min(values, function (n) {
      return n.value;
    }),
    d3.max(values, function (n) {
      return n.value;
    }),
  ]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(values)
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
      return height - y(d.value);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
};

export default DrawBarChart;
