import DrawChartBar from "./DrawChartBar";
import DrawChartLine from "./DrawChartLine";
import DrawChartWord from "./DrawChartWord";
import DrawChartPie from "./DrawChartPie";
import * as d3 from "d3";
import ChartDimensions from "./ChartDimensions";

//TODO implement pie chart
//TODO Implement box chart
//TODO Implement point plit

/**
 * Base funcion for drawing charts
 *
 * @param {*} data An array of objects {name: "", value:""}
 * @param {*} width The width of the element the chart is to be drawn in
 * @param {*} chartType Type of chart to be drawn
 */
const DrawChart = function (data, width, chartType) {
  const dimensions = ChartDimensions(width);
  const selector = "#container";

  //clear the container of any contents
  d3.select(selector).selectAll("*").remove();

  // eslint-disable-next-line default-case
  switch (chartType) {
    case "line":
      DrawChartLine(data, selector, dimensions);
      break;

    case "bar":
      DrawChartBar(data, selector, dimensions);
      break;

    case "pie":
      DrawChartPie(data, selector, dimensions);
      break;

    case "word":
      DrawChartWord(data, selector, dimensions);
      break;
  }
};

export default DrawChart;
