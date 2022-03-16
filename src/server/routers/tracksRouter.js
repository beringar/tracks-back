const express = require("express");
const multer = require("multer");
const {
  getAllTracks,
  deleteTrack,
  createTrack,
} = require("../controllers/tracksControllers");

const router = express.Router();
const upload = multer({ dest: "uploads" });

router.get("/", getAllTracks);
router.delete("/:id", deleteTrack);
router.post(
  "/new",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gpx", maxCount: 1 },
  ]),
  createTrack
);

module.exports = router;
