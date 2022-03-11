const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToMongoDB = require("../../db");
const Track = require("../../db/models/Track");
const app = require("../index");

let DB;

beforeAll(async () => {
  DB = await MongoMemoryServer.create();
  const uri = DB.getUri();
  await connectToMongoDB(uri);
  Track.deleteMany({});
});
afterAll(async () => {
  await mongoose.connection.close();
  await DB.stop();
});

beforeEach(async () => {
  Track.create({
    name: "test 1 Tuc de Sendrós per llac de Saboredo",
    refuge: "Saboredo",
    difficulty: "normal",
    kids: true,
    seasons: ["spring", "summer"],
    description:
      "Description of track, this route is very appealing because...",
    image: "https://mapio.net/images-p/7224428.jpg",
    gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
    user: "6228d9e2d3b484d4871608ee",
  });
  Track.create({
    name: "test 2",
    refuge: "Saboredo",
    difficulty: "normal",
    kids: true,
    seasons: ["spring", "summer"],
    description:
      "Description of track, this route is very appealing because...",
    image: "https://mapio.net/images-p/7224428.jpg",
    gpx: "http://www.apatita.com/gps/aiguestortes_2_amitges_saboredo_colomers.zip",
    user: "6228d9e2d3b484d4871608ee",
  });
});

describe("Given a /tracks endpoint", () => {
  describe("When it receives a GET request", () => {
    test("Then it should respond with 200 status code and an array of Tracks", async () => {
      const expectedLength = 2;

      const { body } = await request(app).get("/tracks").expect(200);

      expect(body.tracks).toHaveLength(expectedLength);
    });
  });
});

describe("Given a DELETE /tracks/999 endpoint", () => {
  describe("When it receives a DELETE request", () => {
    test("Then it should respond with 200 status code and id: 2", async () => {
      const {
        body: { tracks },
      } = await request(app).get("/tracks");
      const { id } = tracks[0];

      const { body } = await request(app).delete(`/tracks/${id}`).expect(200);

      expect(body).toHaveProperty("id", id);
    });
  });
});
