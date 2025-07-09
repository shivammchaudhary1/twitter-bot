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
      mern_tip:
        "Generate a specific, practical tip about MERN stack (MongoDB, Express.js, React.js, Node.js) development that is tweetable (under 280 characters). " +
        "Focus on real-world scenarios, performance optimization, best practices, or common pitfalls. " +
        "Include relevant hashtags like #MERN #WebDev #JavaScript. Make it actionable and valuable.",

      react_tip:
        "Share an advanced React.js tip or best practice that is tweetable (under 280 characters). " +
        "Cover topics like hooks, performance optimization, state management, or component patterns. " +
        "Include code examples if possible and relevant hashtags like #ReactJS #JavaScript #WebDev.",

      node_backend:
        "Create a practical Node.js/Express.js backend development tip that is tweetable (under 280 characters). " +
        "Focus on API design, security, database optimization, middleware, or error handling. " +
        "Include relevant hashtags like #NodeJS #Backend #WebDev. Make it specific and actionable.",

      mongodb_tip:
        "Share a MongoDB database tip or best practice that is tweetable (under 280 characters). " +
        "Cover topics like schema design, indexing, aggregation, performance, or security. " +
        "Include relevant hashtags like #MongoDB #Database #MERN. Focus on practical scenarios.",

      web_security:
        "Generate a web security tip for developers that is tweetable (under 280 characters). " +
        "Cover important security practices, common vulnerabilities, or protection strategies. " +
        "Include relevant hashtags like #WebSecurity #CyberSecurity #DevSecOps.",

      coding_tip:
        "Generate a concise and insightful coding tip about clean code, design patterns, or software architecture that is tweetable (under 280 characters). " +
        "Focus on language-agnostic principles that improve code quality. " +
        "Include relevant hashtags like #CleanCode #Programming #SoftwareEngineering.",

      git_tip:
        "Share a Git or GitHub workflow tip that is tweetable (under 280 characters). " +
        "Focus on practical commands, branching strategies, or collaboration best practices. " +
        "Include relevant hashtags like #Git #GitHub #DevOps.",

      motivational_quote:
        "Create an inspiring and motivational quote for developers that is tweetable (under 280 characters). " +
        "Make it relevant to coding, problem-solving, or professional growth. " +
        "Include relevant hashtags like #DevLife #CodeLife #TechMotivation.",

      debugging_tip:
        "Share a debugging strategy or tool tip that is tweetable (under 280 characters). " +
        "Focus on practical approaches to finding and fixing bugs efficiently. " +
        "Include relevant hashtags like #Debugging #DevTools #ProblemSolving.",
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

// Array of all content types for rotation
const contentTypes = [
  "mern_tip",
  "react_tip",
  "node_backend",
  "mongodb_tip",
  "web_security",
  "coding_tip",
  "git_tip",
  "debugging_tip",
  "motivational_quote",
];

let currentIndex = Math.floor(Math.random() * contentTypes.length);

/**
 * Generate a tweet with rotating content types
 * @returns {Promise<string>} - Generated tweet content
 */
export async function generateAlternatingTweet() {
  // Move to next content type
  currentIndex = (currentIndex + 1) % contentTypes.length;

  // Add some randomness to avoid predictable patterns
  if (Math.random() < 0.3) {
    // 30% chance to pick random type
    currentIndex = Math.floor(Math.random() * contentTypes.length);
  }

  return generateTweetContent(contentTypes[currentIndex]);
}
