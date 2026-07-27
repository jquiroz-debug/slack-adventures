# Slack Adventures — Academy Onboarding

Personalized HubSpot onboarding experience. Customers pick 5–10 adventures, complete Academy videos and portal tasks, and track progress — all accessible from Slack without leaving the app.

## Stack
- React 18 + Vite
- Claude API (claude-sonnet-4-6) for the AI assistant inside each adventure

## Local development
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. Select this repo — Vercel auto-detects Vite, no config needed
4. Click Deploy
5. Your URL is ready: `your-project.vercel.app`

## Add to Slack Canvas
1. In your Academy community channel, create a Canvas
2. Add a link button pointing to your Vercel URL
3. Pin the Canvas to the channel

## Environment variables
The Claude API key is handled by the Anthropic proxy — no `.env` needed for the AI assistant to work on claude.ai. If deploying standalone, add:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```
And update the fetch call in `src/App.jsx` to include the Authorization header.
