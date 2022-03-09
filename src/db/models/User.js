const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tracks: [{ type: Schema.Types.ObjectId, ref: "Track", default: [] }],
});

const User = model("User", UserSchema, "users");

module.exports = User;
