// index.js
import schedule from "node-schedule";
import dotenv from "dotenv";
import { generateAndPostTweet, testTwitterCredentials } from "./src/bot.js";

// Load environment variables
dotenv.config();

// Get configuration from environment variables
const BOT_TIMEZONE = process.env.BOT_TIMEZONE || "Asia/Kolkata";
const BOT_POST_HOUR = parseInt(process.env.BOT_POST_HOUR || "9", 10); // Default: 9 AM
const BOT_POST_MINUTE = parseInt(process.env.BOT_POST_MINUTE || "0", 10); // Default: 0 minutes

/**
 * Start the Twitter bot with scheduled posting
 */
function startBot() {
  console.log("Twitter Bot Starting...");
  console.log(
    `Scheduled to post daily at ${BOT_POST_HOUR}:${BOT_POST_MINUTE.toString().padStart(
      2,
      "0"
    )} (${BOT_TIMEZONE})`
  );

  // Schedule job to run daily at the specified time
  const rule = new schedule.RecurrenceRule();
  rule.hour = BOT_POST_HOUR;
  rule.minute = BOT_POST_MINUTE;
  rule.tz = BOT_TIMEZONE;

  // Create scheduled job
  schedule.scheduleJob(rule, async function () {
    console.log(`Scheduled job running at ${new Date().toLocaleString()}`);

    try {
      // Generate and post a tweet
      await generateAndPostTweet();
      console.log("Scheduled posting completed successfully");
    } catch (error) {
      console.error("Scheduled posting failed:", error);
    }
  });

  console.log(
    "Bot scheduled successfully. Keep this process running to post tweets at the scheduled time."
  );
}

/**
 * Post a tweet immediately (for testing purposes)
 */
async function postImmediately() {
  console.log("🚀 Generating and posting tweet...\n");

  try {
    await generateAndPostTweet();
    console.log("\n✅ Tweet posted successfully!");
  } catch (error) {
    console.error("\n❌ Tweet failed:", error.message);
    if (error.code === 401 || error.code === 403) {
      console.log("Please check your Twitter API credentials in the .env file");
    }
  }
}

// Check if we should run in immediate mode or schedule mode
const args = process.argv.slice(2);
if (args.includes("--immediate")) {
  // Only post immediately if explicitly requested
  postImmediately().then(() => {
    console.log("\n💡 Tip: Remove --immediate flag to run in scheduled mode");
  });
} else {
  // Default: Run in scheduled mode
  startBot();
}
