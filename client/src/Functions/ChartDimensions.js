/**
 * Width and border information for chart drawing
 */
const ChartDimensions = function (width) {
  const height = 500;
  return {
    containerHeight: height,
    containerWidth: width,
    margins: {
      top: 20,
      right: 20,
      bottom: 100,
      left: 40,
    },

    internalHeight: function () {
      return this.containerHeight - this.margins.top - this.margins.bottom;
    },
    internalWidth: function () {
      return this.containerWidth - this.margins.left - this.margins.right;
    },
  };
};

export default ChartDimensions;
