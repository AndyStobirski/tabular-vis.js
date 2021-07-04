import cloud from "d3-cloud";
import * as d3 from "d3";

//TODO Implement world cloud
const DrawChartWord = function (data, selector, dimensions) {
  //need a bigger left border for the labels
  dimensions.margins.left = 100;
  //var svg = ChartBuildBody(selector, dimensions);

  var layout = cloud()
    .size([dimensions.containerWidth, dimensions.containerHeight])
    .words(
      data.map((d) => {
        return { text: d.name, size: d.value * 10 };
      })
    )
    .padding(5)
    // .rotate(function () {
    //   return ~~(Math.random() * 2) * 90;
    // })
    .font("Impact")
    .fontSize(function (d) {
      return d.size;
    })
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select(selector)
      .append("svg")
      .attr("width", dimensions.internalWidth())
      .attr("height", dimensions.internalHeight())
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }
};

export default DrawChartWord;
