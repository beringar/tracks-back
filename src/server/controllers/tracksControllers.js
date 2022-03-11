const Track = require("../../db/models/Track");

const getAllTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.json({ tracks });
  } catch (error) {
    next(error);
  }
};

const deleteTrack = async (res, req, next) => {
  const { id } = req.params;
  try {
    const deletedTrack = await Track.findByIdAndDelete(id);
    if (deletedTrack) {
      res.json(deletedTrack.id);
      return;
    }
    const error = new Error("ID not found");
    error.code = 404;
    next(error);
  } catch (error) {
    error.message = "Bad request triying to delete track";
    error.code = 400;
    next(error);
  }
};

module.exports = {
  getAllTracks,
  deleteTrack,
};
