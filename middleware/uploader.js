const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");
const Images = require("../models/Images");

exports.uploadImage = async (req, res, next) => {
  console.log("in image uploader middleware");

  const email = req.user.email;
  const { userPosition } = await User.findOne({ email });
  const imageCount = await Images.countDocuments({
    email: email,
  });
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "images/"); // The directory where uploaded images will be stored
      },
      filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const imageNewName = userPosition + "_" + imageCount + fileExtension;

        const fileName = imageNewName;
        cb(null, fileName); // The generated file name will be <user_email>.<file_extension>
      },
    });

    const uploader = multer({
      storage,
    }).single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.json({
          status: "fail",
          type: "multer error",
          error: err,
        });
      } else if (err) {
        res.json({
          status: "fail",
          type: "unknown error",
          error: err,
        });
        // An unknown error occurred when uploading.
      }
      console.log("image uploaded");
      next();
    });
  } catch (error) {
    res.json({
      status: "fail",
      error: "multer have some error",
    });
  }
};
