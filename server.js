// 1️⃣ Imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const jwt = require("jsonwebtoken");
const taskRoutes = require("./routes/task");
// 2️⃣ Create app
const app = express();

// 3️⃣ Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 4️⃣ MongoDB Connection (STEP 6 GOES HERE)
mongoose.connect("mongodb+srv://internshipUser:sWTWCyVDf2EhWP3q@cluster0.cagkbwz.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 5️⃣ Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// 6️⃣ SIGNUP ROUTE (STEP 7 GOES HERE)
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(400).json({ message: "Error registering user" });
  }
});


// 7️⃣ LOGIN ROUTE (STEP 8 GOES HERE)
app.post("/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


// 8️⃣ Start Server (ALWAYS LAST)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const startReminderJob = require("./utils/reminderJob");
startReminderJob();