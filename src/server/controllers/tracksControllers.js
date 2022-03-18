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

const getFileFromLocalServer = (file) => {
  const oldFileName = path.join("uploads", file.filename);
  const newFileName = path.join("uploads", file.originalname);
  fs.renameSync(oldFileName, newFileName);
  const fileData = fs.readFileSync(newFileName);

  return { name: file.originalname, data: fileData };
};

const getFirebaseDownloadUrls = (files) =>
  Promise.all(
    files.map(async (file) => {
      const storageRef = ref(storage, `${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file.data);
      const firebaseFileURL = await getDownloadURL(storageRef);
      return firebaseFileURL;
    })
  );

const createTrack = async (req, res, next) => {
  try {
    const { name, refuge, difficulty, kids, seasons, description, user } =
      req.body;
    const trackNameExists = await Track.findOne({ name });
    if (trackNameExists) {
      const error = new Error(
        `Track name ${name} already exists! Choose another name!`
      );
      error.code = 400;
      next(error);
      return;
    }

    const imageFile = getFileFromLocalServer(req.files.image[0]);
    const gpxFile = getFileFromLocalServer(req.files.gpx[0]);
    const firebaseUrls = await getFirebaseDownloadUrls([imageFile, gpxFile]);

    const newTrack = await Track.create({
      name,
      refuge,
      difficulty,
      kids,
      seasons,
      description,
      user,
      image: firebaseUrls[0],
      gpx: firebaseUrls[1],
    });

    res.status(201);
    res.json({
      message: `New track: ${newTrack.name}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTracks,
  deleteTrack,
  createTrack,
};
