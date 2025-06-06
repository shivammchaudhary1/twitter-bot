// test-credentials.js
import dotenv from "dotenv";
import { testTwitterCredentials } from "./src/bot.js";
import { generateTweetContent } from "./src/ai.js";

// Load environment variables
dotenv.config();

/**
 * Test all credentials and functionality
 */
async function runDiagnostics() {
  console.log("🔍 Running Twitter Bot Diagnostics...\n");

  // 1. Check environment variables
  console.log("1️⃣ Checking Environment Variables:");
  const requiredEnvVars = [
    "TWITTER_API_KEY",
    "TWITTER_API_KEY_SECRET",
    "TWITTER_ACCESS_TOKEN",
    "TWITTER_ACCESS_TOKEN_SECRET",
    "GEMINI_API_KEY",
  ];

  let missingVars = [];
  requiredEnvVars.forEach((varName) => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log(
      `\n❌ Missing environment variables: ${missingVars.join(", ")}`
    );
    console.log("Please add these to your .env file\n");
    return;
  }

  // 2. Test Twitter credentials
  console.log("\n2️⃣ Testing Twitter API Credentials:");
  const twitterWorking = await testTwitterCredentials();

  // 3. Test Gemini AI
  console.log("\n3️⃣ Testing Gemini AI:");
  try {
    const testTweet = await generateTweetContent("coding_tip");
    console.log("✅ Gemini AI working!");
    console.log(`Sample generated tweet: ${testTweet}`);
  } catch (error) {
    console.log("❌ Gemini AI failed:", error.message);
  }

  // 4. Summary
  console.log("\n📋 SUMMARY:");
  if (twitterWorking) {
    console.log("✅ All systems working! Your bot should work correctly.");
  } else {
    console.log(
      "❌ Twitter permissions issue detected. Please fix the Twitter app permissions."
    );
    console.log("\nSTEPS TO FIX:");
    console.log("1. Go to https://developer.twitter.com/en/portal/dashboard");
    console.log("2. Select your app");
    console.log("3. Go to 'App permissions' section");
    console.log("4. Change from 'Read' to 'Read and Write'");
    console.log("5. Save changes");
    console.log("6. Go to 'Keys and tokens' section");
    console.log("7. Regenerate your Access Token & Secret");
    console.log("8. Update your .env file with the new tokens");
    console.log("9. Run this test again");
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);
