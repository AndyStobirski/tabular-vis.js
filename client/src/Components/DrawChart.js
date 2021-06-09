import DrawChartBar from "./DrawChartBar";
import DrawChartLine from "./DrawChartLine";
import DrawChartPie from "./DrawChartPie";
import DrawChartWord from "./DrawChartWord";
import * as d3 from "d3";

/**
 *
 * @param {*} values An array of objects {name: "", value:""}
 * @param {*} width
 * @param {*} chartType
 */
const DrawChart = function (values, width, chartType) {
  const height = 500;
  const dimensions = {
    containerHeight: height,
    containerWidth: width,
    margins: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40,
    },

    internalHeight: function () {
      return this.containerHeight - this.margins.top - this.margins.bottom;
    },
    internalWidth: function () {
      return this.containerWidth - this.margins.left - this.margins.right;
    },
  };

  console.log(JSON.stringify(values));

  const selector = "#container";

  //clear the container of any contents
  d3.select(selector).selectAll("*").remove();

  // eslint-disable-next-line default-case
  switch (chartType) {
    case "line":
      DrawChartLine(values, selector, dimensions);
      break;

    case "bar":
      DrawChartBar(values, selector, dimensions);
      break;

    case "pie":
      DrawChartPie(values, selector, dimensions);
      break;

    case "word":
      DrawChartWord(values, selector, dimensions);
      break;
  }
};

export default DrawChart;
