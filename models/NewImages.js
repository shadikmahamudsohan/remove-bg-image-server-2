const mongoose = require("mongoose");
const imagesSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please provide a valid email"],
    },
    imageWithOutBackground: {
      type: String,
      required: [true, "please provide a image with out bg name"],
    },
    imageWithBackground: {
      type: String,
      required: [true, "please provide a image with bg name"],
    },
  },
  {
    timestamps: true,
  }
);
const NewImages = mongoose.model("NewImages", imagesSchema);
module.exports = NewImages;
