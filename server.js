const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const records = require("./dbSchema.js");
const moment = require("moment");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
var momentTime = moment();
var counter = 0;
app.use("/sources", express.static("sources"));
app.set("view engine", "ejs");

const connection_url =
  "mongodb+srv://admin:bZa9WwIig3q0qivV@cluster0.h8nep.mongodb.net/BoardDB?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function deleteRecords() {
  var intial = moment(momentTime.toDate()).add(counter, "seconds").toDate();
  records.deleteMany({ expires: { $lte: intial } }, (err) => {
    if (err) return console.log("Error " + err);
    else console.log("SetInterval Running");
  });
  counter = counter + 1;
}

setInterval(deleteRecords, 1000);

app.get("/home", (req, res) => {
  res.render("records");
});

app.get("/api/records", (req, res) => {
  records.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(typeof data);
      res.status(200).send(data);
    }
  });
});

app.post("/api/postrecords", (req, res) => {
  var initialdate = new Date();
  const min = req.body.Duration;
  const body = req.body;

  const finalTime = {
    expires: moment(initialdate).add(min, "m").toDate(),
  };

  const record = Object.assign(body, finalTime);
  records.create(record, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`listening from ${port}`);
});
