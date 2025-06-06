// src/bot.js
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { generateAlternatingTweet } from "./ai.js";

// Load environment variables
dotenv.config();

// Twitter API credentials - For v2 API with OAuth 1.0a
const userClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Create read-write client
const rwClient = userClient.readWrite;

/**
 * Post a tweet to Twitter
 * @param {string} tweetText - The content to post
 * @returns {Promise<Object>} - Twitter API response
 */
export async function postTweet(tweetText) {
  try {
    console.log(`Attempting to post tweet: ${tweetText}`);

    // Validate credentials are set
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_ACCESS_TOKEN) {
      throw new Error("Twitter API credentials are missing in .env file");
    }

    // Post the tweet
    const response = await rwClient.v2.tweet({
      text: tweetText,
    });

    console.log("Tweet posted successfully!");
    console.log("Tweet ID:", response.data.id);
    return response;
  } catch (error) {
    console.error("Error posting tweet:", error);

    // Handle specific Twitter API errors
    if (error.code === 403) {
      console.error("\n🚨 TWITTER API PERMISSION ERROR 🚨");
      console.error("Your Twitter app doesn't have write permissions.");
      console.error("\nTo fix this:");
      console.error(
        "1. Go to https://developer.twitter.com/en/portal/dashboard"
      );
      console.error("2. Select your app");
      console.error("3. Go to 'App permissions' section");
      console.error("4. Change from 'Read' to 'Read and Write'");
      console.error(
        "5. Save changes and regenerate your Access Token & Secret"
      );
      console.error("6. Update your .env file with the new tokens\n");
    } else if (error.code === 401) {
      console.error("\n🚨 AUTHENTICATION ERROR 🚨");
      console.error("Invalid API credentials. Please check your .env file.");
    } else if (error.code === 429) {
      console.error("\n🚨 RATE LIMIT ERROR 🚨");
      console.error("Too many requests. Please wait before trying again.");
    }

    throw error;
  }
}

/**
 * Generate and post a tweet
 * @returns {Promise<Object>} - Twitter API response or error
 */
export async function generateAndPostTweet() {
  try {
    // Generate tweet content using AI
    const tweetContent = await generateAlternatingTweet();

    // Post generated content to Twitter
    const response = await postTweet(tweetContent);
    return response;
  } catch (error) {
    console.error("Failed to generate and post tweet:", error);
    throw error;
  }
}

/**
 * Test Twitter API credentials and permissions
 * @returns {Promise<boolean>} - True if credentials are valid and have write access
 */
export async function testTwitterCredentials() {
  try {
    console.log("🔍 Testing Twitter API credentials...");

    // Test basic authentication by getting user info
    const user = await rwClient.v2.me();
    console.log(
      `✅ Authentication successful! Logged in as: @${user.data.username}`
    );

    // Test if we can access tweet creation endpoint (this will fail if no write permissions)
    try {
      // We won't actually post, but we'll try to validate the request
      await rwClient.v2.tweet({ text: "Test" }, { dryRun: true });
      console.log("✅ Write permissions confirmed!");
      return true;
    } catch (permError) {
      if (permError.code === 403) {
        console.log("❌ No write permissions detected.");
        console.log("Your app has read-only access. You need to:");
        console.log(
          "1. Go to https://developer.twitter.com/en/portal/dashboard"
        );
        console.log("2. Select your app");
        console.log(
          "3. Change App permissions from 'Read' to 'Read and Write'"
        );
        console.log("4. Regenerate your Access Token & Secret");
        console.log("5. Update your .env file with new tokens");
        return false;
      }
      throw permError;
    }
  } catch (error) {
    console.error("❌ Credential test failed:", error.message);
    if (error.code === 401) {
      console.log("Please check your Twitter API credentials in the .env file");
    }
    return false;
  }
}
