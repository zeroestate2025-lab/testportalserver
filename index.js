require("dotenv").config();
const express = require("express");
const connectDB = require("./models/database");
const cors = require("cors");

const app = express();

// ✅ Allowed origins for both local and production
const allowedOrigins = [
  "http://localhost:3000", // local React
  "https://testportal-client-usr-l62d.onrender.com", // deployed React on Render
];

// ✅ Dynamic CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Import routes
const testControlRoutes = require("./routes/testControl");
const adminRoutes = require("./routes/adminAuth");
const userRoutes = require("./routes/userAuth");
const questionRoutes = require("./routes/questions");
const testRoutes = require("./routes/tests");
const waitingUserRoutes = require("./routes/waitingUsers");

// ✅ Use routes
app.use("/api/testcontrol", testControlRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/waiting-users", waitingUserRoutes);
app.use("/api/tests", testRoutes);

// ✅ Root route
app.get("/", (req, res) => res.send("🚀 Interview Test Portal API is running..."));

// ✅ Connect MongoDB
connectDB();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
