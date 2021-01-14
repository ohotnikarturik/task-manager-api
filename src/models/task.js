const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// set the middleware if need to do something in future with task properties
// taskSchema.pre("save", async function (next) {
//   const task = this;
//   next()
// });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
