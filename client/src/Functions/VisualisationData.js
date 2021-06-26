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
    const values = [];

    if (iAm.structure === "Row") {
      for (var ctr = 0; ctr < columnDefs.length; ctr++) {
        values.push({
          name: columnDefs[ctr],
          value: gridData[iAm.value][ctr],
        });
      }
    } else {
      gridData.map((row) => {
        values.push({
          name: row[0],
          value: row[iAm.value],
        });
        return null;
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

    //console.log(JSON.stringify(graphData));
    return graphData;
  },
};

export default VisualisationData;
