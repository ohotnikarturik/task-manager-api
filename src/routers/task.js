const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
// create router
const router = express.Router();

// create user task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET find all user's tasks or filter /tasks?completed=true or /tasks?completed=false
// GET set options for pagination limit and skip /tasks?limit=number&skip=number 
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
    console.log("match.completed", match.completed);
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip)
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

// find user task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    res.send(task);
    if (!task) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// updaute task
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  // return boolean true/false, if one or all value exsit(example: if in 10 values not exsist even one value -> false)
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
