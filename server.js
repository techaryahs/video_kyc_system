require("dotenv").config();
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");

const videoController = require("./controllers/video.controller");

const app = express();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const PORT = process.env.PORT || 5050;

/* ✅ CORS FOR FLUTTER */
app.use(cors({
  origin: "*",
  methods: ["POST"],
}));

/* MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* Route */
app.post("/upload", upload.single("video"), videoController.processVideo);

/* Start */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});

