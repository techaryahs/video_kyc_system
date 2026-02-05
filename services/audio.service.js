const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

const fs = require("fs");

exports.extractAudio = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`🎬 Processing: ${inputPath} -> ${outputPath}`);

        if (!fs.existsSync(inputPath)) {
            return reject(new Error(`Input file not found: ${inputPath}`));
        }

        ffmpeg(inputPath)
            .noVideo()
            .audioCodec("pcm_s16le")
            .audioChannels(1)
            .audioFrequency(16000)
            .format("wav")
            .on("start", (commandLine) => {
                console.log("🚀 Spawned Ffmpeg with command: " + commandLine);
            })
            .on("end", () => {
                console.log("✅ Audio extraction finished");
                resolve();
            })
            .on("error", (err, stdout, stderr) => {
                console.error("❌ Ffmpeg Error:", err.message);
                console.error("❌ Ffmpeg Stdout:", stdout);
                console.error("❌ Ffmpeg Stderr:", stderr);
                reject(err);
            })
            .save(outputPath);
    });
};
