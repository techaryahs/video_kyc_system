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
                console.error("❌ Whisper error:", stderr);
                return reject(error);
            }

            if (!fs.existsSync(txtPath)) {
                return reject(new Error("Whisper output text file not found"));
            }

            const text = fs.readFileSync(txtPath, "utf8").trim();
            resolve(text);
        });
    });
};
