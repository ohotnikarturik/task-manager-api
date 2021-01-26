const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");

const { userOne, userTwo, taskOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should to create a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "New mock task", completed: false })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should not create task with invalid description", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ completed: false })
    .expect(400);
});

test("Should not create task with invalid copleted", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "Test task", completed: "string" })
    .expect(400);
});

test("Should fetch all user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("Should not delete other users tasks", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should not update task with invalid description", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "" })
    .expect(400);
});

test("Should not update task with invalid completed", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ completed: "string" })
    .expect(400);
});

test("Should delete user task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete task if unauthenticated", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
});

test("Should not updateother users task", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({ description: "" })
    .expect(404);
});

test("Should fetch user task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const task = await Task.findById(response.body._id);
  expect(task.description).toEqual("First task");
});

test("Should not fetch user task by id if unauthenticated", async () => {
  await request(app).get(`/tasks/${taskOne._id}`).send().expect(401);
});

test("Should not fetch other users task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should fetch only completed tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
  expect(response.body[0].description).toEqual("Second task");
});

test("Should fetch only completed tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=false")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
  expect(response.body[0].description).toEqual("First task");
});

test("Should sort tasks by completed", async () => {
  const response = await request(app)
    .get("/tasks?sortBy=completed:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].description).toEqual("Second task");
});

test("Should sort tasks by description", async () => {
  const response = await request(app)
    .get("/tasks?sortBy=description:desc")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
});

test("Should sort tasks by createdAt", async () => {
  const response = await request(app)
    .get("/tasks?sortBy=createdAt:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].description).toEqual("Second task");
});

test("Should sort tasks by updatedAt", async () => {
  const response = await request(app)
    .get("/tasks?sortBy=updatedAt:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].description).toEqual("Second task");
});

test("Should fetch page of tasks", async () => {
  const response = await request(app)
    .get("/tasks?limit=1&skip=1")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
  expect(response.body[0].description).toEqual("Second task");
});

