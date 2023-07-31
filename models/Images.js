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
const Images = mongoose.model("Images", imagesSchema);
module.exports = Images;
