const fs = require("fs");
const Images = require("../models/Images");
const User = require("../models/userModel");
const NewImages = require("../models/NewImages");
const https = require("https");
const request = require("request");
const path = require("path");

exports.fileUpload = async (req, res) => {
  try {
    if (req.file) {
      console.log(req.file);
      res.json({ status: "success" });
    }
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: "can't upload the image",
    });
  }
};
exports.removeBg = async (req, res) => {
  try {
    const { email } = req.user;
    const { imageName } = req.body;
    const { userPosition } = await User.findOne({ email });
    const imageCount = await NewImages.countDocuments({
      email: email,
    });
    const fileExtension = imageName.substr(imageName.lastIndexOf("."));

    const imageNewName = userPosition + "_" + imageCount + fileExtension;
    const removedImageName =
      userPosition + "_" + imageCount + "_" + "removed" + fileExtension;
    console.log("inside api upload");
    const imagePath = path.join(process.cwd(), "images", imageNewName);

    try {
      request(
        {
          method: "POST",
          url: "https://techhk.aoscdn.com/api/tasks/visual/segmentation",
          headers: {
            "X-API-KEY": process.env.API_TOKEN,
          },
          formData: {
            sync: "1",
            image_file: fs.createReadStream(imagePath),
          },
        },
        async function (error, response, body) {
          // console.log(response);
          if (error) {
            console.error(error);
            res.status(500).send("An error occurred");
          } else {
            console.log("data received from api");
            const apiData = JSON.parse(response.body);
            console.log(apiData); // consoling the image data from api
            try {
              const { image } = apiData.data;
              if (image) {
                const imagePath = path.join(
                  process.cwd(),
                  "images",
                  removedImageName
                );
                const file = fs.createWriteStream(imagePath);
                https
                  .get(image, (response) => {
                    response.pipe(file);

                    file.on("finish", async () => {
                      file.close();
                      console.log(`Image downloaded as ${removedImageName}`);
                      const data = await Images.create({
                        email,
                        imageWithOutBackground: `/${removedImageName}`,
                        imageWithBackground: `/${imageNewName}`,
                      });
                      console.log("data posted in mongodb");

                      if (data) {
                        res.status(200).json({
                          success: true,
                          result: data,
                        });
                      } else {
                        res.status(400).json({
                          success: false,
                          error: "can't upload the image in mongodb",
                        });
                      }
                    });
                  })
                  .on("error", (err) => {
                    fs.unlink(imageNewName);
                    console.error(`Error downloading image: ${err.message}`);
                    res.status(400).json({
                      success: false,
                      error: "can not download your image",
                    });
                  });
              } else {
                res.status(400).json({
                  success: false,
                  error: "image is not found",
                });
              }
            } catch (error) {
              console.log(error);
              res
                .status(400)
                .send({ error: error.message, msg: "Something went wrong" });
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: "can't upload the image",
    });
  }
};
