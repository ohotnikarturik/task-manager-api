const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
// for deployment to heroku or development
const port = process.env.PORT || 3000;

// parsing incoming json objects
app.use(express.json());
// register routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on server: ${port}`);
});

