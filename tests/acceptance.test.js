const UserServer = require("../api/server");
const request = require("supertest");
const usersModel = require("../api/users/users.model");
const path = require("path");
const should = require("should");
const {
  generateAvatar,
  deleteAvatarFile,
} = require("../api/helpers/avatarGenerator/avatarGenerator");

describe("Acceptance tests", () => {
  let server;
  before(async () => {
    const userServer = new UserServer();
    server = await userServer.start();
  });
  after(() => {
    server.close();
  });

  describe("PATCH /users/avatars", () => {
    it("should return 401 => token not found", async () => {
      await request(server)
        .patch("/users/avatars")
        .set("Content-Type", "multipart/form-data")
        .send()
        .expect(401);
    });

    it("should return 401 => invalid token", async () => {
      await request(server)
        .patch("/users/avatars")
        .set("Content-Type", "multipart/form-data")
        .set("Authorization", "Bearer invalidToken")
        .send()
        .expect(401);
    });
    context("when authorization succeeded", () => {
      const email = "test@test.com";
      const password = "password";
      const gender = "male";
      let token;
      let prevAvatarURL;
      before(async () => {
        const registerResponse = await request(server)
          .post("/auth/register")
          .set("Content-Type", "application/json")
          .send({
            email: email,
            password: password,
            gender: gender,
          });
        prevAvatarURL = registerResponse.body.avatarURL;

        const loginResponse = await request(server)
          .post("/auth/login")
          .set("Content-Type", "application/json")
          .send({
            email: email,
            password: password,
          });
        token = loginResponse.body.token;
      });
      after(async () => {
        const user = await usersModel.findUserByEmail(email);
        await deleteAvatarFile(user.avatarURL);
        await usersModel.findByIdAndDelete(user._id);
      });
      it("should return 400 => missing fields", async () => {
        await request(server)
          .patch("/users/avatars")
          .set("Authorization", "Bearer " + token)
          .send()
          .expect(400);
      });
      it("should return 200 OK", async () => {
        const link = await generateAvatar({ body: { email, gender } });
        const { body } = await request(server)
          .patch("/users/avatars")
          .set("Content-Type", "multipart/form-data")
          .set("Authorization", "Bearer " + token)
          .attach("avatar", path.join(__dirname, "../public", link))
          .send()
          .expect(200);
        deleteAvatarFile(link);

        body.should.have.property("_id");
        body.should.have.property("subscription");
        body.should.have.property("email");
        body.should.have.property("avatarURL");
        should.notEqual(prevAvatarURL, link);
      });
    });
  });
});
