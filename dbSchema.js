const mongoose = require("mongoose");
const moment = require("moment");
var mo = moment();
const schema = mongoose.Schema({
  TaskName: String,
  TaskDescription: String,
  Creator: String,
  Duration: Number,
  createdAt: { type: Date, default: mo.toDate() },
  expires: { type: Date },
});

var taskcontainer = mongoose.model("taskcontainer", schema);
module.exports = taskcontainer;
