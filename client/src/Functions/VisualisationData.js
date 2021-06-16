/**
 *
 */
const VisualisationData = {
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

    var graphData = {
      dataType: iAm.dataType,
      values: values,
    };

    return graphData;
  },
};

export default VisualisationData;
