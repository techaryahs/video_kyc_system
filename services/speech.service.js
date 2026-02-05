const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.speechToText = (audioPath) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(audioPath);
        const baseName = path.basename(audioPath, ".wav");
        const txtPath = path.join(dir, `${baseName}.txt`);

        const command = `whisper "${audioPath}" --model base --language en --output_format txt --output_dir "${dir}"`;

        console.log("▶ Running Whisper:", command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("❌ Whisper execution failed:");
                console.error("❌ Error Message:", error.message);
                console.error("❌ Stderr:", stderr);
                console.error("❌ Stdout:", stdout);
                return reject(new Error(`Whisper failed: ${error.message}`));
            }

            if (!fs.existsSync(txtPath)) {
                console.error("❌ Whisper output file missing:", txtPath);
                return reject(new Error("Whisper output text file not found"));
            }

            const text = fs.readFileSync(txtPath, "utf8").trim();
            console.log("✅ Whisper transcription complete");
            resolve(text);
        });
    });
};
