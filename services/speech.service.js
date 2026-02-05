const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.speechToText = async (audioPath) => {
    try {
        console.log("▶ Starting Whisper transcription via OpenAI API...");
        console.log("   Audio file:", audioPath);

        if (!fs.existsSync(audioPath)) {
            throw new Error(`Audio file not found: ${audioPath}`);
        }

        const audioStats = fs.statSync(audioPath);
        console.log(`   File size: ${audioStats.size} bytes`);

        // Use OpenAI Whisper API
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: "whisper-1",
            language: "en",
        });

        console.log("✅ Whisper transcription complete");
        return transcription.text;
    } catch (error) {
        console.error("❌ Whisper API error:");
        console.error("   Error Message:", error.message);
        if (error.response) {
            console.error("   API Response:", error.response.data);
        }
        throw new Error(`Whisper failed: ${error.message}`);
    }
};
