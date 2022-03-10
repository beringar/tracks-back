const Track = require("../../db/models/Track");

const getAllTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.json({ tracks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTracks,
};
