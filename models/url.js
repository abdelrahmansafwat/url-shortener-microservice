require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

var urlSchema = new Schema({
    original_url: String,
    short_url: String,
  });

  var urlModel = mongoose.model("urlModel", urlSchema);

module.exports = urlModel;