import * as d3 from "d3";

//text on y axis
//https://www.d3-graph-gallery.com/graph/lollipop_ordered.html

//text on x axis
//https://www.d3-graph-gallery.com/graph/lollipop_basic.html

const DrawChartWord = function (values, selector, dimensions) {
  dimensions.margins.left = 100;

  // append the svg object to the body of the page
  var svg = d3
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

  //an array of arrays [[key, [,]]]
  var d3Groups = d3.groups(values, (v) => v.value);

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(d3Groups, function (v) {
        return v[1].length;
      }), //get largest array in d3Group
    ])
    .range([0, dimensions.internalWidth()]);
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3
    .scaleBand()
    .range([0, dimensions.internalHeight()])
    .domain(
      d3Groups.map(function (d) {
        return d[0];
      })
    )
    .padding(1);
  svg.append("g").call(d3.axisLeft(y));

  // Lines
  svg
    .selectAll("myline")
    .data(d3Groups)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d[1].length);
    })
    .attr("x2", x(0))
    .attr("y1", function (d) {
      return y(d[0]);
    })
    .attr("y2", function (d) {
      return y(d[0]);
    })
    .attr("stroke", "grey");

  // Circles
  svg
    .selectAll("mycircle")
    .data(d3Groups)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d[1].length);
    })
    .attr("cy", function (d) {
      return y(d[0]);
    })
    .attr("r", "7")
    .style("fill", "#69b3a2")
    .attr("stroke", "black");
};

export default DrawChartWord;
