const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToMongoDB = require("../../db");
const User = require("../../db/models/User");
const app = require("../index");

let DB;

beforeAll(async () => {
  DB = await MongoMemoryServer.create();
  const uri = DB.getUri();
  await connectToMongoDB(uri);
  User.deleteMany({});
});
afterAll(async () => {
  await mongoose.connection.close();
  await DB.stop();
});

beforeEach(async () => {
  User.create({
    username: "Beren",
    password: "$2b$10$9Xleqvk5uvTvqWi059uB7Oh9mmaPojCH668ZbejV5Ekj.Co14Cz3e",
    name: "Berenguer",
  });
});

describe("Given a usersRouter", () => {
  describe("When it receives a POST request at /users/login with valid username and password", () => {
    test("Then it should respond with a token", async () => {
      const user = {
        username: "Beren",
        password: "asasas",
      };

      const { body } = await request(app).post("/users/login").send(user);
      const { token } = body;

      expect(body).toHaveProperty("token");
      expect(token).not.toBeNull();
    });
  });
});
