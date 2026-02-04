const fs = require("fs");
const path = require("path");

const { extractAudio } = require("../services/audio.service");
const { speechToText } = require("../services/speech.service");
const { extractUserData } = require("../services/nlp.service");
const User = require("../models/User.model");

exports.processVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const inputPath = req.file.path;
        const audioPath = `${inputPath}.wav`;

        console.log("📥 File received:", inputPath);

        // 1️⃣ Extract audio from video / audio file
        console.log("🎬 Starting audio extraction...");
        await extractAudio(inputPath, audioPath);
        console.log("🎧 Audio extraction done");

        // 2️⃣ Speech → Text using Whisper
        console.log("🧠 Starting speech-to-text...");
        const transcript = await speechToText(audioPath);
        console.log("📝 Transcript:", transcript);

        // 3️⃣ NLP extraction
        console.log("🔎 Extracting user data...");
        const data = extractUserData(transcript);
        console.log("📦 Extracted data:", data);

        // 4️⃣ Save to MongoDB
        const user = await User.create({
            ...data,
            transcript,
        });

        console.log("✅ User saved to DB");

        // 5️⃣ Cleanup uploaded files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(audioPath);

        res.json({
            success: true,
            user,
        });
    } catch (err) {
        console.error("❌ Processing error:", err);
        res.status(500).json({
            error: "Video processing failed",
            details: err.message,
        });
    }
};
