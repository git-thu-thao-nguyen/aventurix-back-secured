const express = require("express");
const router = express.Router();
const adviserController = require("../controllers/adviser.controller");
const singleFileUploaderMiddleware = require("../middlewares/simpleUploader");

router.get("/", adviserController.getAll)
router.get("/:id", adviserController.getOne)

router.post("/", adviserController.create)
router.post("/:id", singleFileUploaderMiddleware, adviserController.addImage)

module.exports = router