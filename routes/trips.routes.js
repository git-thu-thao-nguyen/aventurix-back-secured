const express = require("express")
const router = express.Router();
const tripController = require("../controllers/trip.controller");
const multipleFilesUploaderMiddleware = require("../middlewares/complexUploader");
const { authenticateMiddleware } = require("../middlewares/authenticationMiddleware")
const { authorizeMiddleware } = require("../middlewares/authorizationMiddleware")


router.get("/", tripController.getAll)
router.get("/bestsellers", tripController.getAllBestsellers);
router.get("/:id", tripController.getOne)

router.post("/", tripController.create)
router.post("/:id", multipleFilesUploaderMiddleware, tripController.addImages)

router.patch("/:id", tripController.patchOne)

router.delete("/", authenticateMiddleware, authorizeMiddleware(["admin"]), tripController.deleteAll)
router.delete("/:id", tripController.deleteOne)

module.exports = router