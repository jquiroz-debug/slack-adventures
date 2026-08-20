import { useState, useEffect, useRef } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg:       "#0A0A0F",
  bg2:      "#12121A",
  bg3:      "#1A1A26",
  panel:    "#0F0F1A",
  salmon:   "#FF7A59",
  salmonD:  "#CC5A3C",
  teal:     "#00BDA5",
  tealD:    "#008F7C",
  yellow:   "#FFD700",
  purple:   "#9B59FF",
  green:    "#00E676",
  red:      "#FF4444",
  text:     "#E0E0D0",
  muted:    "#6A6A7A",
  border:   "#2A2A3A",
  border2:  "#3A3A4A",
};

const HUB_COLORS = {
  "Get Started":      { color: C.salmon,  dark: C.salmonD, glow: "rgba(255,122,89,0.15)" },
  "Marketing Hub":    { color: C.teal,    dark: C.tealD,   glow: "rgba(0,189,165,0.15)" },
  "Sales Hub":        { color: C.yellow,  dark: "#CC9900",  glow: "rgba(255,215,0,0.15)" },
  "Service Hub":      { color: C.purple,  dark: "#7A3FCC",  glow: "rgba(155,89,255,0.15)" },
  "AI & Breeze":      { color: "#FF6EC7", dark: "#CC4A9A",  glow: "rgba(255,110,199,0.15)" },
  "Agentic Platform": { color: "#00E5FF", dark: "#00AACC",  glow: "rgba(0,229,255,0.15)" },
};

const USE_CASES = [
  { id:"get-started",        hub:"Get Started",      icon:"🚀", label:"GET STARTED",          sub:"Set up portal, CRM & team",          level:"01", ids:[1,2,3,4,5]     },
  { id:"generate-leads",     hub:"Marketing Hub",    icon:"🧲", label:"GENERATE LEADS",        sub:"Forms, ads & social media",          level:"02", ids:[6,7,8,9,10]    },
  { id:"automate-marketing", hub:"Marketing Hub",    icon:"⚙️", label:"AUTOMATE MARKETING",    sub:"Workflows, email & nurturing",       level:"03", ids:[11,12,13,14,15] },
  { id:"build-pipeline",     hub:"Sales Hub",        icon:"🏗️", label:"BUILD PIPELINE",        sub:"Deals, leads & forecast",           level:"04", ids:[16,17,18,19,20] },
  { id:"close-deals",        hub:"Sales Hub",        icon:"💰", label:"CLOSE MORE DEALS",      sub:"Sequences, quotes & playbooks",     level:"05", ids:[21,22,23,24,25] },
  { id:"scale-support",      hub:"Service Hub",      icon:"🎧", label:"SCALE SUPPORT",         sub:"HelpDesk, SLAs & knowledge base",   level:"06", ids:[26,27,28,29,30] },
  { id:"improve-retention",  hub:"Service Hub",      icon:"🔄", label:"IMPROVE RETENTION",     sub:"NPS, health scores & CSW",          level:"07", ids:[31,32,33,34]    },
  { id:"ai-breeze",          hub:"AI & Breeze",      icon:"🧠", label:"AI & BREEZE",           sub:"Copilot, AEO & enrichment",         level:"08", ids:[35,36,37,38,39] },
  { id:"agentic",            hub:"Agentic Platform", icon:"🤖", label:"AI AGENTS",             sub:"Prospecting & Customer agents",     level:"09", ids:[40,41,42]       },
];

const ADVENTURES = [
  { id:1,  hub:"Get Started",      uc:"get-started",        adv:"Portal welcome & navigation",           desc:"Tour the dashboard — where each section lives.",                    vid1:"https://app.hubspot.com/academy/53/shortvideo/1892747?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Explore the 3 main sections: CRM, Marketing and Reports." },
  { id:2,  hub:"Get Started",      uc:"get-started",        adv:"Company, users & permissions",          desc:"Configure company details and invite your team.",                   vid1:"https://app.hubspot.com/academy/53/shortvideo/7072817?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/2990176?language=EN&ruid=25879245", dur:"3 min", task:"Invite at least one team member and assign the correct role." },
  { id:3,  hub:"Get Started",      uc:"get-started",        adv:"Connect email & domain",                desc:"Link Gmail or Outlook and install the tracking pixel.",              vid1:"https://app.hubspot.com/academy/53/shortvideo/1843222?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/5891657?language=EN&ruid=25879245", dur:"3 min", task:"Connect your inbox and install the pixel on your website." },
  { id:4,  hub:"Get Started",      uc:"get-started",        adv:"CRM, properties & objects",             desc:"Explore Contacts, Companies, Deals and create properties.",          vid1:"https://app.hubspot.com/academy/53/shortvideo/14910058?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7750989?language=EN&ruid=25879245", dur:"6 min", task:"Create 3 custom properties relevant to your business." },
  { id:5,  hub:"Get Started",      uc:"get-started",        adv:"Validation & graduation",               desc:"Verify your portal is fully configured.",                           vid1:"", vid2:"", dur:"—", task:"Check all setup items. Share a screenshot of your portal." },
  { id:6,  hub:"Marketing Hub",    uc:"generate-leads",     adv:"Capture forms",                         desc:"Publish a form to capture leads into the CRM.",                     vid1:"https://app.hubspot.com/academy/53/shortvideo/2639657?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Create a form in Marketing > Forms and publish it." },
  { id:7,  hub:"Marketing Hub",    uc:"generate-leads",     adv:"Connect social media",                  desc:"Connect LinkedIn, Facebook, Instagram and X.",                      vid1:"https://app.hubspot.com/academy/53/shortvideo/2966058?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Publish 3 posts from HubSpot and set up a monitoring stream." },
  { id:8,  hub:"Marketing Hub",    uc:"generate-leads",     adv:"Connect ads",                           desc:"Connect Google Ads or Meta Ads to track real ROI.",                 vid1:"https://app.hubspot.com/academy/53/shortvideo/7144617?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/8488208?language=EN&ruid=25879245", dur:"5 min", task:"Connect ads account and create one audience from CRM contacts." },
  { id:9,  hub:"Marketing Hub",    uc:"generate-leads",     adv:"Lead scoring",                          desc:"Activate the automatic score to surface your hottest leads.",       vid1:"https://app.hubspot.com/academy/53/shortvideo/2673766?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/2673746?language=EN&ruid=25879245", dur:"7 min", task:"Define 5 scoring criteria and activate the score." },
  { id:10, hub:"Marketing Hub",    uc:"generate-leads",     adv:"First leads report",                    desc:"Build your first leads metrics dashboard.",                         vid1:"https://app.hubspot.com/academy/53/shortvideo/4675756?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/8633159?language=EN&ruid=25879245", dur:"4 min", task:"Open Traffic Analytics, filter 30 days, save to dashboard." },
  { id:11, hub:"Marketing Hub",    uc:"automate-marketing", adv:"First email campaign",                  desc:"Send a marketing email with personalization.",                      vid1:"https://academy.hubspot.com/lessons/getting-started-with-email-in-hubspot", vid2:"", dur:"—", task:"Create and send an email to at least 10 contacts." },
  { id:12, hub:"Marketing Hub",    uc:"automate-marketing", adv:"Active lists & segmentation",           desc:"Build dynamic segments that update automatically.",                 vid1:"https://app.hubspot.com/academy/53/shortvideo/8379147?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/1675279?language=EN&ruid=25879245", dur:"6 min", task:"Create 3 active lists: cold leads, hot leads, customers." },
  { id:13, hub:"Marketing Hub",    uc:"automate-marketing", adv:"First automated workflow",              desc:"Build a welcome flow triggered by form submission.",                vid1:"https://app.hubspot.com/academy/53/shortvideo/2371369?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7599257?language=EN&ruid=25879245", dur:"—", task:"Create a 2-step welcome workflow and activate it." },
  { id:14, hub:"Marketing Hub",    uc:"automate-marketing", adv:"Marketing automation & nurturing",      desc:"Create a 5-email sequence to warm up cold leads.",                  vid1:"https://app.hubspot.com/academy/53/shortvideo/9491375?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7142188?language=EN&ruid=25879245", dur:"6 min", task:"Build a nurturing sequence and launch to cold leads." },
  { id:15, hub:"Marketing Hub",    uc:"automate-marketing", adv:"A/B testing & optimization",           desc:"Test two subject lines and find the winner.",                       vid1:"https://academy.hubspot.com/lessons/improving-your-email-marketing-through-testing", vid2:"", dur:"18 min", task:"Create and launch an A/B test. Share your results." },
  { id:16, hub:"Sales Hub",        uc:"build-pipeline",     adv:"Design the pipeline",                   desc:"Map your sales process into HubSpot stages.",                       vid1:"https://app.hubspot.com/academy/53/shortvideo/3268964?language=EN&ruid=25879245", vid2:"", dur:"4 min", task:"Define your stages and set close probabilities." },
  { id:17, hub:"Sales Hub",        uc:"build-pipeline",     adv:"Create & manage leads",                 desc:"Load current opportunities into the CRM.",                          vid1:"https://app.hubspot.com/academy/53/shortvideo/7072820?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/8379181?language=EN&ruid=25879245", dur:"5 min", task:"Create 3 real leads with name, amount and close date." },
  { id:18, hub:"Sales Hub",        uc:"build-pipeline",     adv:"Tasks, notes & activities",             desc:"Log calls, notes and follow-ups in the deal timeline.",             vid1:"https://knowledge.hubspot.com/records/manually-log-activities-on-records", vid2:"", dur:"5 min", task:"Log a note, task and call for each of your leads." },
  { id:19, hub:"Sales Hub",        uc:"build-pipeline",     adv:"Lead assignment & team view",           desc:"Move leads in the Prospecting Workspace.",                          vid1:"https://knowledge.hubspot.com/records/how-to-set-a-record-owner", vid2:"", dur:"5 min", task:"Move 3 leads and configure automatic assignment." },
  { id:20, hub:"Sales Hub",        uc:"build-pipeline",     adv:"Pipeline report & forecast",            desc:"Build a sales dashboard with monthly forecast.",                    vid1:"https://app.hubspot.com/academy/53/shortvideo/1519169?language=EN&ruid=25879245", vid2:"https://academy.hubspot.com/lessons/hubspot-forecasting-analytics", dur:"3+17 min", task:"Build a pipeline dashboard. Identify your top 3 deals." },
  { id:21, hub:"Sales Hub",        uc:"close-deals",        adv:"Sales sequences",                       desc:"Create a 5-step prospecting cadence.",                              vid1:"https://app.hubspot.com/academy/53/shortvideo/3278876?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/19925820?language=EN&ruid=25879245", dur:"5 min", task:"Create a sequence and enroll one contact." },
  { id:22, hub:"Sales Hub",        uc:"close-deals",        adv:"Email templates library",               desc:"Build 5 reusable templates for every sales stage.",                 vid1:"https://app.hubspot.com/academy/53/shortvideo/1846274?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Build all 5 templates ready to use without editing." },
  { id:23, hub:"Sales Hub",        uc:"close-deals",        adv:"Quotes & CPQ",                          desc:"Load your catalog and send the first digital quote.",               vid1:"https://app.hubspot.com/academy/53/shortvideo/9739308?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Add products and send a quote from a real deal." },
  { id:24, hub:"Sales Hub",        uc:"close-deals",        adv:"Meeting links & call recording",        desc:"Create a meeting link and activate call recording.",                vid1:"https://app.hubspot.com/academy/53/shortvideo/1842560?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/1843219?language=EN&ruid=25879245", dur:"5 min", task:"Create your meeting link and add it to your signature." },
  { id:25, hub:"Sales Hub",        uc:"close-deals",        adv:"Sales playbook",                        desc:"Document your closing process in HubSpot.",                         vid1:"https://app.hubspot.com/academy/53/shortvideo/3475282?language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Create a playbook. Share your first deal WON." },
  { id:26, hub:"Service Hub",      uc:"scale-support",      adv:"HelpDesk setup",                        desc:"Connect support email and manage tickets by stage.",                vid1:"https://app.hubspot.com/academy/53/shortvideo/1527191?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7236352?language=EN&ruid=25879245", dur:"7 min", task:"Connect email to Helpdesk and move 3 tickets through stages." },
  { id:27, hub:"Service Hub",      uc:"scale-support",      adv:"Ticket pipeline & SLAs",                desc:"Activate minimum response times by priority.",                      vid1:"https://app.hubspot.com/academy/53/shortvideo/8525394?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Set SLAs: urgent 2h, normal 24h. Activate alerts." },
  { id:28, hub:"Service Hub",      uc:"scale-support",      adv:"Knowledge base",                        desc:"Publish your 3 most repeated questions as articles.",               vid1:"https://app.hubspot.com/academy/53/?overviewType=LESSON&overviewEntityId=21548560&overviewLanguage=EN&language=EN&ruid=25879245", vid2:"", dur:"3 min", task:"Publish 3 FAQ articles. Share the URLs." },
  { id:29, hub:"Service Hub",      uc:"scale-support",      adv:"Live chat & Customer Agent",            desc:"Activate chat and configure a welcome chatbot.",                    vid1:"https://app.hubspot.com/academy/53/shortvideo/8488212?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7256134?language=EN&ruid=25879245", dur:"6 min", task:"Activate chat widget and configure a welcome bot flow." },
  { id:30, hub:"Service Hub",      uc:"scale-support",      adv:"Feedback surveys",                      desc:"Activate post-ticket CSAT and build the support dashboard.",        vid1:"https://app.hubspot.com/academy/53/shortvideo/1526602?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Activate CSAT survey and build a support metrics dashboard." },
  { id:31, hub:"Service Hub",      uc:"improve-retention",  adv:"Automated NPS",                         desc:"Set up NPS to fire 30 days after first purchase.",                  vid1:"https://knowledge.hubspot.com/customer-feedback/create-and-send-customer-satisfaction-surveys", vid2:"", dur:"2 min", task:"Create NPS survey. Activate for at least 10 customers." },
  { id:32, hub:"Service Hub",      uc:"improve-retention",  adv:"Customer Success Workspace setup",      desc:"Organize and customize your CSW.",                                  vid1:"https://app.hubspot.com/academy/53/shortvideo/18476963?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7261070?language=EN&ruid=25879245", dur:"7 min", task:"Set up the CSW and update a customer record from within it." },
  { id:33, hub:"Service Hub",      uc:"improve-retention",  adv:"Health scores setup",                   desc:"Define risk signals and notify your team automatically.",           vid1:"https://app.hubspot.com/academy/53/shortvideo/7236353?language=EN&ruid=25879245", vid2:"", dur:"2 min", task:"Define 3 positive and 2 negative signals. Activate." },
  { id:34, hub:"Service Hub",      uc:"improve-retention",  adv:"Using the Customer Success Workspace",  desc:"Identify and act on at-risk customers.",                            vid1:"https://app.hubspot.com/academy/53/shortvideo/18477059?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/19955050?language=EN&ruid=25879245", dur:"3 min", task:"Filter CSW by risk. Email an at-risk customer from the workspace." },
  { id:35, hub:"AI & Breeze",      uc:"ai-breeze",          adv:"Breeze Assistant",                      desc:"Use AI to summarize deals, draft emails and analyze contacts.",     vid1:"https://app.hubspot.com/academy/53/shortvideo/10265672?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/20683865?language=EN&ruid=25879245", dur:"5 min", task:"Use Breeze for 5 different tasks. Document the time saved." },
  { id:36, hub:"AI & Breeze",      uc:"ai-breeze",          adv:"AI content generation",                 desc:"Generate and publish a blog post with the Content Agent.",          vid1:"https://app.hubspot.com/academy/53/shortvideo/1962753?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/20715533?language=EN&ruid=25879245", dur:"3 min", task:"Configure brand voice. Publish a blog post. Share the URL." },
  { id:37, hub:"AI & Breeze",      uc:"ai-breeze",          adv:"AEO — Answer Engine Optimization",      desc:"Measure your brand visibility in ChatGPT, Gemini, Perplexity.",    vid1:"https://app.hubspot.com/academy/53/shortvideo/18933062?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/18933067?language=EN&ruid=25879245", dur:"7 min", task:"Enter domain + 5 competitors. Review Brand Visibility Score." },
  { id:38, hub:"AI & Breeze",      uc:"ai-breeze",          adv:"Data enrichment",                       desc:"Enrich leads automatically and use intent signals.",                vid1:"https://app.hubspot.com/academy/53/shortvideo/18932397?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/14496335?language=EN&ruid=25879245", dur:"9 min", task:"Activate auto-enrichment. Enrich 20 key leads." },
  { id:39, hub:"AI & Breeze",      uc:"ai-breeze",          adv:"Predictive analytics",                  desc:"Activate predictive lead scoring and anomaly alerts.",              vid1:"https://app.hubspot.com/academy/53/shortvideo/10265663?language=EN&ruid=25879245", vid2:"", dur:"1 min", task:"Activate predictive scoring. Share one AI insight." },
  { id:40, hub:"Agentic Platform", uc:"agentic",            adv:"What are HubSpot agents?",              desc:"Understand agents vs automations.",                                 vid1:"https://app.hubspot.com/academy/53/shortvideo/5736559?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/21289130?language=EN&ruid=25879245", dur:"4 min", task:"Write: which process would you delegate to an agent first?" },
  { id:41, hub:"Agentic Platform", uc:"agentic",            adv:"Prospecting Agent",                     desc:"Configure the Selling Profile and enroll real prospects.",          vid1:"https://app.hubspot.com/academy/53/shortvideo/10265680?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/10266907?language=EN&ruid=25879245", dur:"8 min", task:"Configure Selling Profile. Enroll 5 contacts in Review mode." },
  { id:42, hub:"Agentic Platform", uc:"agentic",            adv:"Customer Agent",                        desc:"Create the support agent with KB and human handoff.",               vid1:"https://app.hubspot.com/academy/53/shortvideo/8488212?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/18933079?language=EN&ruid=25879245", dur:"—", task:"Create agent, connect KB, define handoff rules, activate." },
];

// ─── PIXEL COMPONENTS ────────────────────────────────────────────────────────
function PixelBorder({ color, children, style = {} }) {
  return (
    <div style={{
      position: "relative",
      background: C.bg2,
      border: `2px solid ${color}`,
      boxShadow: `0 0 0 2px ${C.bg}, 0 0 0 4px ${color}40, 4px 4px 0 0 ${color}30`,
      imageRendering: "pixelated",
      ...style,
    }}>
      {children}
    </div>
  );
}

function PixelButton({ label, color = C.salmon, onClick, disabled, size = "md", style = {} }) {
  const [pressed, setPressed] = useState(false);
  const sizes = {
    sm: { padding: "6px 12px", fontSize: "6px" },
    md: { padding: "10px 20px", fontSize: "8px" },
    lg: { padding: "14px 28px", fontSize: "10px" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        background: disabled ? C.bg3 : pressed ? color + "DD" : color,
        color: disabled ? C.muted : C.bg,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
        boxShadow: disabled ? "none" : pressed
          ? `2px 2px 0 0 ${color}50`
          : `4px 4px 0 0 ${color}50, 0 0 12px ${color}30`,
        transform: pressed ? "translate(2px, 2px)" : "none",
        transition: "transform 0.05s",
        imageRendering: "pixelated",
        letterSpacing: "0.5px",
        lineHeight: 1.4,
        ...sizes[size],
        ...style,
      }}>
      {label}
    </button>
  );
}

function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
    }} />
  );
}

function Blink({ children, speed = 800 }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVis(v => !v), speed);
    return () => clearInterval(t);
  }, [speed]);
  return <span style={{ opacity: vis ? 1 : 0 }}>{children}</span>;
}

function PixelProgress({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const blocks = 20;
  const filled = Math.round((pct / 100) * blocks);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8,
            background: i < filled ? color : C.bg3,
            boxShadow: i < filled ? `0 0 4px ${color}60` : "none",
          }} />
        ))}
      </div>
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 100);
    return () => clearInterval(t);
  }, []);

  const stars = useRef(Array.from({ length: 40 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() > 0.8 ? 2 : 1,
    speed: 0.3 + Math.random() * 0.4,
  }))).current;

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "40px 20px",
    }}>
      {/* starfield */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {stars.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(s.x + tick * s.speed * 0.05) % 100}%`,
            top: `${s.y}%`,
            width: s.size, height: s.size,
            background: `rgba(255,255,255,${0.3 + Math.random() * 0.4})`,
            imageRendering: "pixelated",
          }} />
        ))}
      </div>

      {/* logo */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(10px, 3vw, 20px)",
          color: C.salmon,
          textShadow: `0 0 20px ${C.salmon}80, 2px 2px 0 ${C.salmonD}`,
          marginBottom: 6,
          letterSpacing: 2,
        }}>
          SLACK
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(14px, 5vw, 36px)",
          color: C.text,
          textShadow: `0 0 30px ${C.teal}60, 3px 3px 0 rgba(0,0,0,0.8)`,
          letterSpacing: 3,
          lineHeight: 1.3,
          marginBottom: 4,
        }}>
          ADVENTURES
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(6px, 1.2vw, 9px)",
          color: C.teal,
          letterSpacing: 4,
          marginBottom: 48,
        }}>
          ACADEMY ONBOARDING
        </div>

        {/* pixel art HubSpot logo area */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 6, marginBottom: 48,
        }}>
          {["🚀","🧲","💰","🎧","🧠"].map((icon, i) => (
            <div key={i} style={{
              width: 40, height: 40,
              background: C.bg2,
              border: `2px solid ${Object.values(HUB_COLORS)[i].color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              boxShadow: `0 0 8px ${Object.values(HUB_COLORS)[i].color}40`,
              animation: `float ${1.2 + i * 0.2}s ease-in-out infinite alternate`,
            }}>
              {icon}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: 8,
            color: C.muted, lineHeight: 2.4, marginBottom: 24,
          }}>
            42 ADVENTURES  ·  9 ROUTES  ·  HUBSPOT ACADEMY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <PixelButton label="▶  GET STARTED" color={C.salmon} onClick={onStart} size="lg" />
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: C.muted }}>
            <Blink>INSERT COIN TO PLAY</Blink>
          </div>
        </div>

        <div style={{
          marginTop: 48,
          fontFamily: "'Press Start 2P'", fontSize: 6,
          color: C.muted, lineHeight: 2.5,
        }}>
          <span style={{ color: C.salmon }}>©</span> 2026 HUBSPOT ACADEMY ONBOARDING<br />
          ALL FEATURES RESERVED
        </div>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

// ─── SELECT SCREEN ───────────────────────────────────────────────────────────
function SelectScreen({ selected, onToggle, onStart, onBack }) {
  const [expanded, setExpanded] = useState({});
  const total = selected.length;
  const canStart = total >= 5;

  function toggleExpand(id) {
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      {/* top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: C.bg,
        borderBottom: `2px solid ${C.border}`,
        padding: "12px 24px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        boxShadow: `0 4px 20px rgba(0,0,0,0.8)`,
      }}>
        <button onClick={onBack} style={{
          fontFamily: "'Press Start 2P'", fontSize: 7, color: C.muted,
          background: "none", border: "none", cursor: "pointer",
        }}>◄ BACK</button>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: C.text, marginBottom: 4 }}>
            SELECT YOUR ADVENTURES
          </div>
          <PixelProgress value={total} max={10} color={canStart ? C.teal : C.salmon} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>
            <span style={{ color: canStart ? C.teal : C.yellow }}>{total}</span>
            <span style={{ color: C.muted }}>/10</span>
          </div>
          <PixelButton
            label="START ▶"
            color={canStart ? C.teal : C.muted}
            onClick={canStart ? onStart : undefined}
            disabled={!canStart}
            size="sm"
          />
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: 7,
          color: C.muted, marginBottom: 24, lineHeight: 2,
          textAlign: "center",
        }}>
          {total < 5
            ? `CHOOSE & MIX FROM ANY AREA — AT LEAST ${5 - total} MORE ADVENTURE${5 - total !== 1 ? "S" : ""} TO START`
            : total < 10
            ? `GREAT! YOU CAN ADD ${10 - total} MORE OR START YOUR ADVENTURE`
            : "MAX ADVENTURES SELECTED — READY TO PLAY!"}
        </div>

        {USE_CASES.map(uc => {
          const hub = HUB_COLORS[uc.hub];
          const isOpen = expanded[uc.id];
          const ucAdvs = ADVENTURES.filter(a => a.uc === uc.id);
          const selCount = ucAdvs.filter(a => selected.includes(a.id)).length;

          return (
            <div key={uc.id} style={{ marginBottom: 12 }}>
              {/* use case header */}
              <div
                onClick={() => toggleExpand(uc.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 18px",
                  background: isOpen ? C.bg2 : C.bg,
                  border: `2px solid ${isOpen ? hub.color : C.border}`,
                  boxShadow: isOpen ? `0 0 12px ${hub.color}30, 4px 4px 0 0 ${hub.color}20` : "4px 4px 0 0 rgba(0,0,0,0.5)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  userSelect: "none",
                }}>
                <div style={{
                  fontFamily: "'Press Start 2P'", fontSize: 7,
                  color: hub.color, minWidth: 28,
                }}>
                  LV{uc.level}
                </div>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{uc.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Press Start 2P'", fontSize: 8,
                    color: isOpen ? hub.color : C.text, marginBottom: 4,
                    textShadow: isOpen ? `0 0 8px ${hub.color}60` : "none",
                  }}>
                    {uc.label}
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted }}>
                    {uc.sub}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {selCount > 0 && (
                    <div style={{
                      fontFamily: "'Press Start 2P'", fontSize: 7,
                      color: C.teal,
                      background: C.bg3,
                      padding: "4px 8px",
                      border: `1px solid ${C.teal}`,
                    }}>
                      {selCount} ✓
                    </div>
                  )}
                  <div style={{
                    fontFamily: "'Press Start 2P'", fontSize: 9,
                    color: hub.color,
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                  }}>▶</div>
                </div>
              </div>

              {/* adventures list */}
              {isOpen && (
                <div style={{
                  border: `2px solid ${hub.color}`,
                  borderTop: "none",
                  background: C.bg2,
                  padding: "8px",
                }}>
                  {ucAdvs.map((adv, i) => {
                    const isSel = selected.includes(adv.id);
                    const maxed = selected.length >= 10 && !isSel;
                    return (
                      <div
                        key={adv.id}
                        onClick={() => !maxed && onToggle(adv.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "10px 14px",
                          marginBottom: 4,
                          background: isSel ? `${hub.color}15` : "transparent",
                          border: `2px solid ${isSel ? hub.color : C.border}`,
                          boxShadow: isSel ? `0 0 8px ${hub.color}30` : "none",
                          cursor: maxed ? "not-allowed" : "pointer",
                          opacity: maxed ? 0.4 : 1,
                          transition: "all 0.1s",
                          userSelect: "none",
                        }}>
                        {/* checkbox */}
                        <div style={{
                          width: 14, height: 14, flexShrink: 0,
                          border: `2px solid ${isSel ? hub.color : C.muted}`,
                          background: isSel ? hub.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: isSel ? `0 0 6px ${hub.color}80` : "none",
                        }}>
                          {isSel && <span style={{ fontSize: 8, color: C.bg, fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: "'Press Start 2P'", fontSize: 7,
                            color: isSel ? hub.color : C.text,
                            marginBottom: 4, lineHeight: 1.6,
                          }}>
                            {adv.adv}
                          </div>
                          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted, lineHeight: 1.8 }}>
                            {adv.desc.length > 55 ? adv.desc.slice(0,55)+"…" : adv.desc}
                          </div>
                        </div>
                        {adv.dur && adv.dur !== "—" && (
                          <div style={{
                            fontFamily: "'Press Start 2P'", fontSize: 6,
                            color: C.muted, flexShrink: 0,
                            border: `1px solid ${C.border}`,
                            padding: "3px 6px",
                          }}>
                            {adv.dur}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ADVENTURE CARD ──────────────────────────────────────────────────────────
function AdventureCard({ adv, idx, completed, onComplete }) {
  const [open, setOpen] = useState(false);
  const [ev, setEv] = useState("");
  const done = !!completed[adv.id];
  const hub = HUB_COLORS[adv.hub] || HUB_COLORS["Get Started"];

  return (
    <div style={{
      border: `2px solid ${done ? C.green : open ? hub.color : C.border}`,
      background: C.bg2,
      marginBottom: 8,
      boxShadow: done ? `0 0 12px ${C.green}30` : open ? `0 0 12px ${hub.color}20` : "4px 4px 0 0 rgba(0,0,0,0.5)",
      transition: "all 0.15s",
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", cursor: "pointer", userSelect: "none",
        }}>
        {/* number */}
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: 9,
          color: done ? C.green : hub.color,
          minWidth: 28, textAlign: "center",
          textShadow: done ? `0 0 8px ${C.green}80` : `0 0 8px ${hub.color}60`,
        }}>
          {done ? "✓" : String(idx + 1).padStart(2, "0")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: 8,
            color: done ? C.green : C.text, marginBottom: 4, lineHeight: 1.5,
          }}>
            {adv.adv}
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted, lineHeight: 1.8 }}>
            {adv.hub} · {adv.dur || "—"}
          </div>
        </div>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: 9,
          color: done ? C.green : hub.color,
          transform: open ? "rotate(90deg)" : "none",
          transition: "transform 0.2s",
        }}>▶</div>
      </div>

      {open && (
        <div style={{ borderTop: `2px solid ${C.border}`, padding: "16px 18px", background: C.bg }}>
          {/* description */}
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: 7, color: C.muted,
            lineHeight: 2, marginBottom: 16,
          }}>
            {adv.desc}
          </div>

          {/* videos */}
          {(adv.vid1 || adv.vid2) && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 6,
                color: hub.color, marginBottom: 8, letterSpacing: 1,
              }}>
                ▶ WATCH FIRST
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {adv.vid1 && (
                  <a href={adv.vid1} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: C.bg2, border: `2px solid ${hub.color}`,
                    padding: "8px 12px", textDecoration: "none",
                    boxShadow: `3px 3px 0 0 ${hub.color}30`,
                  }}>
                    <span style={{ fontSize: 14 }}>▶</span>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: hub.color }}>
                      {adv.vid2 ? "VIDEO PART 1" : "WATCH VIDEO"}
                      {adv.dur && adv.dur !== "—" ? ` · ${adv.dur}` : ""}
                    </span>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted }}>↗</span>
                  </a>
                )}
                {adv.vid2 && (
                  <a href={adv.vid2} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: C.bg2, border: `2px solid ${hub.color}`,
                    padding: "8px 12px", textDecoration: "none",
                    boxShadow: `3px 3px 0 0 ${hub.color}30`,
                  }}>
                    <span style={{ fontSize: 14 }}>▶</span>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: hub.color }}>VIDEO PART 2</span>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted }}>↗</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* task */}
          <div style={{
            background: C.bg2, border: `2px solid ${C.border}`,
            padding: "12px 14px", marginBottom: 14,
            boxShadow: "3px 3px 0 0 rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.yellow, marginBottom: 8, letterSpacing: 1 }}>
              🎯 YOUR MISSION
            </div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: C.text, lineHeight: 2 }}>
              {adv.task}
            </div>
          </div>

          {/* evidence — file/image upload */}
          {!done && (
            <>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>
                📎 SUBMIT EVIDENCE
              </div>

              {/* upload zone */}
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 10, padding: "20px 14px",
                background: ev ? `${hub.color}08` : C.bg2,
                border: `2px dashed ${ev ? hub.color : C.border}`,
                cursor: "pointer", transition: "all 0.2s",
                boxSizing: "border-box", width: "100%",
              }}>
                <input
                  type="file"
                  accept="image/*,.pdf,.png,.jpg,.jpeg,.gif,.webp"
                  style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = evt => setEv({ name: file.name, type: file.type, preview: evt.target.result });
                    reader.readAsDataURL(file);
                  }}
                />
                {!ev ? (
                  <>
                    <div style={{ fontSize: 28 }}>📁</div>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: C.muted, textAlign: "center", lineHeight: 2 }}>
                      CLICK TO UPLOAD<br />
                      <span style={{ fontSize: 6, color: C.muted }}>screenshot, image or PDF</span>
                    </div>
                  </>
                ) : (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    {ev.type?.startsWith("image/") ? (
                      <img
                        src={ev.preview}
                        alt="evidence preview"
                        style={{
                          maxWidth: "100%", maxHeight: 200,
                          border: `2px solid ${hub.color}`,
                          boxShadow: `0 0 12px ${hub.color}40`,
                          marginBottom: 8,
                        }}
                      />
                    ) : (
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px", background: C.bg3,
                        border: `2px solid ${hub.color}`, marginBottom: 8,
                      }}>
                        <span style={{ fontSize: 20 }}>📄</span>
                        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: hub.color }}>{ev.name}</span>
                      </div>
                    )}
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted }}>
                      ✓ {ev.name} — <span style={{ color: hub.color, cursor: "pointer" }} onClick={e => { e.preventDefault(); setEv(null); }}>CHANGE FILE</span>
                    </div>
                  </div>
                )}
              </label>

              <div style={{ marginTop: 10 }}>
                <PixelButton
                  label="✓ MISSION COMPLETE"
                  color={ev ? C.green : C.muted}
                  disabled={!ev}
                  onClick={() => { onComplete(adv.id, ev.name); setOpen(false); }}
                  size="md"
                />
              </div>
            </>
          )}
          {done && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: `${C.green}10`, border: `2px solid ${C.green}`,
              padding: "10px 14px",
              fontFamily: "'Press Start 2P'", fontSize: 7, color: C.green,
              boxShadow: `0 0 12px ${C.green}30`,
            }}>
              ✓ MISSION COMPLETE — GREAT WORK!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ADVENTURE SCREEN ─────────────────────────────────────────────────────────
function AdventureScreen({ selected, completed, onComplete, onChangeAdventures }) {
  const myAdvs = selected.map(id => ADVENTURES.find(a => a.id === id)).filter(Boolean);
  const totalDone = myAdvs.filter(a => completed[a.id]).length;
  const pct = myAdvs.length ? Math.round(totalDone / myAdvs.length * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex" }}>
      {/* sidebar */}
      <aside style={{
        width: 200, flexShrink: 0,
        background: C.bg2, borderRight: `2px solid ${C.border}`,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "16px 14px", borderBottom: `2px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: C.salmon, marginBottom: 4 }}>SLACK</div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: C.text, marginBottom: 2 }}>ADVENTURES</div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.teal, letterSpacing: 1 }}>ACADEMY</div>
        </div>

        <div style={{ padding: "12px 14px", flex: 1 }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted, marginBottom: 10, letterSpacing: 1 }}>
            MISSIONS
          </div>
          {myAdvs.map((adv, i) => {
            const done = !!completed[adv.id];
            const hub = HUB_COLORS[adv.hub] || HUB_COLORS["Get Started"];
            return (
              <div key={adv.id} style={{
                display: "flex", alignItems: "flex-start", gap: 6,
                padding: "5px 4px", marginBottom: 3,
                fontFamily: "'Press Start 2P'", fontSize: 6,
                color: done ? C.green : C.muted,
                lineHeight: 1.6,
              }}>
                <div style={{
                  width: 5, height: 5, marginTop: 1, flexShrink: 0,
                  background: done ? C.green : hub.color,
                  boxShadow: done ? `0 0 4px ${C.green}80` : "none",
                }} />
                <span style={{ flex: 1, wordBreak: "break-word" }}>
                  {adv.adv.length > 22 ? adv.adv.slice(0, 22) + "…" : adv.adv}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "12px 14px", borderTop: `2px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted, marginBottom: 6 }}>PROGRESS</div>
          <PixelProgress value={totalDone} max={myAdvs.length} color={pct === 100 ? C.green : C.salmon} />
          <div style={{ marginTop: 10 }}>
            <button onClick={onChangeAdventures} style={{
              fontFamily: "'Press Start 2P'", fontSize: 6, color: C.muted,
              background: "none", border: `1px solid ${C.border}`,
              padding: "5px 8px", cursor: "pointer", width: "100%",
            }}>
              ← CHANGE
            </button>
          </div>
        </div>
      </aside>

      {/* main */}
      <main style={{ flex: 1, padding: "28px 32px 60px", overflowY: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: 10,
            color: C.text, marginBottom: 6,
            textShadow: `2px 2px 0 ${C.bg}`,
          }}>
            YOUR ADVENTURE
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: C.muted, lineHeight: 2 }}>
            {myAdvs.length} MISSIONS · {totalDone} COMPLETED · {pct}% PROGRESS
          </div>
        </div>

        {/* progress bar */}
        <div style={{
          background: C.bg2, border: `2px solid ${C.border}`,
          padding: "12px 16px", marginBottom: 24,
          boxShadow: "4px 4px 0 0 rgba(0,0,0,0.5)",
        }}>
          <PixelProgress value={totalDone} max={myAdvs.length} color={pct === 100 ? C.green : C.salmon} />
        </div>

        {myAdvs.map((adv, i) => (
          <AdventureCard
            key={adv.id} adv={adv} idx={i}
            completed={completed}
            onComplete={(id, ev) => onComplete(id, ev)}
          />
        ))}

        {totalDone === myAdvs.length && myAdvs.length > 0 && (
          <div style={{
            background: C.bg2, border: `2px solid ${C.green}`,
            padding: "28px 24px", textAlign: "center", marginTop: 16,
            boxShadow: `0 0 30px ${C.green}40, 6px 6px 0 0 ${C.green}20`,
          }}>
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: 16,
              color: C.green, marginBottom: 16,
              textShadow: `0 0 20px ${C.green}80, 3px 3px 0 rgba(0,0,0,0.8)`,
              animation: "pulse 1s ease-in-out infinite alternate",
            }}>
              🏆 YOU WIN! 🏆
            </div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: C.text, lineHeight: 2.5 }}>
              ALL {myAdvs.length} MISSIONS COMPLETE<br />
              <span style={{ color: C.teal }}>SHARE YOUR PROGRESS IN</span><br />
              <span style={{ color: C.salmon }}>#ACADEMY-ONBOARDING</span>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          from { text-shadow: 0 0 20px ${C.green}80; }
          to { text-shadow: 0 0 40px ${C.green}, 0 0 60px ${C.green}60; }
        }
      `}</style>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]           = useState("home");
  const [selected, setSelected]   = useState([]);
  const [completed, setCompleted] = useState({});

  function toggle(id) {
    setSelected(p => p.includes(id)
      ? p.filter(x => x !== id)
      : p.length >= 10 ? p : [...p, id]
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.text}; }
        textarea { font-family: 'Press Start 2P', monospace !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border2}; }
        a { transition: opacity 0.15s; }
        a:hover { opacity: 0.8; }
      `}</style>
      <Scanlines />

      {view === "home" && (
        <HomeScreen onStart={() => setView("select")} />
      )}
      {view === "select" && (
        <SelectScreen
          selected={selected}
          onToggle={toggle}
          onStart={() => setView("adventure")}
          onBack={() => setView("home")}
        />
      )}
      {view === "adventure" && (
        <AdventureScreen
          selected={selected}
          completed={completed}
          onComplete={(id, ev) => setCompleted(p => ({ ...p, [id]: { ev, ts: Date.now() } }))}
          onChangeAdventures={() => setView("select")}
        />
      )}
    </>
  );
}
