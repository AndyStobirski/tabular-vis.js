import DrawBarChart from "./DrawBarChart";
import DrawLineChart from "./DrawLineChart";
import DrawPieChart from "./DrawPieChart";
import DrawWordCloud from "./DrawWordCloud";
import * as d3 from "d3";

/**
 *
 * @param {*} values An array of objects {name: "", value:""}
 * @param {*} width
 * @param {*} chartType
 */
const DrawChart = function (values, width, chartType) {
  const height = 500;
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  };

  const dimensions = {
    containerHeight: height,
    containerWidth: width,
    margins: margin,
    internalHeight: function () {
      return this.containerHeight - this.margins.top - this.margins.bottom;
    },
    internalWidth: function () {
      return this.containerWidth - this.margins.left - this.margins.right;
    },
  };

  const selector = "#container";

  //clear the container of any contents
  d3.select(selector).selectAll("*").remove();

  // eslint-disable-next-line default-case
  switch (chartType) {
    case "line":
      DrawLineChart(values, selector, dimensions);
      break;

    case "bar":
      DrawBarChart(values, selector, dimensions);
      break;

    case "pie":
      DrawPieChart(values, selector, dimensions);
      break;

    case "word":
      DrawWordCloud(values, selector, dimensions);
      break;
  }
};

export default DrawChart;
