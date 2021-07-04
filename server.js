// TODO Fix exception handling

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/LoadTable", (req, res) => {
  const retVal = {
    Message: null,
    Data: null,
  };

  try {
    const tabletojson = require("tabletojson").Tabletojson;

    tabletojson.convertUrl(req.body.post, function (tablesAsJson) {
      //res.send(tablesAsJson);

      retVal.Data = tablesAsJson;
      retVal.Message = "data";
      res.send(retVal);
    });
  } catch (e) {
    retVal.Data = e;
    retVal.Message = "exception";
    res.send(retVal);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
