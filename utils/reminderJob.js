const cron = require("node-cron");
const Task = require("../models/task");
const User = require("../models/user");
const sendEmail = require("./sendEmail");

const startReminderJob = () => {
  cron.schedule("0 9 * * *", async () => { 
    console.log("Running reminder check...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
  status: { $ne: "done" }
}).populate("user");

    for (let task of tasks) {
      await sendEmail(
        task.user.email,
        "Task Reminder",
        `Reminder: Your task "${task.title}" is due soon.`
      );
    }
  });
};

module.exports = startReminderJob;