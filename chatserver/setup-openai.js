import fs from "fs";
import path from "path";
import readline from "readline";
import dotenv from "dotenv";

// Load existing environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("========================================================");
console.log("       OpenAI API Key Setup Assistant");
console.log("========================================================");
console.log("");
console.log("This script will help you set up your OpenAI API key.");
console.log("");
console.log("Follow these steps to get your API key:");
console.log("1. Go to https://platform.openai.com/api-keys");
console.log("2. Sign in or create an account");
console.log("3. Click 'Create new secret key'");
console.log("4. Copy the generated key (it starts with 'sk-')");
console.log("");

const getApiKey = () => {
  return new Promise((resolve) => {
    rl.question(
      "Please enter your OpenAI API key (starts with 'sk-'): ",
      (apiKey) => {
        // Validate API key format
        if (!apiKey.startsWith("sk-") || apiKey.length < 40) {
          console.log(
            "\n❌ Invalid API key format. OpenAI API keys should start with 'sk-' and be at least 40 characters long."
          );
          console.log("Please try again or press Ctrl+C to exit.\n");
          resolve(getApiKey()); // Ask again
        } else {
          resolve(apiKey);
        }
      }
    );
  });
};

const updateEnvFile = async () => {
  try {
    // Path to .env file
    const envPath = path.resolve(".env");

    // Check if .env file exists
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Get API key from user
    const apiKey = await getApiKey();

    // Check if OPENAI_API_KEY already exists in .env
    if (envContent.includes("OPENAI_API_KEY=")) {
      // Replace existing key
      envContent = envContent.replace(
        /OPENAI_API_KEY=.*/g,
        `OPENAI_API_KEY=${apiKey}`
      );
    } else {
      // Add new key
      envContent += `\nOPENAI_API_KEY=${apiKey}\n`;
    }

    // Write back to .env file
    fs.writeFileSync(envPath, envContent);

    console.log(
      "\n✅ OpenAI API key has been successfully saved to .env file!"
    );
    console.log("\nYou can now use the OpenAI API in your application.");
    console.log(
      "To test if your API key is working, run: node routes/testRoutes.js test-openai"
    );

    rl.close();
  } catch (error) {
    console.error("\n❌ Error updating .env file:", error.message);
    rl.close();
  }
};

// Start the setup process
updateEnvFile();
