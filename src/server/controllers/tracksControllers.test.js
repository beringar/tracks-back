require("dotenv").config();
const fs = require("fs");
const Track = require("../../db/models/Track");
const {
  getAllTracks,
  deleteTrack,
  getTrack,
  createTrack,
} = require("./tracksControllers");

jest.spyOn(Track, "find").mockReturnThis();
jest.spyOn(Track, "findById").mockReturnThis();
const mockTrackPopulate = jest.spyOn(Track, "populate");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
}));
jest.mock("path", () => ({
  ...jest.requireActual("path"),
}));

jest.mock("firebase/storage", () => ({
  getStorage: () => "testingmock",
  ref: () => {},
  getDownloadURL: async () => "firebasedownloadurl",
  uploadBytes: async () => {},
}));

describe("Given a getAllTracks controller", () => {
  describe("When it receives a valid response", () => {
    test("Then it should call res json method with an array of tracks", async () => {
      const expectedTracks = [
        {
          name: "Tuc de Sendrós per llac de Saboredo",
          refuge: "Saboredo",
          difficulty: "normal",
          kids: true,
          seasons: ["spring", "summer"],
          description:
            "Description of track, this route is very appealing because...",
          image: "https://mapio.net/images-p/7224428.jpg",
          gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
          user: "6228d9e2d3b484d4871608ee",
          id: "6229bdbccf53a1fa6ac36821",
        },
        {
          name: "Punta Alta de Comalesbienes des de Cavallers",
          refuge: "Ventosa i Calvell",
          difficulty: "high",
          kids: false,
          seasons: ["spring", "summer"],
          description:
            "Description of track, this route is very appealing because...",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/e/ea/P1280563x_-_Pic_de_Comalesbienes.JPG",
          gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
          user: "6228d9e2d3b484d4871608ee",
          id: "6229c2a2cf53a1fa6ac36823",
        },
      ];

      mockTrackPopulate.mockImplementation(() =>
        Promise.resolve(expectedTracks)
      );

      const res = {
        json: jest.fn(),
      };

      await getAllTracks(null, res, null);

      expect(res.json).toHaveBeenCalledWith({ tracks: expectedTracks });
    });
  });

  describe("When it receives a next function and DB throws an error", () => {
    test("Then it should call next with error", async () => {
      const error = {
        code: 500,
        message: "Internal Server Error!",
      };
      mockTrackPopulate.mockImplementation(() => Promise.reject(error));
      const next = jest.fn();

      await getAllTracks(null, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a deleteTrack controller", () => {
  describe("When it receives a id of an existing track", () => {
    test("Then it should call res json method with id fo removed track", async () => {
      const trackToDelete = {
        name: "Tuc de Sendrós per llac de Saboredo",
        refuge: "Saboredo",
        difficulty: "normal",
        kids: true,
        seasons: ["spring", "summer"],
        description:
          "Description of track, this route is very appealing because...",
        image: "https://mapio.net/images-p/7224428.jpg",
        gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
        user: "6228d9e2d3b484d4871608ee",
        id: "6229bdbccf53a1fa6ac36821",
      };
      const expectedResponse = { id: trackToDelete.id };

      const req = { params: { id: trackToDelete.id } };

      const res = {
        json: jest.fn(),
      };
      Track.findByIdAndDelete = jest.fn().mockResolvedValue(trackToDelete);

      await deleteTrack(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives a id of an non existing track", () => {
    test("Then it should call next with error 'ID not found' and code 404", async () => {
      const trackToDelete = {
        name: "Tuc de Sendrós per llac de Saboredo",
        refuge: "Saboredo",
        difficulty: "normal",
        kids: true,
        seasons: ["spring", "summer"],
        description:
          "Description of track, this route is very appealing because...",
        image: "https://mapio.net/images-p/7224428.jpg",
        gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
        user: "6228d9e2d3b484d4871608ee",
        id: "999",
      };

      const req = { params: { id: trackToDelete.id } };
      const next = jest.fn();
      const error = new Error("ID not found");
      error.code = 404;

      Track.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteTrack(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives an error from DB", () => {
    test("Then it should call next with error 'ID not found' and code 404", async () => {
      const trackToDelete = {
        name: "Tuc de Sendrós per llac de Saboredo",
        refuge: "Saboredo",
        difficulty: "normal",
        kids: true,
        seasons: ["spring", "summer"],
        description:
          "Description of track, this route is very appealing because...",
        image: "https://mapio.net/images-p/7224428.jpg",
        gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
        user: "6228d9e2d3b484d4871608ee",
        id: "999",
      };

      const req = { params: { id: trackToDelete.id } };
      const next = jest.fn();
      const error = new Error("ID not found");
      error.code = 404;

      Track.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await deleteTrack(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given getTrack controller", () => {
  describe("When it receives a request with an id", () => {
    test("Then it should call the response json method with the track with that id", async () => {
      const req = {
        params: { id: "id" },
      };
      const res = {
        json: jest.fn(),
      };
      const track = {
        id: "id",
      };
      mockTrackPopulate.mockImplementation(() => Promise.resolve(track));

      await getTrack(req, res, null);

      expect(res.json).toHaveBeenCalledWith(track);
    });
  });
  describe("When it receives a request with an id that doesn't exist", () => {
    test("Then it should call it's next method with an error", async () => {
      const req = {
        params: { id: "wrongID" },
      };

      const next = jest.fn();
      const error = new Error("There is no Track with the requested ID!");

      Track.findById = jest.fn().mockResolvedValue(null);
      await getTrack(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createTrack controller", () => {
  describe("When it receives a request with the data of a track", () => {
    test("Then it should call its res json method with the track created", async () => {
      const newtrack = {
        name: "testing timeago functionality right now",
        refuge: "Colomina",
        difficulty: "low",
        kids: true,
        seasons: ["autumn"],
        description:
          "Roads have long been built through passes, as well as railways more recently. Some high and rugged passes may have tunnels bored underneath a nearby mountainside (like the Eisenhower Tunnel bypassing Loveland Pass in the Rockies) to allow faster traffic flow throughout the year.",
        user: "6228d9e2d3b484d4871608ee",
      };

      const newFile = {
        originalname: "track.png",
        filename: "muntanyis.jpg",
        path: "uploads",
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      const req = {
        body: newtrack,
        files: {
          image: [newFile],
          gpx: [newFile],
        },
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldname, newname, callback) => {
          callback();
        });
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      Track.findOne = jest.fn().mockResolvedValue(false);
      Track.findByIdAndUpdate = jest.fn().mockResolvedValue(newtrack);
      Track.create = jest.fn().mockResolvedValue(newtrack);

      await createTrack(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with the data of a track but a name that already exists in DB", () => {
    test("Then it should call its next method with an error and text 'Track name La Playa already exists! Choose another name!'", async () => {
      const newtrack = {
        name: "La Playa",
        refuge: "Colomina",
        difficulty: "low",
        kids: true,
        seasons: ["autumn"],
        description:
          "Roads have long been built through passes, as well as railways more recently. Some high and rugged passes may have tunnels bored underneath a nearby mountainside (like the Eisenhower Tunnel bypassing Loveland Pass in the Rockies) to allow faster traffic flow throughout the year.",
        user: "6228d9e2d3b484d4871608ee",
      };

      const expectedError = new Error(
        `Track name ${newtrack.name} already exists! Choose another name!`
      );
      expectedError.code = 400;

      const newFile = {
        originalname: "track.png",
        filename: "muntanyis.jpg",
        path: "uploads",
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      const req = {
        body: newtrack,
        files: {
          image: [newFile],
          gpx: [newFile],
        },
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldname, newname, callback) => {
          callback();
        });
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      Track.findOne = jest.fn().mockResolvedValue(true);
      Track.findByIdAndUpdate = jest.fn().mockResolvedValue(newtrack);
      Track.create = jest.fn().mockResolvedValue(newtrack);

      await createTrack(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with the data of a track but read file in server throws an error", () => {
    test("Then it should call next method with server error", async () => {
      const newtrack = {
        name: "La Playa",
        refuge: "Colomina",
        difficulty: "low",
        kids: true,
        seasons: ["autumn"],
        description:
          "Roads have long been built through passes, as well as railways more recently. Some high and rugged passes may have tunnels bored underneath a nearby mountainside (like the Eisenhower Tunnel bypassing Loveland Pass in the Rockies) to allow faster traffic flow throughout the year.",
        user: "6228d9e2d3b484d4871608ee",
      };

      const expectedError = new Error(
        `Track name ${newtrack.name} already exists! Choose another name!`
      );
      expectedError.code = 400;

      const newFile = {
        originalname: "track.png",
        filename: "muntanyis.jpg",
        path: "uploads",
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const next = jest.fn();

      const req = {
        body: newtrack,
        files: {
          image: [newFile],
          gpx: [newFile],
        },
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldname, newname, callback) => {
          callback();
        });
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });
      jest.spyOn(fs, "unlink").mockImplementation(() => {
        throw new Error();
      });

      Track.findOne = jest.fn().mockResolvedValue(true);
      Track.findByIdAndUpdate = jest.fn().mockResolvedValue(newtrack);
      Track.create = jest.fn().mockResolvedValue(newtrack);

      await createTrack(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
