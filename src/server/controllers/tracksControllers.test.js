const Track = require("../../db/models/Track");
const { getAllTracks, deleteTrack } = require("./tracksControllers");

describe("Given a getAllTracks controller", () => {
  describe("When it receives a valid response", () => {
    test("Then it should call res json method with an array of tracks", async () => {
      const tracks = [
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

      const res = {
        json: jest.fn(),
      };
      Track.find = jest.fn().mockResolvedValue(tracks);

      await getAllTracks(null, res, null);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a next function and DB throws an error", () => {
    test("Then it should call next with error", async () => {
      const error = {
        code: 500,
        message: "Internal Server Error!",
      };
      const next = jest.fn();
      Track.find = jest.fn().mockRejectedValue(error);

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
