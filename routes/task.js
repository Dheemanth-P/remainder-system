const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Create Task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id   // link task to logged-in user
    });

    await newTask.save();

    res.status(201).json(newTask);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get All Tasks (Only Logged-in User's Tasks)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// 🔹 Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;