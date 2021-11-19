const { Schema, model } = require("mongoose");

const schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true, maxlength: 250 },
});

module.exports = model("Comment", schema);
