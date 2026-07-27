import { useState, useRef, useEffect } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const P = {
  salmon:   "#FF7A59",
  salmonD:  "#E85E3A",
  salmonL:  "#FFF0EC",
  salmonM:  "#FFDDD5",
  obsidian: "#1A1A2E",
  ink:      "#2D2D3A",
  storm:    "#516F90",
  muted:    "#8A8A9A",
  fog:      "#E2E2DE",
  flint:    "#F5F5F0",
  white:    "#FFFFFF",
  sprout:   "#00A86B",
  sproutL:  "#E6F7F1",
};

const HUB = {
  "Get Started":      { color:"#FF7A59", bg:"#FFF0EC", border:"#FFDDD5" },
  "Marketing Hub":    { color:"#00897B", bg:"#E0F2F1", border:"#B2DFDB" },
  "Sales Hub":        { color:"#E65100", bg:"#FBE9E7", border:"#FFCCBC" },
  "Service Hub":      { color:"#4A4AFF", bg:"#EEF2FF", border:"#C7D2FE" },
  "AI & Breeze":      { color:"#7B2D8B", bg:"#F3E5F5", border:"#E1BEE7" },
  "Agentic Platform": { color:"#7B2D8B", bg:"#F3E5F5", border:"#E1BEE7" },
};

// ─── 42 ADVENTURES ───────────────────────────────────────────────────────────
const ADVENTURES = [
  { id:1,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Portal welcome and navigation",              desc:"Tour the dashboard — where each section lives and which tools are in your plan.",                           vid1:"https://app.hubspot.com/academy/53/shortvideo/1892747?language=EN&ruid=25879245",  vid2:"",                                                                                  dur:"3 min", task:"Explore the 3 main sections: CRM, Marketing and Reports. Note which tools are active in your plan." },
  { id:2,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Company, users and permissions",             desc:"Configure company details, invite your team, and assign the correct roles.",                               vid1:"https://app.hubspot.com/academy/53/shortvideo/7072817?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/2990176?language=EN&ruid=25879245",  dur:"3 min", task:"Update company details, invite at least one team member, and assign the correct role." },
  { id:3,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Connect email and domain",                   desc:"Link Gmail or Outlook and install the HubSpot tracking pixel on your website.",                            vid1:"https://app.hubspot.com/academy/53/shortvideo/1843222?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/5891657?language=EN&ruid=25879245",  dur:"3 min", task:"Connect your inbox in Settings, then install the tracking pixel on your website." },
  { id:4,  hub:"Get Started",      route:"Get started with HubSpot", adv:"CRM, properties and objects",                desc:"Explore Contacts, Companies and Deals, then create custom properties for your industry.",                    vid1:"https://app.hubspot.com/academy/53/shortvideo/14910058?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7750989?language=EN&ruid=25879245",  dur:"6 min", task:"Explore all three CRM objects. Create 3 custom properties relevant to your business." },
  { id:5,  hub:"Get Started",      route:"Get started with HubSpot", adv:"Validation and graduation",                  desc:"Verify everything is configured correctly and share a screenshot as evidence.",                            vid1:"", vid2:"", dur:"", task:"Check: company logo and currency set, team member invited, pixel active. Share a screenshot." },
  { id:6,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Capture forms",                              desc:"Create and publish a form on your website to capture leads straight into the CRM.",                        vid1:"https://app.hubspot.com/academy/53/shortvideo/2639657?language=EN&ruid=25879245",  vid2:"", dur:"3 min", task:"Go to Marketing > Forms. Create a form with the right fields and publish it on your website." },
  { id:7,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Connect social media",                       desc:"Connect LinkedIn, Facebook, Instagram and X to publish and monitor from HubSpot.",                        vid1:"https://app.hubspot.com/academy/53/shortvideo/2966058?language=EN&ruid=25879245",  vid2:"", dur:"2 min", task:"Connect your social accounts in Marketing > Social. Publish 3 posts and set up one monitoring stream." },
  { id:8,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Connect ads",                                desc:"Connect Google Ads or Meta Ads to see which campaigns generate real customers.",                           vid1:"https://app.hubspot.com/academy/53/shortvideo/7144617?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/8488208?language=EN&ruid=25879245",  dur:"5 min", task:"Connect ads account in Marketing > Ads. Create one audience from CRM contacts and review the ROI report." },
  { id:9,  hub:"Marketing Hub",    route:"Generate leads",            adv:"Lead scoring",                               desc:"Define scoring criteria and activate the automatic score to surface your hottest leads.",                   vid1:"https://app.hubspot.com/academy/53/shortvideo/2673766?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/2673746?language=EN&ruid=25879245",  dur:"7 min", task:"Go to CRM > Properties > HubSpot Score. Define 5 criteria and activate the score." },
  { id:10, hub:"Marketing Hub",    route:"Generate leads",            adv:"First leads report",                         desc:"Review traffic sources and build your first leads metrics dashboard.",                                    vid1:"https://app.hubspot.com/academy/53/shortvideo/4675756?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/8633159?language=EN&ruid=25879245",  dur:"4 min", task:"Open Reports > Traffic Analytics, filter by the last 30 days, save the report to your dashboard." },
  { id:11, hub:"Marketing Hub",    route:"Automate marketing",        adv:"First email campaign",                       desc:"Create and send a marketing email with personalization and a custom template.",                            vid1:"https://academy.hubspot.com/lessons/getting-started-with-email-in-hubspot",        vid2:"", dur:"", task:"Create an email in Marketing > Email, personalize it with {firstname}, send to at least 10 contacts." },
  { id:12, hub:"Marketing Hub",    route:"Automate marketing",        adv:"Active lists and segmentation",              desc:"Build dynamic segments that update automatically: cold leads, hot leads, customers.",                       vid1:"https://app.hubspot.com/academy/53/shortvideo/8379147?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/1675279?language=EN&ruid=25879245",  dur:"6 min", task:"Create 3 active lists: cold leads (30 days no activity), hot leads (score > 50), current customers." },
  { id:13, hub:"Marketing Hub",    route:"Automate marketing",        adv:"First automated workflow",                   desc:"Build a welcome flow that sends emails when someone submits a form.",                                     vid1:"https://app.hubspot.com/academy/53/shortvideo/2371369?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/7599257?language=EN&ruid=25879245",  dur:"", task:"Create a workflow triggered by form submission. Add a welcome email, wait 2 days, add a second. Activate." },
  { id:14, hub:"Marketing Hub",    route:"Automate marketing",        adv:"Marketing automation and nurturing",         desc:"Create a 5-email sequence to convert cold leads into warm ones.",                                          vid1:"https://app.hubspot.com/academy/53/shortvideo/9491375?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/7142188?language=EN&ruid=25879245",  dur:"6 min", task:"Build a nurturing sequence: education, case study, soft CTA, direct CTA. Launch to your cold leads list." },
  { id:15, hub:"Marketing Hub",    route:"Automate marketing",        adv:"A/B testing and optimization",               desc:"Test two subject lines and analyze which generates more opens.",                                           vid1:"https://academy.hubspot.com/lessons/improving-your-email-marketing-through-testing",vid2:"", dur:"18 min", task:"Create an A/B test on your next email, test two subject lines, share your results." },
  { id:16, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Design the pipeline",                        desc:"Map your sales process into HubSpot stages with close probabilities.",                                   vid1:"https://app.hubspot.com/academy/53/shortvideo/3268964?language=EN&ruid=25879245",  vid2:"", dur:"4 min", task:"Go to CRM > Deals > Pipelines. Define your stages from your real sales process and set probabilities." },
  { id:17, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Create and manage leads",                    desc:"Load your current opportunities as leads associated to contacts and companies.",                          vid1:"https://app.hubspot.com/academy/53/shortvideo/7072820?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/8379181?language=EN&ruid=25879245",  dur:"5 min", task:"Create 3 real leads with name, amount, and close date. Associate each to a contact and company." },
  { id:18, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Tasks, notes and activities",                desc:"Log calls, notes and follow-ups in the deal timeline.",                                                  vid1:"https://knowledge.hubspot.com/records/manually-log-activities-on-records",          vid2:"", dur:"5 min", task:"For each lead: log a note, schedule a follow-up task, and record a call or email." },
  { id:19, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Lead assignment and team view",              desc:"Move leads in the Prospecting Workspace and configure automatic round-robin assignment.",                  vid1:"https://knowledge.hubspot.com/records/how-to-set-a-record-owner",                   vid2:"", dur:"5 min", task:"Move 3 leads through the Prospecting Workspace and configure automatic lead assignment." },
  { id:20, hub:"Sales Hub",        route:"Build a pipeline",          adv:"Pipeline report and forecast",               desc:"Build a sales dashboard with the projected close amount for the month.",                                  vid1:"https://app.hubspot.com/academy/53/shortvideo/1519169?language=EN&ruid=25879245",  vid2:"https://academy.hubspot.com/lessons/hubspot-forecasting-analytics",                dur:"3+17 min", task:"Build a pipeline dashboard. Identify your top 3 deals most likely to close this month." },
  { id:21, hub:"Sales Hub",        route:"Close more deals",          adv:"Sales sequences",                            desc:"Create a 5-step prospecting cadence and enroll the first real contact.",                                  vid1:"https://app.hubspot.com/academy/53/shortvideo/3278876?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/19925820?language=EN&ruid=25879245",  dur:"5 min", task:"Create a 5-step sequence and enroll one contact. Share the sequence name and first subject line." },
  { id:22, hub:"Sales Hub",        route:"Close more deals",          adv:"Email templates library",                    desc:"Build 5 reusable templates: prospecting, follow-up, closing, post-meeting, referral.",                    vid1:"https://app.hubspot.com/academy/53/shortvideo/1846274?language=EN&ruid=25879245",  vid2:"", dur:"3 min", task:"Build all 5 templates in Sales > Templates. Each should be ready to use without editing." },
  { id:23, hub:"Sales Hub",        route:"Close more deals",          adv:"Quotes and CPQ",                             desc:"Load your product catalog and send the first digital quote from a deal.",                                 vid1:"https://app.hubspot.com/academy/53/shortvideo/9739308?language=EN&ruid=25879245",  vid2:"", dur:"3 min", task:"Add products to the catalog and send a quote attached to a real deal. Share the quote link." },
  { id:24, hub:"Sales Hub",        route:"Close more deals",          adv:"Meeting links and call recording",           desc:"Create a meeting link, activate call recording and book the first meeting.",                               vid1:"https://app.hubspot.com/academy/53/shortvideo/1842560?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/1843219?language=EN&ruid=25879245",  dur:"5 min", task:"Create your meeting link, add it to your signature, activate call recording. Share meetings booked." },
  { id:25, hub:"Sales Hub",        route:"Close more deals",          adv:"Sales playbook",                             desc:"Document your closing process in a HubSpot playbook.",                                                   vid1:"https://app.hubspot.com/academy/53/shortvideo/3475282?language=EN&ruid=25879245",  vid2:"", dur:"3 min", task:"Create a playbook with your closing process. Share your first deal WON as graduation evidence." },
  { id:26, hub:"Service Hub",      route:"Scale support",             adv:"HelpDesk setup",                             desc:"Connect your support email to the Helpdesk and manage tickets by stage.",                                 vid1:"https://app.hubspot.com/academy/53/shortvideo/1527191?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/7236352?language=EN&ruid=25879245",  dur:"7 min", task:"Connect support email to Helpdesk and move 3 tickets through stages. Share a screenshot." },
  { id:27, hub:"Service Hub",      route:"Scale support",             adv:"Ticket pipeline and SLAs",                   desc:"Customize support stages and activate minimum response times by priority.",                               vid1:"https://app.hubspot.com/academy/53/shortvideo/8525394?language=EN&ruid=25879245",  vid2:"", dur:"2 min", task:"Set up ticket stages and SLAs: urgent 2h, normal 24h. Activate SLA alerts." },
  { id:28, hub:"Service Hub",      route:"Scale support",             adv:"Knowledge base",                             desc:"Publish your 3 most repeated questions so customers can help themselves.",                                 vid1:"https://app.hubspot.com/academy/53/?overviewType=LESSON&overviewEntityId=21548560&overviewLanguage=EN&language=EN&ruid=25879245",vid2:"",dur:"3 min",task:"Go to Service > Knowledge Base. Publish 3 FAQ articles and share the URLs." },
  { id:29, hub:"Service Hub",      route:"Scale support",             adv:"Live chat and Customer Agent",               desc:"Activate the chat widget and configure a welcome chatbot flow.",                                          vid1:"https://app.hubspot.com/academy/53/shortvideo/8488212?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/7256134?language=EN&ruid=25879245",  dur:"6 min", task:"Activate the live chat widget and configure a welcome chatbot flow on your website." },
  { id:30, hub:"Service Hub",      route:"Scale support",             adv:"Feedback surveys",                           desc:"Activate a post-ticket satisfaction survey and build the support dashboard.",                              vid1:"https://app.hubspot.com/academy/53/shortvideo/1526602?language=EN&ruid=25879245",  vid2:"", dur:"2 min", task:"Activate the post-ticket CSAT survey. Build a support dashboard with response time and CSAT." },
  { id:31, hub:"Service Hub",      route:"Improve retention",         adv:"Automated NPS",                              desc:"Set up an NPS survey that fires automatically 30 days after first purchase.",                             vid1:"https://knowledge.hubspot.com/customer-feedback/create-and-send-customer-satisfaction-surveys",vid2:"",dur:"2 min",task:"Create an NPS survey triggered 30 days after purchase. Activate for at least 10 customers." },
  { id:32, hub:"Service Hub",      route:"Improve retention",         adv:"Customer Success Workspace setup",           desc:"Organize and customize your Customer Success Workspace.",                                                 vid1:"https://app.hubspot.com/academy/53/shortvideo/18476963?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/7261070?language=EN&ruid=25879245",  dur:"7 min", task:"Open the CSW, customize it for your team, and update a customer record from within it." },
  { id:33, hub:"Service Hub",      route:"Improve retention",         adv:"Health scores setup",                        desc:"Define risk signals and activate notifications for at-risk customers.",                                   vid1:"https://app.hubspot.com/academy/53/shortvideo/7236353?language=EN&ruid=25879245",  vid2:"", dur:"2 min", task:"Define 3 positive signals and 2 negative signals. Activate your first health score." },
  { id:34, hub:"Service Hub",      route:"Improve retention",         adv:"Using the Customer Success Workspace",       desc:"Use the CSW to manage retention and identify customers at risk.",                                         vid1:"https://app.hubspot.com/academy/53/shortvideo/18477059?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/19955050?language=EN&ruid=25879245",  dur:"3 min", task:"Filter the CSW by risk level. Send an email to an at-risk customer from within the workspace." },
  { id:35, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"Breeze Assistant",                           desc:"Use the AI assistant to summarize deals, draft emails, and analyze contacts.",                            vid1:"https://app.hubspot.com/academy/53/shortvideo/10265672?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/20683865?language=EN&ruid=25879245",  dur:"5 min", task:"Use Breeze for 5 tasks: summarize a deal, draft an email, analyze a contact, suggest a workflow, document time saved." },
  { id:36, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"AI content generation",                      desc:"Configure brand voice and generate a blog post with the Content Agent.",                                 vid1:"https://app.hubspot.com/academy/53/shortvideo/1962753?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/20715533?language=EN&ruid=25879245",  dur:"3 min", task:"Configure brand voice in Settings. Generate a blog post with the Content Agent, publish it, share the URL." },
  { id:37, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"AEO — Answer Engine Optimization",           desc:"Measure how often your brand appears in ChatGPT, Gemini and Perplexity.",                                  vid1:"https://app.hubspot.com/academy/53/shortvideo/18933062?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/18933067?language=EN&ruid=25879245",  dur:"7 min", task:"Go to Marketing > AEO. Enter your domain and 5 competitors. Review your Brand Visibility Score." },
  { id:38, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"Data enrichment",                            desc:"Enrich your top leads with automatic data and use intent signals to prioritize.",                          vid1:"https://app.hubspot.com/academy/53/shortvideo/18932397?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/14496335?language=EN&ruid=25879245",  dur:"9 min", task:"Activate auto-enrichment in Settings > Breeze Intelligence. Enrich 20 key leads, use intent to prioritize." },
  { id:39, hub:"AI & Breeze",      route:"AI and Breeze",             adv:"Predictive analytics",                       desc:"Activate predictive lead scoring and configure anomaly alerts.",                                          vid1:"https://app.hubspot.com/academy/53/shortvideo/10265663?language=EN&ruid=25879245", vid2:"", dur:"1 min", task:"Activate Predictive Lead Scoring and set up anomaly alerts. Share one insight the AI found." },
  { id:40, hub:"Agentic Platform", route:"AI agents",                 adv:"What are HubSpot agents?",                   desc:"Understand the difference between automations and agents.",                                               vid1:"https://app.hubspot.com/academy/53/shortvideo/5736559?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/21289130?language=EN&ruid=25879245",  dur:"4 min", task:"Watch both videos. Write here: which process would you delegate to an agent first and why?" },
  { id:41, hub:"Agentic Platform", route:"AI agents",                 adv:"Prospecting Agent",                          desc:"Configure the Selling Profile and enroll real prospects in Review mode.",                                 vid1:"https://app.hubspot.com/academy/53/shortvideo/10265680?language=EN&ruid=25879245", vid2:"https://app.hubspot.com/academy/53/shortvideo/10266907?language=EN&ruid=25879245",  dur:"8 min", task:"Configure your Selling Profile. Enroll 5 contacts in Review mode and approve at least 3 emails." },
  { id:42, hub:"Agentic Platform", route:"AI agents",                 adv:"Customer Agent",                             desc:"Create the support agent, connect it to your KB and activate with human handoff.",                          vid1:"https://app.hubspot.com/academy/53/shortvideo/8488212?language=EN&ruid=25879245",  vid2:"https://app.hubspot.com/academy/53/shortvideo/18933079?language=EN&ruid=25879245",  dur:"", task:"Create the Customer Agent, connect your KB, define handoff rules, activate in Review mode." },
];

// ─── AI CHAT ─────────────────────────────────────────────────────────────────
function AIChat({ adv }) {
  const hub = HUB[adv.hub] || HUB["Get Started"];
  const [msgs, setMsgs] = useState([{ role:"bot", text:`Ask me anything about "${adv.adv}" or HubSpot in general.` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), [msgs]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput(""); setLoading(true);
    setMsgs(p => [...p, { role:"user", text:q }]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:300,
          system:`You help HubSpot users with onboarding. Current adventure: "${adv.adv}". Task: ${adv.task}. Be concise, practical, HubSpot-specific. Max 90 words.`,
          messages:[...msgs.filter((_,i)=>i>0).map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text})),{role:"user",content:q}]
        })
      });
      const d = await res.json();
      setMsgs(p => [...p, { role:"bot", text:d.content?.[0]?.text||"Try again." }]);
    } catch { setMsgs(p => [...p, { role:"bot", text:"Something went wrong." }]); }
    setLoading(false);
  }

  return (
    <div style={{background:P.flint, borderLeft:`2px solid ${hub.border}`, display:"flex", flexDirection:"column", minHeight:280}}>
      <div style={{padding:"10px 14px", borderBottom:`1px solid ${P.fog}`, display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:P.ink}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:hub.color}} />
        AI assistant
        <span style={{marginLeft:"auto",fontSize:11,color:P.muted,fontWeight:400}}>Ask anything</span>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:9,maxHeight:220}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{width:26,height:26,borderRadius:6,background:m.role==="bot"?hub.bg:P.fog,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,flexShrink:0,color:m.role==="bot"?hub.color:P.storm}}>
              {m.role==="bot"?"AI":"Me"}
            </div>
            <div style={{background:m.role==="bot"?P.white:P.white,border:`1px solid ${P.fog}`,borderRadius:"0 8px 8px 8px",padding:"7px 10px",fontSize:13,color:P.ink,lineHeight:1.55,flex:1}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:26,height:26,borderRadius:6,background:hub.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:hub.color}}>AI</div><span style={{fontSize:12,color:P.muted}}>Thinking…</span></div>}
        <div ref={endRef} />
      </div>
      <div style={{padding:"9px 10px",borderTop:`1px solid ${P.fog}`,display:"flex",gap:6}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask a question…" disabled={loading}
          style={{flex:1,background:P.white,border:`1px solid ${P.fog}`,borderRadius:7,padding:"7px 10px",fontSize:13,color:P.ink,fontFamily:"inherit",outline:"none"}} />
        <button onClick={send} disabled={loading||!input.trim()}
          style={{background:input.trim()&&!loading?P.salmon:"#E2E2DE",border:"none",borderRadius:7,padding:"7px 12px",color:input.trim()&&!loading?P.white:P.muted,cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:12,fontWeight:600,fontFamily:"inherit",transition:"all 0.2s"}}>
          Send
        </button>
      </div>
    </div>
  );
}

// ─── ADVENTURE CARD (in My Adventure view) ───────────────────────────────────
function AdventureCard({ adv, idx, completed, onComplete }) {
  const [open, setOpen] = useState(false);
  const [ev, setEv] = useState("");
  const done = !!completed[adv.id];
  const hub = HUB[adv.hub] || HUB["Get Started"];

  return (
    <div style={{background:P.white, border:`1px solid ${done?"#B2DFDB":P.fog}`, borderRadius:12, overflow:"hidden", marginBottom:8, transition:"border-color 0.2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",userSelect:"none"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{width:28,height:28,borderRadius:"50%",background:done?P.sproutL:hub.bg,color:done?P.sprout:hub.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>
          {done?"✓":idx+1}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,color:P.ink,marginBottom:2}}>{adv.adv}</div>
          <div style={{fontSize:12,color:P.muted}}>{adv.desc.length>68?adv.desc.slice(0,68)+"…":adv.desc}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          {adv.dur&&<span style={{fontSize:11,color:P.muted,background:P.flint,padding:"2px 7px",borderRadius:6}}>{adv.dur}</span>}
          <span style={{fontSize:15}}>{done?"✅":"○"}</span>
          <span style={{color:P.muted,fontSize:12,transition:"transform 0.2s",transform:open?"rotate(180deg)":"none"}}>▾</span>
        </div>
      </div>

      {open && (
        <div style={{borderTop:`1px solid ${P.fog}`,display:"grid",gridTemplateColumns:"1fr 280px"}}>
          <div style={{padding:"16px 18px",background:P.flint}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",color:P.muted,marginBottom:6}}>About</p>
            <p style={{fontSize:13,color:P.storm,lineHeight:1.65,marginBottom:14}}>{adv.desc}</p>

            {(adv.vid1||adv.vid2)&&<>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",color:P.muted,marginBottom:7}}>Watch first</p>
              {adv.vid1&&<a href={adv.vid1} target="_blank" rel="noreferrer"
                style={{display:"flex",alignItems:"center",gap:10,background:P.white,border:`1px solid ${P.fog}`,borderRadius:9,padding:"10px 13px",textDecoration:"none",color:P.ink,marginBottom:6}}>
                <div style={{width:30,height:30,borderRadius:6,background:hub.bg,display:"flex",alignItems:"center",justifyContent:"center",color:hub.color,fontSize:14}}>▶</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>Watch video{adv.vid2?" — part 1":""}</div>
                  <div style={{fontSize:11,color:P.muted}}>HubSpot Academy{adv.dur?` · ${adv.dur}`:""}</div>
                </div>
                <span style={{fontSize:11,color:P.muted}}>↗</span>
              </a>}
              {adv.vid2&&<a href={adv.vid2} target="_blank" rel="noreferrer"
                style={{display:"flex",alignItems:"center",gap:10,background:P.white,border:`1px solid ${P.fog}`,borderRadius:9,padding:"10px 13px",textDecoration:"none",color:P.ink,marginBottom:6}}>
                <div style={{width:30,height:30,borderRadius:6,background:hub.bg,display:"flex",alignItems:"center",justifyContent:"center",color:hub.color,fontSize:14}}>▶</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>Watch video — part 2</div>
                  <div style={{fontSize:11,color:P.muted}}>HubSpot Academy · additional resource</div>
                </div>
                <span style={{fontSize:11,color:P.muted}}>↗</span>
              </a>}
            </>}

            <div style={{background:P.white,border:`1px solid ${P.fog}`,borderRadius:9,padding:"12px 14px",marginTop:10}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",color:P.muted,marginBottom:6}}>Your task</p>
              <p style={{fontSize:13,color:P.ink,lineHeight:1.7}}>{adv.task}</p>
            </div>

            {!done&&<>
              <p style={{fontSize:12,fontWeight:600,color:P.storm,margin:"12px 0 5px"}}>Share your evidence</p>
              <textarea value={ev} onChange={e=>setEv(e.target.value)} placeholder="URL, screenshot description, or a note about what you did…"
                style={{width:"100%",background:P.white,border:`1px solid ${ev.trim()?P.salmon:P.fog}`,borderRadius:8,padding:"9px 11px",fontSize:13,color:P.ink,fontFamily:"inherit",resize:"vertical",minHeight:58,outline:"none",transition:"border-color 0.2s"}} />
              <button onClick={()=>{onComplete(adv.id,ev);setOpen(false);}} disabled={!ev.trim()}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",marginTop:8,padding:11,borderRadius:9,fontSize:13,fontWeight:700,cursor:ev.trim()?"pointer":"not-allowed",border:"none",background:ev.trim()?P.salmon:P.fog,color:ev.trim()?P.white:P.muted,fontFamily:"inherit",transition:"all 0.2s"}}>
                Mark as completed ✓
              </button>
            </>}
            {done&&<div style={{display:"flex",alignItems:"center",gap:7,background:P.sproutL,border:`1px solid #B2DFDB`,borderRadius:9,padding:"10px 14px",marginTop:10,fontSize:13,fontWeight:600,color:P.sprout}}>
              ✅ Adventure completed — great work!
            </div>}
          </div>
          <AIChat adv={adv} />
        </div>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]         = useState("home");    // home | pick | adventure
  const [selected, setSelected] = useState([]);        // adventure ids
  const [completed, setCompleted] = useState({});
  const [filter, setFilter]     = useState("All");

  const myAdvs    = selected.map(id => ADVENTURES.find(a=>a.id===id)).filter(Boolean);
  const totalDone = myAdvs.filter(a=>completed[a.id]).length;
  const pct       = myAdvs.length ? Math.round(totalDone/myAdvs.length*100) : 0;

  const hubs = ["All", ...Array.from(new Set(ADVENTURES.map(a=>a.hub)))];
  const filtered = filter==="All" ? ADVENTURES : ADVENTURES.filter(a=>a.hub===filter);

  function toggle(id) {
    setSelected(p => p.includes(id)
      ? p.filter(x=>x!==id)
      : p.length>=10 ? p
      : [...p, id]
    );
  }

  const canStart = selected.length >= 5;

  // ── HOME ─────────────────────────────────────────────────────────────────
  if (view==="home") return (
    <div style={{fontFamily:"'Inter',sans-serif",background:P.white,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 40px",textAlign:"center"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{width:56,height:56,borderRadius:16,background:P.salmon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:24}}>🗺️</div>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:P.salmon,marginBottom:14}}>Academy Onboarding</div>
      <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:36,fontWeight:700,letterSpacing:"-.6px",lineHeight:1.15,color:P.obsidian,marginBottom:14,maxWidth:520}}>
        Build your HubSpot<br/>adventure your way
      </h1>
      <p style={{fontSize:16,color:P.storm,lineHeight:1.7,maxWidth:460,marginBottom:40}}>
        Pick the adventures that match your goals — between 5 and 10. Each one comes with a HubSpot Academy video and a concrete task to complete in your portal.
      </p>
      <button onClick={()=>setView("pick")}
        style={{padding:"14px 36px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",border:"none",background:P.salmon,color:P.white,fontFamily:"inherit",letterSpacing:"-.2px"}}>
        Get started →
      </button>
      <p style={{fontSize:12,color:P.muted,marginTop:14}}>42 adventures · 9 routes · HubSpot Academy content</p>
    </div>
  );

  // ── PICK ─────────────────────────────────────────────────────────────────
  if (view==="pick") return (
    <div style={{fontFamily:"'Inter',sans-serif",background:P.flint,minHeight:"100vh"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#D4D4CE;border-radius:4px}`}</style>

      {/* sticky top bar */}
      <div style={{position:"sticky",top:0,zIndex:10,background:P.white,borderBottom:`1px solid ${P.fog}`,padding:"14px 40px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:700,color:P.obsidian}}>
          Choose your adventures
        </div>
        <div style={{flex:1}} />
        <span style={{fontSize:13,color:P.storm}}>
          <strong style={{color:selected.length<5?P.salmon:P.sprout}}>{selected.length}</strong> of 10 selected
          {selected.length<5&&<span style={{color:P.muted}}> · pick at least {5-selected.length} more</span>}
          {selected.length>=5&&selected.length<10&&<span style={{color:P.muted}}> · you can add {10-selected.length} more</span>}
          {selected.length===10&&<span style={{color:P.salmon}}> · maximum reached</span>}
        </span>
        <button onClick={()=>canStart&&setView("adventure")} disabled={!canStart}
          style={{padding:"9px 22px",borderRadius:8,fontSize:13,fontWeight:700,cursor:canStart?"pointer":"not-allowed",border:"none",background:canStart?P.salmon:P.fog,color:canStart?P.white:P.muted,fontFamily:"inherit",transition:"all 0.2s"}}>
          Start my adventure →
        </button>
      </div>

      <div style={{padding:"28px 40px 60px"}}>
        {/* filter pills */}
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:24}}>
          {hubs.map(h=>(
            <button key={h} onClick={()=>setFilter(h)}
              style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",border:`1px solid ${filter===h?P.salmon:P.fog}`,background:filter===h?P.salmonL:P.white,color:filter===h?P.salmonD:P.storm,fontFamily:"inherit",transition:"all 0.15s"}}>
              {h}
            </button>
          ))}
        </div>

        {/* adventure grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
          {filtered.map(adv=>{
            const sel = selected.includes(adv.id);
            const maxed = selected.length>=10 && !sel;
            const hub = HUB[adv.hub]||HUB["Get Started"];
            return (
              <div key={adv.id} onClick={()=>!maxed&&toggle(adv.id)}
                style={{background:sel?P.salmonL:P.white,border:`1.5px solid ${sel?P.salmon:P.fog}`,borderRadius:12,padding:"14px 15px",cursor:maxed?"not-allowed":"pointer",opacity:maxed?0.45:1,transition:"all 0.18s",position:"relative",userSelect:"none"}}>
                {sel&&<div style={{position:"absolute",top:11,right:11,width:20,height:20,borderRadius:"50%",background:P.salmon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:P.white,fontWeight:700}}>✓</div>}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:hub.bg,color:hub.color,border:`1px solid ${hub.border}`}}>{adv.hub}</span>
                  {adv.dur&&<span style={{fontSize:11,color:P.muted,marginLeft:"auto"}}>⏱ {adv.dur}</span>}
                </div>
                <div style={{fontSize:14,fontWeight:600,color:sel?P.salmonD:P.ink,marginBottom:4,lineHeight:1.3}}>{adv.adv}</div>
                <div style={{fontSize:12,color:P.storm,lineHeight:1.5}}>{adv.desc.length>72?adv.desc.slice(0,72)+"…":adv.desc}</div>
                <div style={{fontSize:11,color:P.muted,marginTop:8}}>Route: {adv.route}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── ADVENTURE ─────────────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:P.flint,minHeight:"100vh",display:"flex"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#D4D4CE;border-radius:4px}`}</style>

      {/* sidebar */}
      <aside style={{width:240,flexShrink:0,background:P.white,borderRight:`1px solid ${P.fog}`,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${P.fog}`}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:700,color:P.obsidian}}>
            Slack <span style={{color:P.salmon}}>Adventures</span>
          </div>
          <div style={{fontSize:11,color:P.muted,marginTop:2}}>Academy Onboarding</div>
        </div>

        <div style={{padding:"12px 10px 6px"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:P.muted,padding:"0 8px",marginBottom:6}}>Navigation</div>
          <div onClick={()=>setView("pick")} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,cursor:"pointer",fontSize:12,color:P.storm,marginBottom:3}}>
            ← Change adventures
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,fontSize:12,background:P.salmonL,color:P.salmonD,fontWeight:600,marginBottom:3}}>
            🗺️ My adventure
            <span style={{marginLeft:"auto",fontSize:10,background:P.salmon,color:P.white,padding:"1px 6px",borderRadius:8}}>{totalDone}/{myAdvs.length}</span>
          </div>
        </div>

        {/* mini list */}
        <div style={{padding:"6px 10px",flex:1,overflowY:"auto"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:P.muted,padding:"0 8px",marginBottom:6}}>Adventures</div>
          {myAdvs.map((adv,i)=>{
            const done=!!completed[adv.id], hub=HUB[adv.hub]||HUB["Get Started"];
            return <div key={adv.id} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:7,marginBottom:1,fontSize:11,color:done?P.sprout:P.storm}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:done?P.sprout:hub.color,flexShrink:0}} />
              <span style={{flex:1,lineHeight:1.3}}>{adv.adv}</span>
              {done&&<span style={{fontSize:11}}>✓</span>}
            </div>;
          })}
        </div>

        {/* progress */}
        <div style={{padding:"12px 16px",borderTop:`1px solid ${P.fog}`}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:P.muted,marginBottom:5}}>
            <span>Overall progress</span><span style={{color:P.ink,fontWeight:600}}>{pct}%</span>
          </div>
          <div style={{height:5,background:P.fog,borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:P.salmon,borderRadius:4,transition:"width 0.5s"}} />
          </div>
          <div style={{fontSize:11,color:P.muted,marginTop:5}}>{totalDone} of {myAdvs.length} completed</div>
        </div>
      </aside>

      {/* main content */}
      <main style={{flex:1,overflowY:"auto",padding:"36px 44px 72px"}}>
        <div style={{marginBottom:28}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:700,letterSpacing:"-.4px",color:P.obsidian,marginBottom:5}}>Your adventure</h2>
          <p style={{fontSize:13,color:P.storm}}>{myAdvs.length} adventures selected · complete at your own pace</p>
        </div>

        {/* progress bar */}
        <div style={{background:P.white,border:`1px solid ${P.fog}`,borderRadius:12,padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:140}}>
            <div style={{height:6,background:P.fog,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:pct===100?P.sprout:P.salmon,borderRadius:4,transition:"width 0.5s"}} />
            </div>
          </div>
          <span style={{fontSize:13,color:P.storm,whiteSpace:"nowrap"}}><strong style={{color:P.ink}}>{totalDone}</strong> completed · <strong style={{color:P.ink}}>{myAdvs.length-totalDone}</strong> to go · <strong style={{color:pct===100?P.sprout:P.salmon}}>{pct}%</strong></span>
          {pct===100&&<span style={{fontSize:13,fontWeight:600,color:P.sprout}}>🎓 Done!</span>}
        </div>

        {/* adventure cards */}
        {myAdvs.map((adv,i)=>(
          <AdventureCard key={adv.id} adv={adv} idx={i} completed={completed} onComplete={(id,ev)=>setCompleted(p=>({...p,[id]:{ev,ts:Date.now()}}))} />
        ))}

        {myAdvs.length>0&&totalDone===myAdvs.length&&(
          <div style={{background:P.sproutL,border:`1px solid #B2DFDB`,borderRadius:16,padding:"28px 32px",textAlign:"center",marginTop:16}}>
            <div style={{fontSize:40,marginBottom:12}}>🎓</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700,color:P.obsidian,marginBottom:7}}>Adventure complete!</div>
            <div style={{fontSize:14,color:P.storm}}>You finished all {myAdvs.length} adventures. Share your progress in the Academy Onboarding community!</div>
          </div>
        )}
      </main>
    </div>
  );
}
