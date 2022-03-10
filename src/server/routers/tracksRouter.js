const express = require("express");
const { getAllTracks } = require("../controllers/tracksControllers");

const router = express.Router();

router.get("/", getAllTracks);

module.exports = router;
