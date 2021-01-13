const express = require("express");
const User = require("../models/user");
// create router
const router = new express.Router();

// create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (rrror) {
    res.status(400).send();
  }
});

// find all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    if (!users.length) return res.status(404).send();

    res.send(users);
  } catch (error) {
    res.ststus(500).send();
  }
});

// find user by id
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// update user by id
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete user
router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
