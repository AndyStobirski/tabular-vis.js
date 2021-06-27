import DrawChartBar from "./DrawChartBar";
import DrawChartLine from "./DrawChartLine";
import DrawChartWord from "./DrawChartWord";
import DrawChartPie from "./DrawChartPie";
import DrawPointPlotHorizontal from "./DrawPointPlotHorizontal";
import DrawPointPlotVertical from "./DrawPointPlotVertical";
import * as d3 from "d3";
import ChartDimensions from "../ChartDimensions";
import ConversionUtilities from "../ConversionUtilities";

//TODO implement pie chart
//TODO Implement box chart
//TODO Implement point plit

/**
 * Base funcion for drawing charts
 *
 * @param {*} data An array of objects {name: "", value:""}
 * @param {*} width The width of the element the chart is to be drawn in
 * @param {*} chartType Type of chart to be drawn
 * @param {*} columnDefs Information on all the columns in the grid
 * @param {*} dataType The data type of the first cell of structure to be visualised
 * @param {*} selectedCell The grid cell mouseup occured  att
 */
const DrawChart = function (
  data,
  width,
  chartType,
  columnDefs,
  dataType,
  selectedCell
) {
  const selector = "#container";

  //clear the container of any contents
  d3.select(selector).selectAll("*").remove();

  console.log(selectedCell.col, selectedCell.row);
  const dimensions = ChartDimensions(width);

  console.log(data);

  console.log(dataType);

  //The selected data needs to be converted into an appropriate
  //format to be visualised

  if (chartType === "pie") {
    data = ConversionUtilities.makePieData(data);
  } else if (dataType === "text") {
    data = ConversionUtilities.groupTextData(data);
    console.log(data);
  }

  console.log(data);

  // eslint-disable-next-line default-case
  switch (chartType) {
    case "line":
      DrawChartLine(data, selector, dimensions);
      break;

    case null:
    case "bar":
      DrawChartBar(data, selector, dimensions);
      break;

    case "pie":
      DrawChartPie(data, selector, dimensions);
      break;

    case "point":
      DrawPointPlotVertical(data, selector, dimensions);
      break;

    case "word":
      DrawChartWord(data, selector, dimensions);
      break;
  }
};

export default DrawChart;
