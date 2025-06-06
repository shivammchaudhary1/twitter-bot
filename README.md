# Twitter Bot for Daily Coding Tips & Motivational Quotes

A Node.js Twitter bot that automatically posts daily coding tips or motivational quotes related to programming, using the GEMINI AI model to generate content.

## Features

- 🤖 **Automated Posting**: Posts once daily at a configured time
- 🧠 **AI-Generated Content**: Uses Gemini 1.5 Flash to create engaging tweets
- 🔄 **Content Alternation**: Alternates between coding tips and motivational quotes
- 🔒 **Secure**: All sensitive API keys stored in environment variables
- ⏱️ **Scheduled**: Configurable posting time and timezone

## Prerequisites

- Node.js (v14 or higher)
- Twitter Developer Account with API credentials
- Google Generative AI API key

## Project Structure

```
twitter-bot/
├── .env                  # Environment variables (credentials and configuration)
├── env.example           # Example for environment variables
├── index.js              # Main application entry point
├── package.json          # Project metadata and dependencies
└── src/
    ├── ai.js            # Gemini AI integration
    └── bot.js           # Twitter API integration
```

## Installation & Setup

1. **Clone the repository or create project structure as shown**

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following:

```
# Twitter API credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_KEY_SECRET=your_twitter_api_key_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# Gemini API key
GEMINI_API_KEY=your_gemini_api_key

# Bot configuration
BOT_TIMEZONE=Asia/Kolkata  # IST timezone
BOT_POST_HOUR=9  # 9 AM
BOT_POST_MINUTE=0  # 0 minutes
BOT_POST_FREQUENCY=daily  # Daily posting
```

4. **Running the bot**

```bash
npm start
```

## Getting API Credentials

### Twitter API Credentials

1. Create a [Twitter Developer Account](https://developer.twitter.com/)
2. Create a new Project and App in the Developer Portal
3. Apply for Elevated access (required for posting tweets)
4. Generate API Key, API Secret, Access Token, and Access Token Secret
5. Enable OAuth 1.0a in the App settings
6. Add Read and Write permissions to your App

### Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Create an API key from the API Keys section
4. Copy your API key and add it to your `.env` file

## Testing

To test if your bot works correctly without waiting for the scheduled time:

1. Open `index.js`
2. Uncomment the line `// postImmediately();`
3. Run `npm start`
4. Check your Twitter account for the new post
5. Comment the line again for normal scheduled operation

## Deployment Options

For continuous operation, you can deploy this bot to:

### 1. VPS/Dedicated Server

- AWS EC2, DigitalOcean Droplet, etc.
- Run using PM2 to keep the process alive:
  ```
  npm install -g pm2
  pm2 start index.js --name twitter-bot
  ```

### 2. Serverless Options

- **AWS Lambda** with EventBridge for scheduling
- **Google Cloud Functions** with Cloud Scheduler

### 3. Container-Based

- Docker container on services like:
  - Google Cloud Run
  - AWS ECS
  - Azure Container Instances

## Customization

- Modify prompts in `src/ai.js` to change content generation
- Adjust posting frequency or time in `.env`
- Add additional content types beyond coding tips and motivational quotes

## Troubleshooting

**Bot not posting?**

- Check if all API credentials are correct in .env file
- Ensure your Twitter developer account has proper permissions
- Check logs for specific error messages

**Twitter API errors?**

- Verify you have Elevated access for Twitter API
- Check if your developer account is active and in good standing
- Ensure your App has Read and Write permissions

**Gemini API errors?**

- Verify your API key is correct and active
- Check if you have exceeded API usage limits
- Ensure internet connectivity for API calls

## License

ISC

## Author

Shivam Chaudhary
