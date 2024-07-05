const express = require("express");
const dbHandler = require("./dbHandler")
var cors = require('cors')
const bodyParser = require('body-parser')

const PORT = 8888;

const app = express();
app.use(cors());
app.use(bodyParser.json())

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/sendQuery", (req, res) => {dbHandler.sendQuery(req, res)})

app.post("/getInfo", (req, res) => {dbHandler.getInfo(req, res)})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});