const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");

console.log("=== FFMPEG DIAGNOSTIC TEST ===\n");

// Test 1: Check if binary exists
console.log("1. Checking binary location...");
console.log("   Path:", ffmpegPath);
console.log("   Exists:", fs.existsSync(ffmpegPath));

if (fs.existsSync(ffmpegPath)) {
    const stats = fs.statSync(ffmpegPath);
    console.log("   Size:", stats.size, "bytes");
    console.log("   Mode:", stats.mode.toString(8));
}

// Test 2: Try running ffmpeg -version
console.log("\n2. Testing ffmpeg -version...");
const versionTest = spawn(ffmpegPath, ["-version"]);

let versionOutput = "";
let versionError = "";

versionTest.stdout.on("data", (data) => {
    versionOutput += data.toString();
});

versionTest.stderr.on("data", (data) => {
    versionError += data.toString();
});

versionTest.on("error", (err) => {
    console.error("   ❌ Failed to spawn:", err.message);
    process.exit(1);
});

versionTest.on("close", (code) => {
    console.log("   Exit code:", code);
    if (versionOutput) {
        console.log("   Output:", versionOutput.substring(0, 200));
    }
    if (versionError) {
        console.log("   Stderr:", versionError);
    }

    if (code !== 0) {
        console.log("\n❌ FFMPEG FAILED TO RUN!");
        console.log("This is likely a missing system library issue.");
        console.log("\nTry running this command on your server:");
        console.log(`  ldd ${ffmpegPath}`);
        console.log("\nLook for 'not found' entries - those are missing libraries.");
        process.exit(1);
    }

    console.log("\n✅ ffmpeg -version works!");

    // Test 3: Try actual conversion if a test file exists
    const testFiles = fs.readdirSync("uploads").filter(f => f !== ".gitkeep");
    if (testFiles.length > 0) {
        const testInput = `uploads/${testFiles[0]}`;
        const testOutput = `uploads/test_output.wav`;

        console.log("\n3. Testing actual audio extraction...");
        console.log("   Input:", testInput);
        console.log("   Output:", testOutput);

        const convertTest = spawn(ffmpegPath, [
            "-i", testInput,
            "-vn",
            "-acodec", "pcm_s16le",
            "-ac", "1",
            "-ar", "16000",
            "-f", "wav",
            testOutput
        ]);

        let convertOutput = "";
        let convertError = "";

        convertTest.stdout.on("data", (data) => {
            convertOutput += data.toString();
        });

        convertTest.stderr.on("data", (data) => {
            convertError += data.toString();
        });

        convertTest.on("error", (err) => {
            console.error("   ❌ Spawn error:", err.message);
        });

        convertTest.on("close", (code) => {
            console.log("   Exit code:", code);
            if (convertOutput) console.log("   Stdout:", convertOutput);
            if (convertError) console.log("   Stderr:", convertError.substring(0, 500));

            if (code === 0) {
                console.log("\n✅ CONVERSION SUCCESSFUL!");
                fs.unlinkSync(testOutput);
            } else {
                console.log("\n❌ CONVERSION FAILED!");
            }
        });
    } else {
        console.log("\n3. No test files found in uploads/ - skipping conversion test");
        console.log("\n✅ Diagnostic complete");
    }
});
