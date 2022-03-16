const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
} = require("firebase/storage");
const Track = require("../../db/models/Track");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "tracks-beringar.firebaseapp.com",
  projectId: "tracks-beringar",
  storageBucket: "tracks-beringar.appspot.com",
  messagingSenderId: "83546444826",
  appId: "1:83546444826:web:ac6f75371c1bbf9682eda3",
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const getAllTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.json({ tracks });
  } catch (error) {
    next(error);
  }
};

const deleteTrack = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedTrack = await Track.findByIdAndDelete(id);
    if (deletedTrack) {
      res.json({ id: deletedTrack.id });
      return;
    }
    const error = new Error("ID not found");
    error.code = 404;
    next(error);
  } catch (error) {
    error.message = "Bad request trying to delete track";
    error.code = 400;
    next(error);
  }
};

const createTrack = async (req, res, next) => {
  const { name, refuge, difficulty, kids, seasons, description, user } =
    req.body;
  try {
    const trackNameExists = await Track.findOne({ name });
    if (trackNameExists) {
      const error = new Error(
        `Track name ${name} already exists! Choose another name!`
      );
      error.code = 400;
      next(error);
      return;
    }
    const oldFileName = path.join("uploads", req.file.filename);
    const newFileName = path.join("uploads", req.file.originalname);
    fs.rename(oldFileName, newFileName, (error) => {
      if (error) {
        next(error);
      }
    });
    fs.readFile(newFileName, async (error, file) => {
      if (error) {
        next(error);
        return;
      }
      const storageRef = ref(storage, `${Date.now()}_${req.file.originalname}`);
      await uploadBytes(storageRef, file);
      const firebaseFileURL = await getDownloadURL(storageRef);
      const newTrack = await Track.create({
        name,
        refuge,
        difficulty,
        kids,
        seasons,
        description,
        user,
        image: firebaseFileURL,
        gpx: "testing gpx url",
      });

      res.status(201);
      res.json({
        message: `New track: ${newTrack.name}`,
      });
    });
  } catch (error) {
    fs.unlink(path.join("uploads", req.file.filename), () => {
      error.code = 400;
      next(error);
    });
  }
};

module.exports = {
  getAllTracks,
  deleteTrack,
  createTrack,
};
