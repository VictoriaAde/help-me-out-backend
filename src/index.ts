import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;

// Configure MongoDB connection
mongoose.connect("mongodb://localhost:27017/");

// Configure CORS middleware
app.use(cors());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define MongoDB Schema and Model for videos
const videoSchema = new mongoose.Schema({
  name: String,
  path: String,
});

const Video = mongoose.model("Video", videoSchema);

// API endpoints
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const video = new Video({
      name: req.file.originalname,
      path: req.file.path,
    });

    await video.save();
    res.json({ message: "Video uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
