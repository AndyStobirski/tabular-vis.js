import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";

//text on y axis
//https://www.d3-graph-gallery.com/graph/lollipop_ordered.html

//text on x axis
//https://www.d3-graph-gallery.com/graph/lollipop_basic.html

//FIXME two identical X values will be plotted on the same line, instead of separate lines. FIX.
const DrawPointPlotVertical = function (data, selector, dimensions) {
  var svg = ChartBuildBody(selector, dimensions);

  //an array of arrays [[key, [,]]]
  //var d3Groups = d3.groups(data, (v) => v.value);
  // X axis
  var x = d3
    .scaleBand()
    .range([0, dimensions.internalWidth()])
    .domain(
      data.map(function (d) {
        return d.name;
      })
    )
    .padding(1);

  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return d.value;
      }),
      d3.max(data, function (d) {
        return d.value;
      }),
    ])
    .range([dimensions.internalHeight(), 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Lines
  svg
    .selectAll("myline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d.name);
    })
    .attr("x2", function (d) {
      return x(d.name);
    })
    .attr("y1", function (d) {
      return y(d.value);
    })
    .attr("y2", y(0))
    .attr("stroke", "grey");

  // Circles
  svg
    .selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.name);
    })
    .attr("cy", function (d) {
      return y(d.value);
    })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black");
};

export default DrawPointPlotVertical;
