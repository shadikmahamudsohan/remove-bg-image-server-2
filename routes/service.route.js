const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const servicesControllers = require("../controller/service.controller");
const uploader = require("../middleware/uploader");

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  uploader.uploadImage,
  servicesControllers.fileUpload
);
router.post("/remove-bg", verifyToken, servicesControllers.removeBg);

module.exports = router;
