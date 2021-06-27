import * as d3 from "d3";
import ChartBuildBody from "./ChartBuildBody";
import Lookups from "../GetData";

//V1 functionality
// numeric only
// if a row has been selected: show two slices for column 1 and not column 1 value
// if a col has been selected: show two slices for row 1 and not row one
// numeric values are show as a % of the sum of values

//v2 fucntionality
// TODO Clean up code
// TODO Add percentile values
const DrawChartPie = function (data, selector, dimensions) {
  //console.log("DrawChartPie", data);
  var svg = ChartBuildBody(selector, dimensions);
  var radius =
    Math.min(dimensions.internalWidth(), dimensions.internalHeight()) / 2 -
    dimensions.margins.top;

  var colors = Lookups.Colours();

  var pie = d3.pie().value((d) => d.value);

  var color_scale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(colors);

  let arc = d3.arc().outerRadius(radius).innerRadius(50);

  var p_chart = svg
    .selectAll("pie")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("transform", "translate(170,230)");

  p_chart
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => {
      return color_scale(d.data.name);
    });

  p_chart
    .append("text")
    .text(function (d) {
      return d.data.name;
    })
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .style("text-anchor", "middle");
};

export default DrawChartPie;
