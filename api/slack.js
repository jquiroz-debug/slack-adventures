export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  const { user_name } = req.body;
  const APP_URL = process.env.APP_URL || 'https://slack-adventures.vercel.app';
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

  const modal = {
    trigger_id: req.body.trigger_id,
    view: {
      type: 'modal',
      title: { type: 'plain_text', text: 'Slack Adventures', emoji: true },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hey ${user_name ? `*${user_name}*` : 'there'} 👋\n\nYour personalized HubSpot adventure is ready. Pick 5–10 adventures based on what you want to activate in your portal.`,
          },
        },
        { type: 'divider' },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Open my adventure →', emoji: true },
              style: 'primary',
              url: APP_URL,
              action_id: 'open_app',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: '42 adventures · 9 routes · HubSpot Academy videos' },
          ],
        },
      ],
    },
  };

  try {
    await fetch('https://slack.com/api/views.open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify(modal),
    });
  } catch (err) {
    console.error(err);
  }

  return res.status(200).send('');
}
