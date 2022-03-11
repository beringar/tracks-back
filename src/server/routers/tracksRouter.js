const express = require("express");
const {
  getAllTracks,
  deleteTrack,
} = require("../controllers/tracksControllers");

const router = express.Router();

router.get("/", getAllTracks);
router.delete("/:id", deleteTrack);

module.exports = router;
