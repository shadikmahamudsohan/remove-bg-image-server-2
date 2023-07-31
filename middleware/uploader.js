// const multer = require("multer");
// const path = require("path");
// const { imageId } = require("../Utils/randomNumber");
// var fs = require('fs');
// const randomId = require('random-id');

// exports.uploadImage = (req, res, next) => {
//     try {
//         const storage = multer.diskStorage({
//             destination: "images/",
//             filename: (req, file, cb) => {
//                 const len = 30;
//                 const pattern = 'aA0';
//                 const id = randomId(len, pattern);
//                 fs.writeFile('randomImageId.txt', id, function (err) {
//                     if (err) throw err;
//                 });
//                 cb(null, req?.user?.email + "-" + id + "-" + file.originalname);
//             },
//         });
//         const uploader = multer({
//             storage,
//             fileFilter: (req, file, cb) => {
//                 const supportedImage = /png|jpg|jpeg/;
//                 const extension = path.extname(file.originalname);
//                 if (supportedImage.test(extension)) {
//                     cb(null, true);
//                 } else {
//                     cb(new Error("Must be a png image"));
//                 }
//             }
//         }).single("testImage")(req, res, function (err) {
//             if (err instanceof multer.MulterError) {
//                 // A Multer error occurred when uploading.
//                 res.json({
//                     status: "fail",
//                     type: "multer error",
//                     error: err
//                 });
//             } else if (err) {
//                 res.json({
//                     status: "fail",
//                     type: "unknown error",
//                     error: err
//                 });
//                 // An unknown error occurred when uploading.
//             }
//             next();
//         });
//     } catch (error) {
//         res.json({
//             status: "fail",
//             error: "multer have some error"
//         });
//     }
// };

const multer = require("multer");
const path = require("path");
var fs = require("fs");
const User = require("../models/userModel");
const NewImages = require("../models/NewImages");

exports.uploadImage = async (req, res, next) => {
  const email = req.user.email;
  const { userPosition } = await User.findOne({ email });
  const imageCount = await NewImages.countDocuments({
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
