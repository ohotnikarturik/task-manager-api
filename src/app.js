const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

// parsing incoming json objects
app.use(express.json());
// register routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app
