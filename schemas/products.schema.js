const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    content: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      default: "FOR_SALE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", productsSchema);
