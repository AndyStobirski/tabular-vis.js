import * as d3 from "d3";

const ConversionUtilities = {
  /**
   * Attempt to convert the provided object to a number
   * @param {*} pNum value to convert
   * @returns if null not a number, else number
   */
  convertToNumber: function (pNum) {
    console.log(pNum);

    var num = Number(pNum.toString().replace(/,|%/g, ""));
    if (typeof num === "number" && isFinite(num)) return num;
    return null;
  },

  /**
   * Process the selected HTML table by converting the provided JSON array
   * into an array of arrays and extract column names and guessing data types
   * @param {*} pTableData object representing table
   * @returns object containg the table data a list of column definitions
   */
  processTableTable: function (pTableData) {
    //build the column definitions by examining the first row
    var colDef = [];
    var col = {};
    for (const key in pTableData[0]) {
      col = {
        colName: key,
        required: true,
        dataType:
          this.convertToNumber(pTableData[0][key]) === null
            ? "text"
            : "numeric",
        allowBlank: true,
      };

      colDef.push(col);
    }

    //convert object array into array of arrays
    var conv = pTableData.map(function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    });

    return Object.create({
      data: conv,
      columnDefinitions: colDef,
    });
  },

  /**
   * Build a data set that will be viewed in a grid
   * @param {*} pDataToClean An array of the table data
   * @param {*} pColumnDefinitions A list of column defintions entered in step 2
   * @returns Object containing data to viewed and column defintiions
   */
  buildDataToView: function (pDataToClean, pColumnDefinitions) {
    //get the column information
    let colsToRemove = []; // indexes of columns marked as not required by the user
    let colHeadersView = []; // names of columns required by the user
    pColumnDefinitions.forEach((el, ind) => {
      if (!el.required) {
        colsToRemove.push(ind);
      } else {
        colHeadersView.push(el.colName);
      }
    });
    colsToRemove.sort().reverse();

    //make a value copy of the array or arrays - https://stackoverflow.com/a/13756775/500181
    var data = pDataToClean.map(function (row) {
      return row.slice();
    });

    //convert data a column at a time
    const histConversionCols = [];
    pColumnDefinitions.forEach((col, colIdx) => {
      if (
        pColumnDefinitions[colIdx].required &&
        pColumnDefinitions[colIdx].dataType === "numeric"
      ) {
        var nonNumeric = 0;

        data.forEach((row, rIdx) => {
          row[colIdx] = ConversionUtilities.convertToNumber(row[colIdx]);
          if (row[colIdx] === null) nonNumeric++;
        });

        if (nonNumeric > 0) {
          histConversionCols.push({
            action: "Column " + (colIdx + 1) + " Data conversion to numeric",
            description: "Unable to convert " + nonNumeric + " value(s)",
          });
        }
      }
    });

    //delete the columns that are not checked
    data.forEach((row, ind) => {
      colsToRemove.forEach((d) => {
        row.splice(d, 1);
      });
    });

    var retVal = {
      colHeadersView: colHeadersView,
      dataToView: data,
      conversionHistory: histConversionCols,
    };

    return retVal;
  },

  /*
   * All the functions below are to convert the selected
   * spreadsheet data into something that is used in the
   * graph drawing function.
   *
   * The parameter pData takes the form of an object array
   * of [{ name: "", value: "" }...]
   *
   */

  /**
   * Make pie data by grouping the value and counting it
   * @param {*} pData
   * @returns Two values: 1st in last and the rest
   */
  makePieData: function (pData) {
    var grp = d3.group(pData, (v) => v.value);
    var pie = [];
    grp.forEach((g) => {
      pie.push({ name: g[0].value, value: g.length });
    });

    const sum = d3.sum(pie.map((p) => p.value));

    return [
      { name: pie[0].name, value: pie[0].value },
      { name: "except " + pie[0].name, value: sum - pie[0].value },
    ];
  },

  /**
   * Count each item value item in the list
   * @param {*} pData
   * @returns
   */
  groupTextData: function (pData) {
    var grp = d3.group(pData, (v) => v.value);
    var pie = [];
    grp.forEach((g) => {
      pie.push({ name: g[0].value, value: g.length });
    });
    return pie;
  },

  /**
   * Convert all value items to number
   * @param {*} pData
   * @returns number array
   */
  convertToGraph: function (pData) {
    return pData.map((d) => {
      d.value = this.convertToNumber(d.value);
      return d;
    });
  },

  /**
   * Extract the number values from the provided data and return only them
   * @param {*} pData
   * @returns Array of numbers
   */
  convertToNumberArray: function (pData) {
    return pData
      .map((v) => {
        return this.convertToNumber(v.value);
      })
      .filter((item) => item);
  },

  // ,makePieData1: function (data) {
  //   //convert to numbers
  //   data.forEach(
  //     (r) => (r.value = ConversionUtilities.convertToNumber(r.value))
  //   );

  //   //remove none numbers
  //   data = data.filter((f) => f.value !== null);

  //   //calculate percentages
  //   const total = d3.sum(
  //     data.map((c) => {
  //       return c.value;
  //     })
  //   );
  //   data.forEach((c) => (c.value = (c.value / total) * 100));

  //   return data;
  // },
};

export default ConversionUtilities;
