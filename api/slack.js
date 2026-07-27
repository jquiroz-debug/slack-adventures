export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // Parse raw body
  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  // Slack sends block_actions as URL-encoded with a "payload" field
  let body;
  if (rawBody.startsWith('payload=')) {
    body = JSON.parse(decodeURIComponent(rawBody.slice(8)));
  } else if (rawBody.startsWith('{')) {
    body = JSON.parse(rawBody);
  } else {
    // slash command — URL-encoded key=value pairs
    const params = new URLSearchParams(rawBody);
    body = Object.fromEntries(params.entries());
  }

  // ── 1. URL verification ──────────────────────────────────────────────────
  if (body?.type === 'url_verification') {
    return res.status(200).json({ challenge: body.challenge });
  }

  const TOKEN = process.env.SLACK_BOT_TOKEN;

  async function slackAPI(method, payload) {
    const r = await fetch(`https://slack.com/api/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (!d.ok) console.error(`Slack ${method} error:`, d.error, JSON.stringify(d));
    return d;
  }

  // ── 2. App Home opened ───────────────────────────────────────────────────
  if (body?.event?.type === 'app_home_opened') {
    await slackAPI('views.publish', {
      user_id: body.event.user,
      view: buildHomeView('All'),
    });
    return res.status(200).send('');
  }

  // ── 3. Block Kit interactions ────────────────────────────────────────────
  if (body?.type === 'block_actions') {
    const action = body.actions?.[0];
    const userId = body.user?.id;

    // Adventure card — open modal
    if (action?.action_id?.startsWith('adv_')) {
      const advId = parseInt(action.action_id.replace('adv_', ''));
      const adv = ADVENTURES.find(a => a.id === advId);
      if (adv) {
        await slackAPI('views.open', {
          trigger_id: body.trigger_id,
          view: buildAdventureModal(adv),
        });
      }
      return res.status(200).send('');
    }

    // Hub filter
    if (action?.action_id?.startsWith('filter_')) {
      const hub = action.action_id.replace('filter_', '').replace(/_/g, ' ');
      await slackAPI('views.publish', {
        user_id: userId,
        view: buildHomeView(hub),
      });
      return res.status(200).send('');
    }

    return res.status(200).send('');
  }

  // ── 4. Modal submission — adventure completed ────────────────────────────
  if (body?.type === 'view_submission') {
    const callbackId = body.view?.callback_id || '';
    if (callbackId.startsWith('complete_adv_')) {
      const advId = parseInt(callbackId.replace('complete_adv_', ''));
      const adv = ADVENTURES.find(a => a.id === advId);
      const evidence = body.view?.state?.values?.evidence_block?.evidence_input?.value || '';

      // Send confirmation message to user
      await slackAPI('chat.postMessage', {
        channel: body.user.id,
        text: `✅ *${adv?.adv || 'Adventure'}* completed!\n\n📎 Your evidence: ${evidence}\n\nKeep going — open *Adventures* in the sidebar for your next one.`,
      });

      return res.status(200).json({ response_action: 'clear' });
    }
  }

  // ── 5. Slash command ─────────────────────────────────────────────────────
  if (body?.command === '/adventures') {
    return res.status(200).json({
      response_type: 'ephemeral',
      text: '🗺️ Open *Adventures* in your sidebar (under Apps) to start your HubSpot adventure!',
    });
  }

  return res.status(200).send('');
}

// ── BUILD HOME VIEW ─────────────────────────────────────────────────────────
function buildHomeView(activeFilter) {
  const hubs = ['All', 'Get Started', 'Marketing Hub', 'Sales Hub', 'Service Hub', 'AI & Breeze', 'Agentic Platform'];
  const filter = activeFilter || 'All';
  const filtered = filter === 'All' ? ADVENTURES : ADVENTURES.filter(a => a.hub === filter);

  const filterButtons = hubs.map(h => ({
    type: 'button',
    text: { type: 'plain_text', text: h === filter ? `• ${h}` : h, emoji: true },
    action_id: `filter_${h.replace(/ /g, '_')}`,
    style: h === filter ? 'primary' : undefined,
  }));

  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: '🗺️ Slack Adventures — Academy Onboarding', emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: 'Pick the adventures that match what you want to build in HubSpot. Each one has a short Academy video and a concrete task.' } },
    { type: 'divider' },
    { type: 'actions', elements: filterButtons },
    { type: 'divider' },
  ];

  const groups = {};
  filtered.forEach(adv => {
    if (!groups[adv.route]) groups[adv.route] = [];
    groups[adv.route].push(adv);
  });

  Object.entries(groups).forEach(([route, advs]) => {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*${HUB_EMOJI[advs[0].hub] || '📌'} ${route}*` } });
    advs.forEach(adv => {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*${adv.adv}*\n${adv.desc}${adv.dur ? `  ·  ⏱ ${adv.dur}` : ''}` },
        accessory: {
          type: 'button',
          text: { type: 'plain_text', text: 'Start →', emoji: true },
          action_id: `adv_${adv.id}`,
          value: String(adv.id),
        },
      });
    });
    blocks.push({ type: 'divider' });
  });

  blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: '42 adventures · 9 routes · HubSpot Academy content' }] });
  return { type: 'home', blocks };
}

// ── BUILD ADVENTURE MODAL ────────────────────────────────────────────────────
function buildAdventureModal(adv) {
  const blocks = [
    { type: 'section', text: { type: 'mrkdwn', text: `*${HUB_EMOJI[adv.hub] || '📌'} ${adv.hub}  ·  ${adv.route}*\n\n${adv.desc}` } },
    { type: 'divider' },
  ];

  if (adv.vid1) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*▶ Watch first*${adv.dur ? `  ·  ⏱ ${adv.dur}` : ''}` } });
    blocks.push({
      type: 'actions',
      elements: [
        { type: 'button', text: { type: 'plain_text', text: adv.vid2 ? 'Watch video — part 1 ↗' : 'Watch video ↗', emoji: true }, url: adv.vid1, action_id: 'watch_vid1' },
        ...(adv.vid2 ? [{ type: 'button', text: { type: 'plain_text', text: 'Watch video — part 2 ↗', emoji: true }, url: adv.vid2, action_id: 'watch_vid2' }] : []),
      ],
    });
    blocks.push({ type: 'divider' });
  }

  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*🎯 Your task*\n${adv.task}` } });
  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'input',
    block_id: 'evidence_block',
    element: { type: 'plain_text_input', action_id: 'evidence_input', multiline: true, placeholder: { type: 'plain_text', text: 'URL, screenshot description, or a note about what you did…' } },
    label: { type: 'plain_text', text: '📎 Share your evidence', emoji: true },
  });

  return {
    type: 'modal',
    callback_id: `complete_adv_${adv.id}`,
    title: { type: 'plain_text', text: adv.adv.slice(0, 24), emoji: true },
    submit: { type: 'plain_text', text: '✅ Mark as completed', emoji: true },
    close: { type: 'plain_text', text: 'Back', emoji: true },
    blocks,
  };
}

const HUB_EMOJI = { 'Get Started':'🚀', 'Marketing Hub':'🧲', 'Sales Hub':'💰', 'Service Hub':'🎧', 'AI & Breeze':'🧠', 'Agentic Platform':'🤖' };

const ADVENTURES = [
  { id:1,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Portal welcome and navigation",           desc:"Tour the dashboard — where each section lives and which tools are in your plan.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1892747?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Explore the 3 main sections: CRM, Marketing and Reports. Note which tools are active." },
  { id:2,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Company, users and permissions",          desc:"Configure company details, invite your team, and assign the correct roles.", vid1:"https://app.hubspot.com/academy/53/shortvideo/7072817?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/2990176?language=EN&ruid=25879245", dur:"3 min", task:"Update company details, invite at least one team member, and assign the correct role." },
  { id:3,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Connect email and domain",                desc:"Link Gmail or Outlook and install the HubSpot tracking pixel on your website.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1843222?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/5891657?language=EN&ruid=25879245", dur:"3 min", task:"Connect your inbox in Settings, then install the tracking pixel on your website." },
  { id:4,  hub:"Get Started",      route:"Get started with HubSpot", adv:"CRM, properties and objects",             desc:"Explore Contacts, Companies and Deals, then create custom properties for your industry.", vid1:"https://app.hubspot.com/academy/53/shortvideo/14910058?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7750989?language=EN&ruid=25879245", dur:"6 min", task:"Explore all three CRM objects. Create 3 custom properties relevant to your business." },
  { id:5,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Validation and graduation",               desc:"Verify everything is configured correctly and share a screenshot as evidence.", vid1:"", vid2:"", dur:"", task:"Check: company logo and currency set, team member invited, pixel active. Share a screenshot." },
  { id:6,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Capture forms",                          desc:"Create and publish a form on your website to capture leads into the CRM.", vid1:"https://app.hubspot.com/academy/53/shortvideo/2639657?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Go to Marketing > Forms. Create a form and publish it on your website." },
  { id:7,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Connect social media",                   desc:"Connect LinkedIn, Facebook, Instagram and X to publish and monitor from HubSpot.", vid1:"https://app.hubspot.com/academy/53/shortvideo/2966058?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Connect your accounts in Marketing > Social. Publish 3 posts and set up one monitoring stream." },
  { id:8,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Connect ads",                            desc:"Connect Google Ads or Meta Ads to see which campaigns generate real customers.", vid1:"https://app.hubspot.com/academy/53/shortvideo/7144617?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/8488208?language=EN&ruid=25879245", dur:"5 min", task:"Connect ads in Marketing > Ads. Create one audience from CRM contacts and review the ROI report." },
  { id:9,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Lead scoring",                           desc:"Define scoring criteria and activate the automatic score to surface your hottest leads.", vid1:"https://app.hubspot.com/academy/53/shortvideo/2673766?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/2673746?language=EN&ruid=25879245", dur:"7 min", task:"Go to CRM > Properties > HubSpot Score. Define 5 criteria and activate the score." },
  { id:10, hub:"Marketing Hub",    route:"Generate leads",            adv:"First leads report",                     desc:"Review traffic sources and build your first leads metrics dashboard.", vid1:"https://app.hubspot.com/academy/53/shortvideo/4675756?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/8633159?language=EN&ruid=25879245", dur:"4 min", task:"Open Reports > Traffic Analytics, filter by the last 30 days, save to your dashboard." },
  { id:11, hub:"Marketing Hub",    route:"Automate marketing",        adv:"First email campaign",                   desc:"Create and send a marketing email with personalization and a custom template.", vid1:"https://academy.hubspot.com/lessons/getting-started-with-email-in-hubspot", vid2:"", dur:"", task:"Create an email in Marketing > Email, personalize it with {firstname}, send to 10+ contacts." },
  { id:12, hub:"Marketing Hub",    route:"Automate marketing",        adv:"Active lists and segmentation",          desc:"Build dynamic segments that update automatically.", vid1:"https://app.hubspot.com/academy/53/shortvideo/8379147?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/1675279?language=EN&ruid=25879245", dur:"6 min", task:"Create 3 active lists: cold leads, hot leads (score > 50), current customers." },
  { id:13, hub:"Marketing Hub",    route:"Automate marketing",        adv:"First automated workflow",               desc:"Build a welcome flow that sends emails when someone submits a form.", vid1:"https://app.hubspot.com/academy/53/shortvideo/2371369?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7599257?language=EN&ruid=25879245", dur:"", task:"Create a workflow triggered by form submission. Add a welcome email, wait 2 days, add a second." },
  { id:14, hub:"Marketing Hub",    route:"Automate marketing",        adv:"Marketing automation and nurturing",     desc:"Create a 5-email sequence to convert cold leads into warm ones.", vid1:"https://app.hubspot.com/academy/53/shortvideo/9491375?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7142188?language=EN&ruid=25879245", dur:"6 min", task:"Build a nurturing sequence: education, case study, soft CTA, direct CTA. Launch to cold leads." },
  { id:15, hub:"Marketing Hub",    route:"Automate marketing",        adv:"A/B testing and optimization",           desc:"Test two subject lines and analyze which generates more opens.", vid1:"https://academy.hubspot.com/lessons/improving-your-email-marketing-through-testing", vid2:"", dur:"18 min", task:"Create an A/B test on your next email, test two subject lines, share your results." },
  { id:16, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Design the pipeline",                    desc:"Map your sales process into HubSpot stages with close probabilities.", vid1:"https://app.hubspot.com/academy/53/shortvideo/3268964?language=EN&ruid=25879245", vid2:"", dur:"4 min", task:"Go to CRM > Deals > Pipelines. Define your stages and set probabilities." },
  { id:17, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Create and manage leads",                desc:"Load your current opportunities as leads in the CRM.", vid1:"https://app.hubspot.com/academy/53/shortvideo/7072820?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/8379181?language=EN&ruid=25879245", dur:"5 min", task:"Create 3 real leads with name, amount, and close date. Associate to a contact and company." },
  { id:18, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Tasks, notes and activities",            desc:"Log calls, notes and follow-ups in the deal timeline.", vid1:"https://knowledge.hubspot.com/records/manually-log-activities-on-records", vid2:"", dur:"5 min", task:"For each lead: log a note, schedule a follow-up task, and record a call or email." },
  { id:19, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Lead assignment and team view",          desc:"Move leads in the Prospecting Workspace and configure round-robin assignment.", vid1:"https://knowledge.hubspot.com/records/how-to-set-a-record-owner", vid2:"", dur:"5 min", task:"Move 3 leads through the Prospecting Workspace and configure automatic assignment." },
  { id:20, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Pipeline report and forecast",           desc:"Build a sales dashboard with the projected close amount for the month.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1519169?language=EN&ruid=25879245", vid2:"https://academy.hubspot.com/lessons/hubspot-forecasting-analytics", dur:"3+17 min", task:"Build a pipeline dashboard. Identify your top 3 deals most likely to close this month." },
  { id:21, hub:"Sales Hub",        route:"Close more deals",          adv:"Sales sequences",                        desc:"Create a 5-step prospecting cadence and enroll the first real contact.", vid1:"https://app.hubspot.com/academy/53/shortvideo/3278876?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/19925820?language=EN&ruid=25879245", dur:"5 min", task:"Create a 5-step sequence and enroll one contact. Share the sequence name and first subject line." },
  { id:22, hub:"Sales Hub",        route:"Close more deals",          adv:"Email templates library",                desc:"Build 5 reusable templates: prospecting, follow-up, closing, post-meeting, referral.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1846274?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Build all 5 templates in Sales > Templates. Each should be ready to use without editing." },
  { id:23, hub:"Sales Hub",        route:"Close more deals",          adv:"Quotes and CPQ",                         desc:"Load your product catalog and send the first digital quote from a deal.", vid1:"https://app.hubspot.com/academy/53/shortvideo/9739308?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Add products to the catalog and send a quote attached to a real deal. Share the link." },
  { id:24, hub:"Sales Hub",        route:"Close more deals",          adv:"Meeting links and call recording",       desc:"Create a meeting link, activate call recording and book the first meeting.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1842560?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/1843219?language=EN&ruid=25879245", dur:"5 min", task:"Create your meeting link, add to your signature, activate call recording." },
  { id:25, hub:"Sales Hub",        route:"Close more deals",          adv:"Sales playbook",                         desc:"Document your closing process in a HubSpot playbook.", vid1:"https://app.hubspot.com/academy/53/shortvideo/3475282?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Create a playbook with your closing process. Share your first deal WON as evidence." },
  { id:26, hub:"Service Hub",      route:"Scale support",             adv:"HelpDesk setup",                         desc:"Connect your support email to the Helpdesk and manage tickets by stage.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1527191?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7236352?language=EN&ruid=25879245", dur:"7 min", task:"Connect support email to Helpdesk and move 3 tickets through stages. Share a screenshot." },
  { id:27, hub:"Service Hub",      route:"Scale support",             adv:"Ticket pipeline and SLAs",               desc:"Customize support stages and activate minimum response times.", vid1:"https://app.hubspot.com/academy/53/shortvideo/8525394?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Set up ticket stages and SLAs: urgent 2h, normal 24h. Activate SLA alerts." },
  { id:28, hub:"Service Hub",      route:"Scale support",             adv:"Knowledge base",                         desc:"Publish your 3 most repeated questions so customers can help themselves.", vid1:"https://app.hubspot.com/academy/53/?overviewType=LESSON&overviewEntityId=21548560&overviewLanguage=EN&language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Go to Service > Knowledge Base. Publish 3 FAQ articles and share the URLs." },
  { id:29, hub:"Service Hub",      route:"Scale support",             adv:"Live chat and Customer Agent",           desc:"Activate the chat widget and configure a welcome chatbot flow.", vid1:"https://app.hubspot.com/academy/53/shortvideo/8488212?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7256134?language=EN&ruid=25879245", dur:"6 min", task:"Activate the live chat widget and configure a welcome chatbot flow on your website." },
  { id:30, hub:"Service Hub",      route:"Scale support",             adv:"Feedback surveys",                       desc:"Activate a post-ticket satisfaction survey and build the support dashboard.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1526602?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Activate the post-ticket CSAT survey. Build a support dashboard with response time and CSAT." },
  { id:31, hub:"Service Hub",      route:"Improve retention",         adv:"Automated NPS",                          desc:"Set up an NPS survey that fires 30 days after first purchase.", vid1:"https://knowledge.hubspot.com/customer-feedback/create-and-send-customer-satisfaction-surveys", vid2:"", dur:"2 min", task:"Create an NPS survey triggered 30 days after purchase. Activate for at least 10 customers." },
  { id:32, hub:"Service Hub",      route:"Improve retention",         adv:"Customer Success Workspace setup",       desc:"Organize and customize your Customer Success Workspace.", vid1:"https://app.hubspot.com/academy/53/shortvideo/18476963?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7261070?language=EN&ruid=25879245", dur:"7 min", task:"Open the CSW, customize it for your team, and update a customer record from within it." },
  { id:33, hub:"Service Hub",      route:"Improve retention",         adv:"Health scores setup",                    desc:"Define risk signals and activate notifications for at-risk customers.", vid1:"https://app.hubspot.com/academy/53/shortvideo/7236353?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Define 3 positive signals and 2 negative signals. Activate your first health score." },
  { id:34, hub:"Service Hub",      route:"Improve retention",         adv:"Using the Customer Success Workspace",   desc:"Use the CSW to manage retention and identify customers at risk.", vid1:"https://app.hubspot.com/academy/53/shortvideo/18477059?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/19955050?language=EN&ruid=25879245", dur:"3 min", task:"Filter the CSW by risk level. Send an email to an at-risk customer from within the workspace." },
  { id:35, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"Breeze Assistant",                       desc:"Use the AI assistant to summarize deals, draft emails, and analyze contacts.", vid1:"https://app.hubspot.com/academy/53/shortvideo/10265672?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/20683865?language=EN&ruid=25879245", dur:"5 min", task:"Use Breeze for 5 tasks: summarize a deal, draft an email, analyze a contact, suggest a workflow." },
  { id:36, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"AI content generation",                  desc:"Configure brand voice and generate a blog post with the Content Agent.", vid1:"https://app.hubspot.com/academy/53/shortvideo/1962753?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/20715533?language=EN&ruid=25879245", dur:"3 min", task:"Configure brand voice. Generate a blog post with the Content Agent and publish it." },
  { id:37, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"AEO — Answer Engine Optimization",       desc:"Measure how often your brand appears in ChatGPT, Gemini and Perplexity.", vid1:"https://app.hubspot.com/academy/53/shortvideo/18933062?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/18933067?language=EN&ruid=25879245", dur:"7 min", task:"Go to Marketing > AEO. Enter your domain and 5 competitors. Review your Brand Visibility Score." },
  { id:38, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"Data enrichment",                        desc:"Enrich your top leads with automatic data and use intent signals to prioritize.", vid1:"https://app.hubspot.com/academy/53/shortvideo/18932397?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/14496335?language=EN&ruid=25879245", dur:"9 min", task:"Activate auto-enrichment. Enrich 20 key leads and use intent signals to prioritize." },
  { id:39, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"Predictive analytics",                   desc:"Activate predictive lead scoring and configure anomaly alerts.", vid1:"https://app.hubspot.com/academy/53/shortvideo/10265663?language=EN&ruid=25879245", vid2:"", dur:"1 min", task:"Activate Predictive Lead Scoring and set up anomaly alerts. Share one insight the AI found." },
  { id:40, hub:"Agentic Platform", route:"AI agents",                 adv:"What are HubSpot agents?",               desc:"Understand the difference between automations and agents.", vid1:"https://app.hubspot.com/academy/53/shortvideo/5736559?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/21289130?language=EN&ruid=25879245", dur:"4 min", task:"Watch both videos. Write: which process would you delegate to an agent first and why?" },
  { id:41, hub:"Agentic Platform", route:"AI agents",                 adv:"Prospecting Agent",                      desc:"Configure the Selling Profile and enroll real prospects in Review mode.", vid1:"https://app.hubspot.com/academy/53/shortvideo/10265680?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/10266907?language=EN&ruid=25879245", dur:"8 min", task:"Configure your Selling Profile. Enroll 5 contacts in Review mode and approve at least 3 emails." },
  { id:42, hub:"Agentic Platform", route:"AI agents",                 adv:"Customer Agent",                         desc:"Create the support agent, connect it to your KB and activate with human handoff.", vid1:"https://app.hubspot.com/academy/53/shortvideo/8488212?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/18933079?language=EN&ruid=25879245", dur:"", task:"Create the Customer Agent, connect your KB, define handoff rules, activate in Review mode." },
];
