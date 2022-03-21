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
    const tracks = await Track.find().populate("user", "username");
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
      throw error;
    }
    const newTrack = await Track.create({
      name,
      refuge,
      difficulty,
      kids,
      seasons,
      description,
      user,
    });

    const oldFileNameImage = path.join("uploads", req.files.image[0].filename);
    const newFileNameImage = path.join(
      "uploads",
      `${Date.now()}_${req.files.image[0].originalname}`
    );

    fs.rename(oldFileNameImage, newFileNameImage, () => {
      fs.readFile(newFileNameImage, async (error, file) => {
        const storageRef = ref(
          storage,
          `${Date.now()}_${req.files.image[0].originalname}`
        );
        await uploadBytes(storageRef, file);
        const imageFirebaseFileURL = await getDownloadURL(storageRef);
        await Track.findByIdAndUpdate(newTrack.id, {
          image: imageFirebaseFileURL,
        });
      });
    });

    const oldFileNameGpx = path.join("uploads", req.files.gpx[0].filename);
    const newFileNameGpx = path.join(
      "uploads",
      `${Date.now()}_${req.files.gpx[0].originalname}`
    );

    fs.rename(oldFileNameGpx, newFileNameGpx, () => {
      fs.readFile(newFileNameGpx, async (error, file) => {
        const storageRef = ref(
          storage,
          `${Date.now()}_${req.files.gpx[0].originalname}`
        );
        await uploadBytes(storageRef, file);
        const gpxFirebaseFileURL = await getDownloadURL(storageRef);
        await Track.findByIdAndUpdate(newTrack.id, {
          gpx: gpxFirebaseFileURL,
        });
      });
    });
    res.status(201);
    res.json({
      message: `New track: ${newTrack.name}`,
    });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const getTrack = async (req, res, next) => {
  const { id } = req.params;
  try {
    const track = await Track.findById(id).populate("user", "username");
    res.json(track);
  } catch {
    const error = new Error("There is no Track with the requested ID!");
    error.code = 404;
    next(error);
  }
};

module.exports = {
  getAllTracks,
  deleteTrack,
  createTrack,
  getTrack,
};
