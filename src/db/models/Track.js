const { model, Schema } = require("mongoose");
const trackDifficultyEnum = require("./types/trackDifficultyEnum");

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  refuge: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: Object.values(trackDifficultyEnum),
    required: true,
  },
  kids: { type: Boolean, required: true },
  seasons: [{ type: String, required: true }],
  description: { type: String, required: true },
  image: {
    type: String,
    required: true,
  },
  gpx: {
    type: String,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Track = model("Track", TrackSchema, "tracks");

module.exports = Track;
