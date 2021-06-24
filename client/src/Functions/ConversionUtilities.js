import * as d3 from "d3";

const ConversionUtilities = {
  /**
   * Attempt to convert the provided object to a number
   * @param {*} pNum value to convert
   * @returns if null not a number, else number
   */
  convertToNumber: function (pNum) {
    var num = Number(pNum);
    if (typeof num === "number" && isFinite(num)) return num;
    return null;
  },

  /**
   * Process the selected HTML table by converting the provided JSON array
   * into an array of arrays and extract column names and guessing data types
   * @param {*} pTableData object representing table
   * @returns object cont
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

  buildDataToView: function (pDataToClean, pColumnDefinitions) {
    //get the column information: colsToDelete and colsToView
    let colsToRemove = [];
    let colHeadersView = [];
    pColumnDefinitions.forEach((el, ind) => {
      if (!el.required) {
        colsToRemove.push(ind);
      } else {
        colHeadersView.push(el.colName);
      }
    });
    colsToRemove.sort().reverse();

    //make a value copy of the array or arrays
    //https://stackoverflow.com/a/13756775/500181
    var data = pDataToClean.map(function (row) {
      return row.slice();
    });

    //console.log(columnDefinitions);
    data.forEach((row, rIdx) => {
      row.forEach((col, cIdx) => {
        if (
          pColumnDefinitions[cIdx].required &&
          pColumnDefinitions[cIdx].dataType === "numeric"
        ) {
          row[cIdx] = ConversionUtilities.convertToNumber(col);
        }
      });
    });

    //delete the columns that are not checked
    data.forEach((row, ind) => {
      colsToRemove.forEach((d) => {
        row.splice(d, 1);
      });
    });

    //console.log(data, colHeadersView);

    var retVal = {
      colHeadersView: colHeadersView,
      dataToView: data,
    };

    return retVal;
  },

  //data consists of an array object { name: "", value: "" }
  //TODO Clean up
  makePieData: function (data) {
    //convert to numbers
    data.forEach(
      (r) => (r.value = ConversionUtilities.convertToNumber(r.value))
    );

    //remove none numbers
    data = data.filter((f) => f.value !== null);

    //calculate percentages
    const total = d3.sum(
      data.map((c) => {
        return c.value;
      })
    );
    data.forEach((c) => (c.value = (c.value / total) * 100));

    return data;
  },
};

export default ConversionUtilities;
