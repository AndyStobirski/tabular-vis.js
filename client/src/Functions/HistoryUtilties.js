const HistoryUtilties = {
  MakeHistoryItem: function (action, description) {
    var item = { action: action, description: description };
    return item;
  },
};

export default HistoryUtilties;
