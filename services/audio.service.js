const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const { execSync } = require("child_process");

// Diagnostic: Check ffmpeg binary at startup
console.log("🔍 Ffmpeg Path:", ffmpegPath);
try {
    if (fs.existsSync(ffmpegPath)) {
        const stats = fs.statSync(ffmpegPath);
        console.log(`📊 Binary exists, size: ${stats.size}, mode: ${stats.mode}`);
        // Ensure executable
        execSync(`chmod +x "${ffmpegPath}"`);
        console.log("✅ Ensured binary is executable");
    } else {
        console.error("❌ Ffmpeg binary NOT found at:", ffmpegPath);
    }
} catch (diagErr) {
    console.error("❌ Diagnostic error:", diagErr.message);
}

exports.extractAudio = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`🎬 Processing: ${inputPath} -> ${outputPath}`);

        if (!fs.existsSync(inputPath)) {
            console.error("❌ Input file missing at:", inputPath);
            return reject(new Error(`Input file not found: ${inputPath}`));
        }

        const inputStats = fs.statSync(inputPath);
        console.log(`📂 Input file size: ${inputStats.size} bytes`);

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
