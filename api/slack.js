export default async function handler(req, res) {
  // Slack URL verification challenge
  if (req.body?.type === 'url_verification') {
    return res.status(200).json({ challenge: req.body.challenge });
  }

  // App Home opened — publish the Home Tab
  if (req.body?.event?.type === 'app_home_opened') {
    const userId = req.body.event.user;
    const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
    const APP_URL = process.env.APP_URL || 'https://slack-adventures.vercel.app';

    const homeView = {
      user_id: userId,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '🗺️ Slack Adventures', emoji: true },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to your personalized HubSpot implementation journey.\n\nPick 5–10 adventures based on what you want to build in your portal. Each one includes a short HubSpot Academy video and a concrete task.',
            },
          },
          { type: 'divider' },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Available routes*\n🚀 Get Started  ·  🧲 Generate Leads  ·  ⚙️ Automate Marketing\n🏗️ Build Pipeline  ·  💰 Close More Deals  ·  🎧 Scale Support\n🔄 Improve Retention  ·  🧠 AI and Breeze  ·  🤖 AI Agents',
            },
          },
          { type: 'divider' },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: '🚀 Start my adventure', emoji: true },
                style: 'primary',
                url: APP_URL,
                action_id: 'open_app',
              },
            ],
          },
          {
            type: 'context',
            elements: [
              { type: 'mrkdwn', text: '42 adventures · 9 routes · HubSpot Academy content' },
            ],
          },
        ],
      },
    };

    try {
      await fetch('https://slack.com/api/views.publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        },
        body: JSON.stringify(homeView),
      });
    } catch (err) {
      console.error(err);
    }

    return res.status(200).send('');
  }

  // Slash command /adventures
  if (req.method === 'POST' && req.body?.command === '/adventures') {
    const APP_URL = process.env.APP_URL || 'https://slack-adventures.vercel.app';
    return res.status(200).json({
      response_type: 'ephemeral',
      text: `🗺️ *Slack Adventures*\nOpen your adventure here: ${APP_URL}`,
    });
  }

  return res.status(200).send('');
}
