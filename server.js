const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());

// ✅ Static folder set karo (index.html, css, js, images ko "public" me rakho)
app.use(express.static(__dirname));

// ------------------- Temporary DB (In-memory) -------------------
let users = [];

// ------------------- API ROUTES -------------------

// Home route
app.get("/api", (req, res) => {
  res.send("🚀 Van Login API is running! Use /api/login, /api/users");
});

// Save new user (POST)
app.post("/api/login", (req, res) => {
  const { name, fatherName, mobile } = req.body;

  if (!name || !fatherName || !mobile) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Check duplicate mobile
  const exists = users.find((u) => u.mobile === mobile);
  if (exists) {
    return res
      .status(409)
      .json({ success: false, message: "User with this mobile already exists" });
  }

  const user = { id: users.length + 1, name, fatherName, mobile };
  users.push(user);

  console.log("✅ New User Saved:", user);

  res.json({ success: true, message: "User saved successfully", user });
});

// Fetch all users
app.get("/api/users", (req, res) => {
  res.json({ success: true, users });
});

// Fetch single user by ID
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, user });
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, fatherName, mobile } = req.body;

  let user = users.find((u) => u.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.name = name || user.name;
  user.fatherName = fatherName || user.fatherName;
  user.mobile = mobile || user.mobile;

  res.json({ success: true, message: "User updated", user });
});

// Delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const deletedUser = users.splice(index, 1);
  res.json({ success: true, message: "User deleted", deletedUser });
});

// ------------------- FALLBACK -------------------
// Agar koi route match na ho to frontend ka index.html return karega
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------- Start Server -------------------
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
