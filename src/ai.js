// src/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini AI with API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Using Gemini-1.5-flash for optimal performance and cost
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate tweet content using GEMINI AI
 * @param {string} contentType - Type of content ('coding_tip' or 'motivational_quote')
 * @returns {Promise<string>} - Generated tweet content
 */
export async function generateTweetContent(contentType = "coding_tip") {
  try {
    // Validate API key
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in .env file");
    }

    console.log(`🤖 Generating ${contentType} using Gemini AI...`);

    // Define different prompt templates based on content type
    const prompts = {
      coding_tip:
        "Generate a concise and insightful coding tip for software developers that is tweetable (under 280 characters). " +
        "The tip should be practical, teach something specific, and include relevant hashtags. " +
        "Format it professionally and make it engaging. Focus on principles, best practices, or productivity hacks.",

      motivational_quote:
        "Create an inspiring and motivational quote for programmers and developers that is tweetable (under 280 characters). " +
        "Make it empowering, thoughtful, and relevant to coding, technology, or professional growth. " +
        "Include relevant hashtags. The quote should be concise yet impactful.",
    };

    // Select prompt based on content type or default to coding tip
    const promptToUse = prompts[contentType] || prompts.coding_tip;

    // Get response from Gemini
    const result = await model.generateContent(promptToUse);
    const response = await result.response;
    let text = response.text();

    // Clean up the text - remove quotes if present
    text = text.replace(/^["']|["']$/g, "");

    // Trim to ensure tweet length is valid (max 280 chars)
    if (text.length > 280) {
      text = text.substring(0, 277) + "...";
    }

    console.log(`✅ Generated content: ${text}`);
    return text;
  } catch (error) {
    console.error("❌ Error generating content with Gemini:", error);

    // More specific error handling
    if (error.message.includes("API_KEY")) {
      console.error("Please check your GEMINI_API_KEY in the .env file");
    }

    // Provide a backup tweet in case of API failure
    const backupTweets = {
      coding_tip:
        "💡 Code Tip: Write tests first, code second. It clarifies your thinking and prevents bugs! #TDD #CodeTip #Testing #Programming",
      motivational_quote:
        "🚀 'The best error message is the one that never shows up to the user.' - Thomas Fuchs #Coding #Programming #DevLife",
    };

    const backup = backupTweets[contentType] || backupTweets.coding_tip;
    console.log(`Using backup tweet: ${backup}`);
    return backup;
  }
}

// Alternating between coding tips and motivational quotes
let lastGeneratedType = "motivational_quote";

/**
 * Generate a tweet with alternating content types
 * @returns {Promise<string>} - Generated tweet content
 */
export async function generateAlternatingTweet() {
  // Switch content type
  lastGeneratedType =
    lastGeneratedType === "coding_tip" ? "motivational_quote" : "coding_tip";
  return generateTweetContent(lastGeneratedType);
}
