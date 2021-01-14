const express = require("express");
const Task = require("../models/task");
// create router
const router = express.Router();

// create task
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// find all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    if (!tasks.length) return res.status(404).send();

    res.send(tasks);
  } catch (error) {
    res.ststus(500).send();
  }
});

// find task by id
router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// updaute task
router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  // return boolean true/false, if one or all value exsit(example: if in 10 values not exsist even one value -> false)
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete task
router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);

    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
