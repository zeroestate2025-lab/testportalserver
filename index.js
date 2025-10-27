require("dotenv").config();
const express = require("express");
const connectDB = require("./models/database");
const testControlRoutes = require("./routes/testControl");

// Routes
const adminRoutes = require("./routes/adminAuth");
const userRoutes = require("./routes/userAuth");
const questionRoutes = require("./routes/questions");

const app = express();
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/testcontrol", testControlRoutes);


// Connect to MongoDB
connectDB();

// Main routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);

// Root route
app.get("/", (req, res) => res.send("Interview Test Portal API is running..."));
const testRoutes = require("./routes/tests");

app.use("/api/waiting-users", require("./routes/waitingUsers"));

app.use("/api/tests", testRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

