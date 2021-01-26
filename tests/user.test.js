// supertest is HTTP assertions
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Sould signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Artur",
      email: "ohotnikarturik@gmail.com",
      password: "signupTest123",
    })
    .expect(201);

  // Assert that database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about response
  expect(response.body).toMatchObject({
    user: {
      name: "Artur",
      email: "ohotnikarturik@gmail.com",
    },
    token: user.tokens[0].token,
  });

  // Assert that plain password is not stor in db
  expect(user.password).not.toBe("signupTest123");
});

test("Should not signup user with invalid name", async () => {
  await request(app)
    .post("/users")
    .send({ email: "test@gmail.com", password: "testTest" })
    .expect(400);
});

test("Should not signup user with invalid email", async () => {
  await request(app)
    .post("/users")
    .send({ name: "MockName", email: "notvalidemail", password: "testTest" })
    .expect(400);
});

test("Should not signup user with invalid password", async () => {
  await request(app)
    .post("/users")
    .send({ name: "MockName", email: "test@gmail.com", password: "bad" })
    .expect(400);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // Assert that new token matches second users token
  const user = await User.findById({ _id: response.body.user._id });
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login not existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "notexistinguser@example.com",
      password: "somePassword",
    })
    .expect(400);
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "New user nane", age: 100 })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("New user nane");
});

test("Should not update user if unauthenticated", async () => {
  await request(app).patch("/users/me").send({ name: "TestName" }).expect(401);
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Espoo" })
    .expect(400);
});

test("Should not update user with invalid name", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "" })
    .expect(400);
});

test("Should not update user with invalid email", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ email: "notValidEmail" })
    .expect(400);
});

test("Should not update user with invalid password", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ password: "password" })
    .expect(400);
});

test("Should get perofile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get perofile for user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assert that after deleting user not exist in db
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete user if unauthenticated", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send(userOne).expect(401);
});

test("Should upload user profile", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

