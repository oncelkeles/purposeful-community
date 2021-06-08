const mongoose = require("mongoose");
const { Schema } = mongoose;
exports.optionSchema = new Schema({
  optionLabel: String,
  isSelected: Boolean,
  optionNumber: Number,
});
exports.stringType = new Schema({
  name: "string",
  type: String,
});
exports.numberType = new Schema({
  name: "number",
  type: Number,
});
exports.linkType = new Schema({
  name: "link",
  type: String,
});
exports.checkboxType = new Schema({
  name: "checkbox",
  type: Boolean,
  label: String,
});
exports.radioType = new Schema({
  name: "radio",
  type: String,
  options: [optionSchema],
});
exports.imageUriType = new Schema({
  name: "imageUri",
  type: String,
});
exports.dateType = new Schema({
  name: "date",
  type: Date,
});
exports.type = new Schema({
  type: Object,
});
