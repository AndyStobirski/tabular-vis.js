import * as d3 from "d3";

const VisualisationData = {
  /**
   * Convert selected spreadsheet data into a standard data format
   * for use by the Chart funcitions
   *
   * @param {*} iAm Structure selected in the spreadsheet either "Row" or "Column"
   * @param {*} columnDefs Object array describing the columns of the spreadsheet
   * @param {*} gridData An array representing the data in the selected structure
   * @returns Object array of [{name:"",value:""}]
   */
  MakeData: function (iAm, columnDefs, gridData) {
    let values = [];
    let cell = null;

    if (iAm.structure === "Row") {
      var row = gridData[iAm.value];

      for (var ctr = 0; ctr < columnDefs.length; ctr++) {
        cell = {
          name: columnDefs[ctr].colName,
          value: row[ctr],
        };

        if (columnDefs[ctr].dataType === "numeric" && cell.value === null)
          cell.value = 0;

        values.push(cell);
      }
    } else {
      var colIsNumeric = columnDefs[iAm.value].dataType === "numeric";

      //Column selected
      values = gridData.map((row) => {
        return {
          name: row[0],
          value: colIsNumeric && row[iAm.value] === null ? 0 : row[iAm.value],
        };
      });
    }

    //finally, ensure the name value of each object is unique
    //this is a hack to allow D3 charts to correctly render as
    //they rely upon unique values

    //this will return an array of items grouped by v.name
    var grp = d3.group(values, (v) => v.name);

    grp.forEach((g) => {
      if (g.length > 1) {
        var ctr = 1;
        const name = g[0].name;
        values.forEach((v) => {
          if (v.name === name) {
            v.name = v.name + " " + ctr++;
          }
        });
      }
    });

    //build the object
    var graphData = {
      dataType: iAm.dataType,
      values: values,
    };

    return graphData;
  },
};

export default VisualisationData;
