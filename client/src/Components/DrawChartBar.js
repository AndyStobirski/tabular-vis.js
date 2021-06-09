import * as d3 from "d3";

//as per https://stackoverflow.com/a/41948540
const DrawChartBar = function (values, selector, dimensions) {
  // set the ranges
  var x = d3.scaleBand().range([0, dimensions.internalWidth()]).padding(0.4);

  var y = d3.scaleLinear().range([dimensions.internalHeight(), 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
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

  // Scale the range of the data in the domains
  x.domain(
    values.map(function (n) {
      return n.name;
    })
  );

  var yMin = d3.min(values, function (n) {
    return n.value;
  });

  y.domain([
    yMin > 0 ? 0 : yMin,
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
      return dimensions.internalHeight() - y(d.value);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.internalHeight() + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
};

export default DrawChartBar;
