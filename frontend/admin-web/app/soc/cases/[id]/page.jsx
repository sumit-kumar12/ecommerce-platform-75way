"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminRequest } from "../../../../lib/api";
import {
  ShieldAlert, AlertTriangle, Clock, ChevronRight, ChevronDown,
  Users, Server, Zap, Activity, FileText, Eye, Terminal,
  Shield, Cpu, Database, Globe, Download, Search, Filter,
  Play, RefreshCw, Copy, ExternalLink, Lock, Unlock,
  UserX, Wifi, Mail, Hash, Link, Network, Layers,
  CheckSquare, Square, MessageSquare, History, GitBranch,
  MoreVertical, X, Check, AlertCircle, Loader2, Plus,
  ArrowRight, Monitor, HardDrive, Box, Book, Send,
  FileSearch, Crosshair, Siren, Flag, Radio, Bug, Flame
} from "lucide-react";
import { SeverityBadge, StatusBadge, SEVERITY_CFG } from "../components/CaseBadge";
import { ThreatGauge, CaseHealthGauge } from "../components/ThreatGauge";
import { AttackChain } from "../components/AttackChain";
import { MitreMatrix } from "../components/MitreMatrix";
import { ConfirmActionModal } from "../components/ConfirmActionModal";

// ─── Mock data factory (deterministic from case id) ─────────────────────────
function seed(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MOCK_CASE = {
  id: "CASE-2026-001248",
  title: "Possible Account Takeover using Phishing Email",
  severity: "Critical",
  status: "In Progress",
  priority: "Critical",
  source: "SIEM Alert",
  detectionRule: "Phishing – Suspicious Login",
  createdAt: "2025-05-26T08:21:00Z",
  updatedAt: "2025-05-27T11:42:00Z",
  firstSeen: "2025-05-26T08:19:00Z",
  lastSeen:  "2025-05-26T09:41:00Z",
  assignee: { name: "Rohit Sharma", email: "rohit.sharma@katabazaar.com" },
  reporter: { name: "SIEM System" },
  mitreaTactics: ["Initial Access","Credential Access","Persistence","Defense Evasion","Privilege Escalation"],
  tags: ["Phishing","Account Takeover","Critical Asset"],
  description: "Multiple failed logins followed by successful login from unusual location.",
  impact: "High - Potential unauthorized access to merchant/admin account.",
  rootSuspicion: "Phishing email leading to credential theft.",
  confidence: 85,
  threatScore: 92,
  slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000 + 18 * 60 * 1000),
};

const MOCK_TIMELINE = [
  { time:"08:19 AM", color:"#ef4444", dot:"bg-red-500",    type:"Alert Created",       desc:"Multiple failed login attempts from IP 185.199.110.153", actor:"SIEM System",   badge:"SIEM Alert" },
  { time:"08:20 AM", color:"#f97316", dot:"bg-orange-500", type:"IOC Matched",         desc:"IP flagged as malicious in ThreatIntel feeds (DarkGate Loader)", actor:"System", badge:"Threat Intel" },
  { time:"08:21 AM", color:"#8B5CF6", dot:"bg-purple-500", type:"Case Created",        desc:"Automatically created from SIEM alert correlation", actor:"System",             badge:"Auto" },
  { time:"08:23 AM", color:"#3b82f6", dot:"bg-blue-500",   type:"Analyst Assigned",    desc:"Rohit Sharma assigned by SOAR", actor:"SOAR System",                            badge:"Assignment" },
  { time:"08:30 AM", color:"#f59e0b", dot:"bg-amber-500",  type:"User Disabled",       desc:"merchant_admin account disabled as precautionary action", actor:"Ananya Verma",  badge:"Response" },
  { time:"08:42 AM", color:"#ef4444", dot:"bg-red-500",    type:"Host Isolated",       desc:"WIN-SRV-21 isolated from network by Vikram Das", actor:"Vikram Das",            badge:"Response" },
  { time:"09:02 AM", color:"#22c55e", dot:"bg-emerald-500",type:"Threat Contained",    desc:"All IOCs blocked, host isolated, user sessions revoked", actor:"System",        badge:"Containment" },
  { time:"09:18 AM", color:"#64748b", dot:"bg-slate-500",  type:"Status Updated",      desc:"Case status changed to In Progress by Rohit Sharma", actor:"Rohit Sharma",     badge:"Status Change" },
];

const MOCK_LOGS = {
  "SIEM": [
    { ts:"2025-05-26 08:19:01", level:"CRITICAL", src:"auth-service", msg:"Multiple failed logins (23) from IP 185.199.110.153 for user merchant_admin" },
    { ts:"2025-05-26 08:19:45", level:"WARN",     src:"auth-service", msg:"Successful login from new country: RU (Russia) — IP 185.199.110.153" },
    { ts:"2025-05-26 08:20:02", level:"ERROR",    src:"session-mgr",  msg:"Session hijack attempt detected — token replay from different IP" },
    { ts:"2025-05-26 08:20:15", level:"CRITICAL", src:"threat-engine",msg:"IOC match: 185.199.110.153 found in DarkGate C2 feed" },
    { ts:"2025-05-26 08:21:00", level:"INFO",     src:"soc-engine",   msg:"Case CASE-2026-001248 auto-created from rule: Phishing–Suspicious Login" },
  ],
  "Windows Events": [
    { ts:"2025-05-26 08:18:55", level:"ERROR", src:"WIN-SRV-21\\Security", msg:"Event ID 4625: An account failed to log on. Logon Type: 3, IP: 185.199.110.153" },
    { ts:"2025-05-26 08:19:01", level:"ERROR", src:"WIN-SRV-21\\Security", msg:"Event ID 4625: An account failed to log on. Logon Type: 3, IP: 185.199.110.153 (attempt 21/25)" },
    { ts:"2025-05-26 08:19:44", level:"WARN",  src:"WIN-SRV-21\\Security", msg:"Event ID 4624: Account logged on successfully. Logon Type: 3, Account: merchant_admin" },
    { ts:"2025-05-26 08:20:10", level:"WARN",  src:"WIN-SRV-21\\Security", msg:"Event ID 4648: Logon was attempted using explicit credentials. Target: ADMIN-PC" },
    { ts:"2025-05-26 08:42:00", level:"INFO",  src:"WIN-SRV-21\\System",   msg:"Event ID 7045: A new service was installed. Service: KB_Agent (suspicious)" },
  ],
  "Firewall": [
    { ts:"2025-05-26 08:19:00", level:"WARN",  src:"FW-EDGE-01", msg:"DENY TCP 185.199.110.153:44521 → 10.0.1.50:443 (rate limit triggered)" },
    { ts:"2025-05-26 08:20:30", level:"ERROR", src:"FW-EDGE-01", msg:"BLOCK established session 185.199.110.153 (IOC match – C2 traffic)" },
    { ts:"2025-05-26 08:30:15", level:"INFO",  src:"FW-EDGE-01", msg:"IP BLOCK RULE created: 185.199.110.153 (reason: SOC case CASE-2026-001248)" },
  ],
  "WAF": [
    { ts:"2025-05-26 08:17:30", level:"WARN",  src:"WAF-01", msg:"RULE 930120 matched: Path Traversal in URI /admin/../config/db.conf" },
    { ts:"2025-05-26 08:18:00", level:"ERROR", src:"WAF-01", msg:"RULE 942200 matched: SQL Injection in POST body param 'username'" },
    { ts:"2025-05-26 08:19:15", level:"WARN",  src:"WAF-01", msg:"ANOMALY SCORE 27/20: blocking request from 185.199.110.153" },
  ],
  "API Gateway": [
    { ts:"2025-05-26 08:19:05", level:"ERROR", src:"api-gateway-01", msg:"401 Unauthorized: POST /api/v1/admin/users/merchant_admin — bad credentials (attempt 21)" },
    { ts:"2025-05-26 08:19:50", level:"INFO",  src:"api-gateway-01", msg:"200 OK: POST /api/v1/auth/login — merchant_admin authenticated from 185.199.110.153" },
    { ts:"2025-05-26 08:20:05", level:"WARN",  src:"api-gateway-01", msg:"429 Rate Limit: IP 185.199.110.153 exceeded 100 req/min threshold" },
  ],
};

const MOCK_EVIDENCE = [
  { name:"file_memory_dump_26-05-2025.dmp", type:"Memory Dump",  source:"EDR",     hash:"SHA256:abc1234def5678abc1234...", size:"1.2 GB", ts:"May 26 08:30", integrity:"Verified"   },
  { name:"phishing_email_evidence.eml",     type:"Email",        source:"Mail GW", hash:"SHA256:def456abc789def456...", size:"248 KB", ts:"May 26 08:25", integrity:"Verified"   },
  { name:"b2d3_f9a1.exe",                   type:"Executable",   source:"EDR",     hash:"SHA256:b2d3...f9a1.exe",       size:"3.4 MB", ts:"May 26 07:10", integrity:"Verified"   },
  { name:"network_capture.pcap",            type:"PCAP",         source:"Firewall",hash:"SHA256:ghi789jkl012ghi789...", size:"87 MB",  ts:"May 26 08:15", integrity:"Unverified" },
  { name:"suspicious_script.ps1",           type:"Script",       source:"SIEM",    hash:"SHA256:jkl012mno345jkl012...", size:"12 KB",  ts:"May 26 08:20", integrity:"Verified"   },
  { name:"registry_export.reg",             type:"Registry",     source:"EDR",     hash:"SHA256:mno345pqr678mno345...", size:"4 KB",   ts:"May 26 09:00", integrity:"Verified"   },
];

const MOCK_ASSETS = [
  { name:"WIN-SRV-21",     type:"Windows Server",   risk:"High",   cpu:87, mem:92, ports:"22,80,443,3389", events:1245 },
  { name:"KBS-POD-4A2",    type:"Kubernetes Pod",   risk:"Medium", cpu:45, mem:61, ports:"8080",           events:876  },
  { name:"DB-PG-PRIMARY",  type:"PostgreSQL DB",    risk:"High",   cpu:78, mem:88, ports:"5432",           events:763  },
  { name:"merchant-portal",type:"Web Application",  risk:"Medium", cpu:32, mem:45, ports:"443",            events:542  },
  { name:"api-gateway-01", type:"API Gateway",      risk:"Low",    cpu:21, mem:33, ports:"443",            events:311  },
];

const MOCK_USERS = [
  { email:"vikram.das@katabazaar.com",   name:"Vikram Das",   role:"Admin",    dept:"IT Security",  mfa:true,  failed:3,  success:47, risk:85 },
  { email:"ananya.verma@katabazaar.com", name:"Ananya Verma", role:"Merchant", dept:"Operations",  mfa:true,  failed:8,  success:12, risk:72 },
  { email:"rohit.sharma@katabazaar.com", name:"Rohit Sharma", role:"Analyst",  dept:"SOC",          mfa:true,  failed:1,  success:98, risk:45 },
  { email:"neha.gupta@katabazaar.com",   name:"Neha Gupta",   role:"Support",  dept:"CS",           mfa:false, failed:2,  success:34, risk:32 },
  { email:"customer.john@example.com",   name:"John Customer",role:"Customer", dept:"—",            mfa:false, failed:0,  success:5,  risk:15 },
];

const MOCK_IOCS = [
  { indicator:"185.199.110.153",         type:"IP Address", reputation:"Malicious",  score:90, firstSeen:"May 25", lastSeen:"May 27" },
  { indicator:"evil-update[.]com",       type:"Domain",     reputation:"Malicious",  score:95, firstSeen:"May 24", lastSeen:"May 27" },
  { indicator:"b2d3...f9a1.exe",         type:"SHA256",     reputation:"Malicious",  score:95, firstSeen:"May 25", lastSeen:"May 26" },
  { indicator:"user@malicious-mail.com", type:"Email",      reputation:"Suspicious", score:70, firstSeen:"May 25", lastSeen:"May 26" },
  { indicator:"hxxp://evil-login.com/login",type:"URL",     reputation:"Malicious",  score:95, firstSeen:"May 24", lastSeen:"May 27" },
  { indicator:"support@security-update.co",type:"Email",   reputation:"Suspicious", score:65, firstSeen:"May 24", lastSeen:"May 26" },
];

const MOCK_PLAYBOOKS = [
  {
    id:"1", name:"Phishing Response", status:"Active", lastRun:"May 26 08:30", progress:75,
    steps:[
      { title:"Isolate affected user sessions", done:true },
      { title:"Block sender domain", done:true },
      { title:"Delete phishing emails from inbox", done:true },
      { title:"Disable compromised account", done:true },
      { title:"Alert IT Security team", done:true },
      { title:"Collect email headers and artifacts", done:true },
      { title:"Reset user password and MFA", done:false },
      { title:"Publish Post-Incident Communication", done:false },
    ]
  },
  { id:"2", name:"Malware Response",       status:"Available", lastRun:"Never",        steps:[] },
  { id:"3", name:"Account Takeover",       status:"Available", lastRun:"Never",        steps:[] },
  { id:"4", name:"API Abuse",              status:"Available", lastRun:"Never",        steps:[] },
  { id:"5", name:"Data Exfiltration",      status:"Available", lastRun:"Never",        steps:[] },
  { id:"6", name:"Privilege Escalation",   status:"Available", lastRun:"Never",        steps:[] },
];

const MOCK_NOTES = [
  { author:"Rohit Sharma",  ts:"May 27, 11:42 AM", channel:"Internal",    content:"Added new evidence: File memory_dump_26-05-2025.dmp. Hash verified against original EDR export." },
  { author:"Ananya Verma",  ts:"May 27, 11:10 AM", channel:"Engineering", content:"Isolated host WIN-SRV-21 as a precautionary measure. Server is non-critical for current ops." },
  { author:"Vikram Das",    ts:"May 27, 10:35 AM", channel:"Internal",    content:"@Rohit Blocked IP 185.199.110.153 in the firewall and confirmed block propagation. Please verify EDR side." },
  { author:"Neha Gupta",    ts:"May 27, 09:58 AM", channel:"Management",  content:"Notified management about potential merchant account compromise. RCA expected by EOD." },
];

const MOCK_AUDIT = [
  { ts:"11:42 AM", actor:"Rohit Sharma",  ip:"192.168.1.50", action:"Evidence Added",       detail:"file_memory_dump.dmp added to case" },
  { ts:"11:10 AM", actor:"Ananya Verma",  ip:"192.168.1.51", action:"Response Executed",    detail:"Isolate Host: WIN-SRV-21" },
  { ts:"10:35 AM", actor:"Vikram Das",    ip:"192.168.1.52", action:"IOC Blocked",           detail:"IP 185.199.110.153 blocked in firewall" },
  { ts:"09:58 AM", actor:"Neha Gupta",    ip:"192.168.1.53", action:"Password Reset",        detail:"merchant_admin password reset initiated" },
  { ts:"08:30 AM", actor:"Ananya Verma",  ip:"192.168.1.51", action:"User Disabled",         detail:"merchant_admin account disabled" },
  { ts:"08:23 AM", actor:"SOAR System",   ip:"10.0.0.1",     action:"Case Assigned",         detail:"Case assigned to Rohit Sharma" },
  { ts:"08:21 AM", actor:"System",        ip:"System",       action:"Case Created",          detail:"Case auto-created from SIEM alert ALT-2026-009812" },
];

const MOCK_RELATED = [
  { id:"CASE-2025-1243", title:"Data exfiltration attempt blocked",        severity:"Critical", status:"In Progress", relation:"Same User",         sim:91 },
  { id:"CASE-2025-1241", title:"Malware-Infostealer behavior detected",    severity:"High",     status:"Open",        relation:"Same Malware Family",sim:82 },
  { id:"CASE-2025-1239", title:"Cloud storage bucket misconfiguration",    severity:"Low",      status:"Resolved",    relation:"Same IP Address",   sim:67 },
];

const RESPONSE_ACTIONS = {
  "User Actions": [
    { label:"Disable User",    icon:UserX,    color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Disable user account immediately", target:"merchant_admin" },
    { label:"Reset Password",  icon:Lock,     color:"text-blue-400",   bg:"bg-blue-500/10",   border:"border-blue-500/30",   description:"Force password reset on next login", target:"merchant_admin" },
    { label:"Revoke Session",  icon:X,        color:"text-amber-400",  bg:"bg-amber-500/10",  border:"border-amber-500/30",  description:"Revoke all active sessions", target:"merchant_admin" },
    { label:"Lock Account",    icon:Lock,     color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Lock account for 24 hours", target:"merchant_admin" },
  ],
  "Network Actions": [
    { label:"Block IP",        icon:Network,  color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Add IP to firewall blocklist", target:"185.199.110.153" },
    { label:"Block Domain",    icon:Globe,    color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Block domain at DNS level", target:"evil-update[.]com" },
    { label:"Block URL",       icon:Link,     color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Block URL in WAF and proxy", target:"hxxp://evil-login.com/login" },
  ],
  "Host Actions": [
    { label:"Isolate Host",    icon:Server,   color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Network-isolate the host", target:"WIN-SRV-21" },
    { label:"Kill Process",    icon:X,        color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Terminate malicious process", target:"b2d3_f9a1.exe" },
    { label:"Quarantine File", icon:Shield,   color:"text-amber-400",  bg:"bg-amber-500/10",  border:"border-amber-500/30",  description:"Move file to quarantine vault", target:"b2d3_f9a1.exe" },
  ],
  "Email Actions": [
    { label:"Delete Email",    icon:Mail,     color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Delete phishing email from all inboxes", target:"Phishing email batch" },
    { label:"Block Sender",    icon:UserX,    color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Block sender at mail gateway", target:"user@malicious-mail.com" },
  ],
  "Platform Actions": [
    { label:"Block Merchant",  icon:Shield,   color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Suspend merchant account", target:"merchant_admin" },
    { label:"Freeze Wallet",   icon:Lock,     color:"text-amber-400",  bg:"bg-amber-500/10",  border:"border-amber-500/30",  description:"Freeze merchant wallet & payouts", target:"merchant_admin" },
    { label:"Pause Orders",    icon:Activity, color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Pause all new orders from merchant", target:"merchant_admin" },
    { label:"Disable API Key", icon:Hash,     color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Revoke all API keys", target:"merchant_admin" },
  ],
};

const TABS = [
  { id:"overview",     label:"Overview",      icon:Eye },
  { id:"timeline",     label:"Timeline",      icon:Activity },
  { id:"logs",         label:"Logs",          icon:Terminal },
  { id:"evidence",     label:"Evidence",      icon:FileSearch },
  { id:"assets",       label:"Assets",        icon:Server },
  { id:"users",        label:"Users",         icon:Users },
  { id:"ioc",          label:"IOC",           icon:Crosshair },
  { id:"threatintel",  label:"Threat Intel",  icon:Globe },
  { id:"mitre",        label:"MITRE ATT&CK",  icon:Layers },
  { id:"playbooks",    label:"Playbooks",     icon:Play },
  { id:"response",     label:"Response",      icon:Shield },
  { id:"notes",        label:"Notes",         icon:MessageSquare },
  { id:"audit",        label:"Audit Trail",   icon:History },
  { id:"related",      label:"Related Cases", icon:GitBranch },
];

// ─── Helper Components ────────────────────────────────────────────────────────
function RiskBadge({ risk }) {
  const cfg = { High:"text-red-400 bg-red-500/10 border-red-500/30", Medium:"text-amber-400 bg-amber-500/10 border-amber-500/30", Low:"text-blue-400 bg-blue-500/10 border-blue-500/30" };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg[risk] || cfg.Low}`}>{risk}</span>;
}

function RepBadge({ rep }) {
  const cfg = { Malicious:"text-red-400 bg-red-500/10 border-red-500/30", Suspicious:"text-amber-400 bg-amber-500/10 border-amber-500/30", Clean:"text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg[rep] || cfg.Malicious}`}>{rep}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-[#1e2235] bg-[#0f1117] ${className}`}>{children}</div>;
}

function MiniCard({ children, className = "" }) {
  return <div className={`rounded-xl border border-[#252840] bg-[#1a1d2e] ${className}`}>{children}</div>;
}

function ScoreBar({ score, color = "#8B5CF6", height = 4 }) {
  return (
    <div className="relative w-full rounded-full overflow-hidden" style={{ height, background: "rgba(255,255,255,0.06)" }}>
      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
    </div>
  );
}

function CpuBar({ value, label }) {
  const color = value > 80 ? "#ef4444" : value > 60 ? "#f97316" : "#22c55e";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-600 w-12">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width:`${value}%`, background:color }} />
      </div>
      <span className="text-[10px] font-mono" style={{ color }}>{value}%</span>
    </div>
  );
}

function Avatar({ name, size = "sm" }) {
  const sz = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div className={`${sz} rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold shrink-0`}>
      {(name||"?")[0].toUpperCase()}
    </div>
  );
}

// ─── TAB CONTENT COMPONENTS ──────────────────────────────────────────────────

function OverviewTab({ caseData }) {
  const MITRE_SUMMARY = [
    { tactic:"Initial Access",       count:1, color:"#ef4444" },
    { tactic:"Execution",            count:1, color:"#f97316" },
    { tactic:"Credential Access",    count:2, color:"#ec4899" },
    { tactic:"Persistence",          count:1, color:"#eab308" },
    { tactic:"Privilege Escalation", count:1, color:"#a855f7" },
    { tactic:"Defense Evasion",      count:1, color:"#6366f1" },
    { tactic:"Other",                count:0, color:"#64748b" },
  ];

  const RECENT_ALERTS = [
    { sev:"Critical", ts:"08:19 AM", title:"Multiple failed login attempts from IP 185.199.110.153", isNew:true },
    { sev:"High",     ts:"08:20 AM", title:"Successful login from unusual location (Russia)", isNew:true },
    { sev:"High",     ts:"08:21 AM", title:"Suspicious PowerShell URL clicked in email by user", isNew:true },
    { sev:"Medium",   ts:"08:22 AM", title:"C2 Communication detected from WIN-SRV-21", isNew:false },
  ];

  const SEV_DOT = { Critical:"bg-red-500", High:"bg-orange-500", Medium:"bg-yellow-400" };

  const ACTIVITY_FEED = [
    { ts:"11:42 AM", actor:"Rohit Sharma",  action:"added new evidence", detail:"File memory_dump_26-05-2025.dmp" },
    { ts:"11:10 AM", actor:"Ananya Verma",  action:"isolated host",       detail:"WIN-SRV-21" },
    { ts:"10:35 AM", actor:"Vikram Das",    action:"blocked IP",           detail:"185.199.110.153" },
    { ts:"09:58 AM", actor:"Neha Gupta",    action:"reset password for",   detail:"merchant_admin" },
    { ts:"08:21 AM", actor:"System",        action:"created case from",    detail:"SIEM alert ALT-2026-009812" },
  ];

  return (
    <div className="space-y-5">
      {/* Top 3-column row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Col 1: Threat Score + Attack Chain + KPIs */}
        <div className="space-y-4">
          <Card className="p-5 flex flex-col items-center gap-3">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Threat Score</div>
            <ThreatGauge score={caseData?.threatScore || 92} size={140} />
          </Card>

          <Card className="p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Attack Chain Progress</div>
            <AttackChain activeSteps={["recon","access","exec","cred","persist","privesc"]} compact />
          </Card>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label:"Affected Users",  value:18,    icon:Users,    color:"text-orange-400", bg:"bg-orange-500/10" },
              { label:"Affected Devices",value:6,     icon:Monitor,  color:"text-blue-400",   bg:"bg-blue-500/10" },
              { label:"Affected Servers",value:2,     icon:Server,   color:"text-red-400",    bg:"bg-red-500/10" },
              { label:"Alerts",          value:128,   icon:Siren,    color:"text-amber-400",  bg:"bg-amber-500/10" },
              { label:"Events",          value:"5,437",icon:Activity, color:"text-purple-400", bg:"bg-purple-500/10" },
              { label:"IOCs",            value:40,    icon:Crosshair,color:"text-red-400",    bg:"bg-red-500/10" },
              { label:"Evidence",        value:23,    icon:FileText, color:"text-emerald-400",bg:"bg-emerald-500/10" },
            ].map((k,i) => (
              <MiniCard key={i} className="p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <k.icon className={`w-3 h-3 ${k.color}`} />
                  <span className="text-[9px] text-gray-600 uppercase tracking-wider">{k.label}</span>
                </div>
                <div className={`text-lg font-extrabold ${k.color}`}>{k.value}</div>
              </MiniCard>
            ))}
          </div>
        </div>

        {/* Col 2: Case Summary + Top Indicators */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-bold text-white mb-4">Case Summary</div>
            <div className="space-y-3 text-sm">
              {[
                { label:"Description",    value:caseData?.description || MOCK_CASE.description },
                { label:"Impact",         value:caseData?.impact || MOCK_CASE.impact },
                { label:"Root Suspicion", value:caseData?.rootSuspicion || MOCK_CASE.rootSuspicion },
              ].map((f,i) => (
                <div key={i}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">{f.label}</div>
                  <div className="text-gray-300 text-xs leading-relaxed">{f.value}</div>
                </div>
              ))}
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Confidence</div>
                <div className="flex items-center gap-2">
                  <ScoreBar score={caseData?.confidence || 85} color="#22c55e" height={6} />
                  <span className="text-xs font-bold text-emerald-400">{caseData?.confidence || 85}%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-bold text-white mb-3">Top Indicators</div>
            <div className="space-y-2">
              {MOCK_IOCS.slice(0,5).map((ioc,i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#1e2235] last:border-0">
                  <span className="text-xs font-mono text-gray-300 flex-1 truncate" title={ioc.indicator}>{ioc.indicator}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10 shrink-0">{ioc.type}</span>
                  <RepBadge rep={ioc.reputation} />
                </div>
              ))}
            </div>
            <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">View all IOCs →</button>
          </Card>
        </div>

        {/* Col 3: MITRE Summary + Recent Alerts + Assets */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-bold text-white mb-3">MITRE ATT&CK Summary</div>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  {MITRE_SUMMARY.slice(0,6).map((t,i) => {
                    const angle = (i/6)*360;
                    const r=28, cx=36, cy=36;
                    const rad = ((angle-90)*Math.PI)/180;
                    return (
                      <circle key={i} cx={cx+r*Math.cos(rad)} cy={cy+r*Math.sin(rad)}
                        r="7" fill={t.color+"33"} stroke={t.color} strokeWidth="1.5" />
                    );
                  })}
                  <text x="36" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Space Grotesk">7</text>
                </svg>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {MITRE_SUMMARY.slice(0,6).map((t,i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background:t.color }} />
                      <span className="text-[9px] text-gray-500">{t.tactic}</span>
                    </div>
                    <span className="text-[9px] text-gray-400">{t.count}</span>
                  </div>
                ))}
                <div className="text-[9px] text-purple-400 mt-1 cursor-pointer hover:text-purple-300">View full mapping →</div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-bold text-white mb-3">Recent Alerts</div>
            <div className="space-y-2">
              {RECENT_ALERTS.map((a,i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${SEV_DOT[a.sev]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-gray-600">{a.ts}</span>
                      <SeverityBadge level={a.sev} />
                      {a.isNew && <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">New</span>}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">{a.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-bold text-white mb-3">Most Active Assets</div>
            <div className="space-y-2">
              {MOCK_ASSETS.map((a,i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1e2235] last:border-0">
                  <div>
                    <div className="text-xs font-medium text-gray-300">{a.name}</div>
                    <div className="text-[9px] text-gray-600">{a.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={a.risk} />
                    <span className="text-[10px] text-gray-500">{a.events.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Case Activity Feed */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-white">Case Activity (Last 24h)</div>
          <button className="text-xs text-purple-400 hover:text-purple-300">View full activity →</button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {ACTIVITY_FEED.map((a,i) => (
            <div key={i} className="flex items-start gap-2 shrink-0 max-w-[240px]">
              <Avatar name={a.actor} />
              <div>
                <div className="text-[10px] text-gray-600">{a.ts}</div>
                <div className="text-xs text-gray-300">
                  <span className="text-purple-400">{a.actor}</span> {a.action} <span className="text-amber-400">{a.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TimelineTab({ caseId }) {
  const [expanded, setExpanded] = useState(null);
  const [items, setItems] = useState(MOCK_TIMELINE);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) { setLoadingData(false); return; }
    adminRequest(`/soc/cases/${caseId}/timeline`)
      .then(r => { if (r?.timeline?.length) setItems(r.timeline.map(t => ({ time: new Date(t.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), type: t.eventType, desc: t.description, actor: t.actorName || "System", badge: t.source || "System", dot: "bg-purple-500", color: "#8B5CF6" }))); })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [caseId]);

  return (
    <Card className="p-6">
      <div className="text-sm font-bold text-white mb-6">Case Timeline {loadingData && <span className="text-[10px] text-gray-600 ml-2">loading...</span>}</div>
      <div className="relative">
        <div className="absolute left-[20px] top-0 bottom-0 w-px bg-[#1e2235]" />
        <div className="space-y-0">
          {items.map((e,i) => (
            <div key={i} className="relative flex gap-4 pl-10 pb-6 last:pb-0 group">
              {/* Dot */}
              <div className={`absolute left-[13px] top-0 w-[14px] h-[14px] rounded-full border-2 border-[#0f1117] ${e.dot || "bg-purple-500"} shrink-0`} />
              {/* Content */}
              <div
                className="flex-1 bg-[#1a1d2e] border border-[#252840] rounded-xl p-4 cursor-pointer hover:border-purple-500/30 transition-all"
                onClick={() => setExpanded(expanded===i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-600">{e.time}</span>
                    <span className="text-sm font-semibold text-white">{e.type}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500">{e.badge}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${expanded===i ? "rotate-180" : ""}`} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{e.desc}</p>
                {expanded===i && (
                  <div className="mt-3 pt-3 border-t border-[#1e2235] flex items-center gap-2">
                    <Avatar name={e.actor} />
                    <span className="text-xs text-gray-400">by <span className="text-purple-300">{e.actor}</span></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function LogsTab({ caseId }) {
  const [activeSource, setActiveSource] = useState("SIEM");
  const [logSearch, setLogSearch] = useState("");
  const [logLevel, setLogLevel] = useState("All");
  const [logData, setLogData] = useState(MOCK_LOGS);
  const LEVEL_COLOR = { CRITICAL:"text-red-400 bg-red-500/10 border-red-500/30", ERROR:"text-orange-400 bg-orange-500/10 border-orange-500/30", WARN:"text-amber-400 bg-amber-500/10 border-amber-500/30", INFO:"text-blue-400 bg-blue-500/10 border-blue-500/30", DEBUG:"text-gray-400 bg-gray-500/10 border-gray-500/30" };

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/logs?limit=200`)
      .then(r => {
        if (r?.logs?.length) {
          // Group by source
          const grouped = {};
          r.logs.forEach(l => {
            const src = l.source || "APPLICATION";
            if (!grouped[src]) grouped[src] = [];
            grouped[src].push({ ts: new Date(l.createdAt).toISOString().replace("T"," ").slice(0,19), level: l.level, src: l.service || l.hostname || src, msg: l.message });
          });
          if (Object.keys(grouped).length) { setLogData(grouped); setActiveSource(Object.keys(grouped)[0]); }
        }
      })
      .catch(() => {});
  }, [caseId]);

  const sources = Object.keys(logData);
  const logs = (logData[activeSource] || []).filter(l =>
    (logLevel === "All" || l.level === logLevel) &&
    (!logSearch || l.msg.toLowerCase().includes(logSearch.toLowerCase()) || l.src.toLowerCase().includes(logSearch.toLowerCase()))
  );

  return (
    <Card className="overflow-hidden">
      {/* Source tabs */}
      <div className="flex gap-1 px-4 pt-4 border-b border-[#1e2235] overflow-x-auto">
        {sources.map(s => (
          <button key={s} onClick={() => setActiveSource(s)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-all ${activeSource===s ? "border-purple-500 text-white bg-purple-500/10" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {s}
          </button>
        ))}
      </div>
      {/* Filters */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2235]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
          <input value={logSearch} onChange={e=>setLogSearch(e.target.value)} placeholder="Search logs... (regex supported)"
            className="w-full bg-[#0b0d14] border border-[#252840] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 font-mono" />
        </div>
        <select value={logLevel} onChange={e=>setLogLevel(e.target.value)} className="bg-[#0b0d14] border border-[#252840] rounded-lg px-2 py-1.5 text-xs text-gray-400 focus:outline-none">
          {["All","CRITICAL","ERROR","WARN","INFO","DEBUG"].map(l=><option key={l}>{l}</option>)}
        </select>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-gray-200 transition-colors">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
      </div>
      {/* Log entries */}
      <div className="font-mono text-xs divide-y divide-[#1a1d2e]">
        {logs.map((l,i) => (
          <div key={i} className={`flex items-start gap-3 px-4 py-2.5 ${i%2===0 ? "bg-transparent" : "bg-white/[0.01]"} hover:bg-purple-500/5 transition-colors`}>
            <span className="text-gray-700 shrink-0 w-36">{l.ts}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${LEVEL_COLOR[l.level] || LEVEL_COLOR.INFO}`}>{l.level}</span>
            <span className="text-gray-500 shrink-0 w-32 truncate">{l.src}</span>
            <span className="text-gray-300 flex-1 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: logSearch
                ? l.msg.replace(new RegExp(`(${logSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "gi"), "<mark class='bg-yellow-400/20 text-yellow-300 rounded px-0.5'>$1</mark>")
                : l.msg
              }}
            />
          </div>
        ))}
        {logs.length === 0 && <div className="px-4 py-8 text-center text-gray-600 text-xs">No logs match your filter</div>}
      </div>
    </Card>
  );
}



function EvidenceTab({ caseId }) {
  const [cat, setCat] = useState("All");
  const [evidence, setEvidence] = useState(MOCK_EVIDENCE);
  const CATS = ["All","Files","Processes","Emails","URLs","Domains","Hashes","PCAP","Memory"];

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/evidence`)
      .then(r => { if (r?.evidence?.length) setEvidence(r.evidence.map(e => ({ name: e.name, type: e.type, source: e.source, hash: e.fileHash || "—", size: e.fileSize ? `${(e.fileSize/1024).toFixed(1)} KB` : "—", ts: new Date(e.createdAt).toLocaleDateString("en-IN",{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"}), integrity: e.integrity || "UNVERIFIED" }))); })
      .catch(() => {});
  }, [caseId]);

  const items = evidence.filter(e => cat === "All" || e.type.toLowerCase().includes(cat.toLowerCase().replace("s","")));

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2235]">
        <div className="text-sm font-bold text-white">Evidence Collection</div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Evidence
        </button>
      </div>
      <div className="flex gap-1 px-6 py-3 border-b border-[#1e2235] overflow-x-auto">
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${cat===c ? "bg-purple-500/20 border border-purple-500/40 text-purple-300" : "text-gray-600 hover:text-gray-300 bg-white/5"}`}>{c}</button>
        ))}
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-[#1e2235]">
          <tr className="text-[10px] uppercase tracking-widest text-gray-600">
            <th className="px-6 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Hash</th><th className="px-4 py-3">Size</th><th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Integrity</th><th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1d2e]">
          {items.map((e,i)=>(
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-3"><span className="text-xs font-mono text-gray-300">{e.name}</span></td>
              <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{e.type}</span></td>
              <td className="px-4 py-3"><span className="text-xs text-gray-500">{e.source}</span></td>
              <td className="px-4 py-3"><span className="text-[10px] font-mono text-gray-600 truncate max-w-[100px] block">{e.hash}</span></td>
              <td className="px-4 py-3"><span className="text-xs text-gray-500">{e.size}</span></td>
              <td className="px-4 py-3"><span className="text-xs text-gray-500">{e.ts}</span></td>
              <td className="px-4 py-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${(e.integrity||"UNVERIFIED")==="VERIFIED"||e.integrity==="Verified" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30"}`}>{e.integrity}</span>
              </td>
              <td className="px-4 py-3">
                <button className="p-1.5 rounded-lg hover:bg-purple-500/20 text-gray-600 hover:text-purple-400 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-xs text-gray-600">No evidence items</td></tr>}
        </tbody>
      </table>
    </Card>
  );
}

function AssetsTab({ caseId }) {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const RISK_COLOR = { HIGH:"#ef4444", MEDIUM:"#f59e0b", LOW:"#3b82f6", High:"#ef4444", Medium:"#f59e0b", Low:"#3b82f6" };
  const TYPE_ICON = { "Windows Server":Monitor, "Kubernetes Pod":Box, "PostgreSQL DB":Database, "Web Application":Globe, "API Gateway":Network, "SERVER":Server, "WORKSTATION":Monitor, "DATABASE":Database, "CONTAINER":Box };

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/assets`)
      .then(r => { if (r?.assets?.length) setAssets(r.assets.map(a => ({ name: a.name, type: a.type, risk: a.riskLevel, hostname: a.hostname, ip: a.ipAddress, events: a.eventCount || 0, ports: a.metadata?.ports, cpu: a.metadata?.cpu ?? Math.floor(Math.random()*80+10), mem: a.metadata?.mem ?? Math.floor(Math.random()*70+20) }))); })
      .catch(() => {});
  }, [caseId]);

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-white">Affected Assets ({assets.length})</div>
      {assets.length === 0 ? (
        <Card className="p-8 text-center text-gray-600 text-xs">No assets linked to this case</Card>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {assets.map((a,i) => {
            const Icon = TYPE_ICON[a.type] || Server;
            const rColor = RISK_COLOR[a.risk] || "#64748b";
            return (
              <Card key={i} className="p-5 hover:border-purple-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:`${rColor}15`, border:`1px solid ${rColor}30` }}>
                      <Icon className="w-4 h-4" style={{ color:rColor }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{a.name}</div>
                      <div className="text-[10px] text-gray-500">{a.type}{a.hostname ? ` · ${a.hostname}` : ""}</div>
                    </div>
                  </div>
                  <RiskBadge risk={a.risk} />
                </div>
                <div className="space-y-1.5 mb-3">
                  <CpuBar value={a.cpu} label="CPU" />
                  <CpuBar value={a.mem} label="Memory" />
                </div>
                {a.ports && <div className="text-[10px] text-gray-600 mb-2">Ports: <span className="font-mono text-gray-400">{a.ports}</span></div>}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">{(a.events||0).toLocaleString()} events</span>
                  <button className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 hover:bg-purple-500/20 transition-colors">Investigate</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UsersTab({ caseId }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const riskColor = (s) => s>=70?"text-red-400 bg-red-500/10 border-red-500/30":s>=40?"text-amber-400 bg-amber-500/10 border-amber-500/30":"text-blue-400 bg-blue-500/10 border-blue-500/30";
  const riskLabel = (s) => s>=70?"HIGH":s>=40?"MEDIUM":"LOW";

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/users`)
      .then(r => { if (r?.users?.length) setUsers(r.users.map(u => ({ name: u.name || u.email, email: u.email, role: u.role || "UNKNOWN", dept: u.dept || "—", mfa: u.mfaEnabled, failed: u.failedLogins || 0, success: u.successLogins || 0, risk: u.riskScore || 0 }))); })
      .catch(() => {});
  }, [caseId]);

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1e2235] flex items-center justify-between">
        <div className="text-sm font-bold text-white">Affected Users ({users.length})</div>
        {users.length === 0 && <span className="text-xs text-gray-600">No users linked to this case</span>}
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-[#1e2235]">
          <tr className="text-[10px] uppercase tracking-widest text-gray-600">
            <th className="px-6 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Dept</th>
            <th className="px-4 py-3">MFA</th><th className="px-4 py-3">Failed</th><th className="px-4 py-3">Risk Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1d2e]">
          {users.map((u,i)=>(
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={u.name} />
                  <div><div className="text-xs font-medium text-gray-300">{u.name}</div><div className="text-[10px] text-gray-600">{u.email}</div></div>
                </div>
              </td>
              <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{u.role}</span></td>
              <td className="px-4 py-3"><span className="text-xs text-gray-500">{u.dept}</span></td>
              <td className="px-4 py-3">
                {u.mfa ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
              </td>
              <td className="px-4 py-3"><span className="text-xs font-mono text-red-400">{u.failed}</span></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${u.risk}%`, background:u.risk>=70?"#ef4444":u.risk>=40?"#f59e0b":"#3b82f6" }} />
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${riskColor(u.risk)}`}>{u.risk} {riskLabel(u.risk)}</span>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-600">No users linked</td></tr>}
        </tbody>
      </table>
    </Card>
  );
}

function IocTab({ caseId }) {
  const [iocType, setIocType] = useState("All");
  const [iocs, setIocs] = useState(MOCK_IOCS);
  const IOC_TYPES = ["All","IP","DOMAIN","URL","HASH_SHA256","EMAIL","FILE"];

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/iocs`)
      .then(r => { if (r?.iocs?.length) setIocs(r.iocs.map(i => ({ indicator: i.indicator, type: i.type, reputation: i.reputation || "UNKNOWN", score: i.threatScore || 0, firstSeen: new Date(i.firstSeen||i.createdAt).toLocaleDateString("en-IN",{month:"short",day:"2-digit"}), lastSeen: new Date(i.lastSeen||i.updatedAt||i.createdAt).toLocaleDateString("en-IN",{month:"short",day:"2-digit"}), vtResult: i.vtResult, abuseResult: i.abuseResult, enrichedAt: i.enrichedAt }))); })
      .catch(() => {});
  }, [caseId]);

  const items = iocs.filter(i => iocType==="All" || i.type === iocType || i.type.toLowerCase().includes(iocType.toLowerCase()));

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2235]">
        <div className="text-sm font-bold text-white">Indicators of Compromise ({iocs.length})</div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"><Plus className="w-3.5 h-3.5" />Add IOC</button>
      </div>
      <div className="flex gap-1 px-6 py-3 border-b border-[#1e2235]">
        {IOC_TYPES.map(t=><button key={t} onClick={()=>setIocType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${iocType===t?"bg-purple-500/20 border border-purple-500/40 text-purple-300":"text-gray-600 hover:text-gray-300"}`}>{t}</button>)}
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-[#1e2235]">
          <tr className="text-[10px] uppercase tracking-widest text-gray-600">
            <th className="px-6 py-3">Indicator</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Reputation</th>
            <th className="px-4 py-3">Threat Score</th><th className="px-4 py-3">First Seen</th><th className="px-4 py-3">Last Seen</th><th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1d2e]">
          {items.map((ioc,i)=>(
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-3"><span className="text-xs font-mono text-gray-300">{ioc.indicator}</span></td>
              <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{ioc.type}</span></td>
              <td className="px-4 py-3"><RepBadge rep={ioc.reputation} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-red-500" style={{width:`${ioc.score}%`}} /></div>
                  <span className="text-xs font-mono text-red-400">{ioc.score}</span>
                </div>
              </td>
              <td className="px-4 py-3"><span className="text-xs text-gray-500">{ioc.firstSeen}</span></td>
              <td className="px-4 py-3"><span className="text-xs text-gray-500">{ioc.lastSeen}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 hover:bg-red-500/20 transition-colors">Block</button>
                  {!ioc.enrichedAt && <button className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 hover:bg-blue-500/20 transition-colors">Enrich</button>}
                </div>
              </td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-xs text-gray-600">No IOCs found</td></tr>}
        </tbody>
      </table>
    </Card>
  );
}

function ThreatIntelTab() {
  const FEEDS = [
    { name:"VirusTotal", status:"Healthy", color:"#22c55e" },
    { name:"AbuseIPDB",  status:"Healthy", color:"#22c55e" },
    { name:"AlienVault OTX", status:"Healthy", color:"#22c55e" },
    { name:"GreyNoise",  status:"Healthy", color:"#22c55e" },
    { name:"MISP",       status:"Online",  color:"#3b82f6" },
  ];

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="text-sm font-bold text-white mb-3">Intelligence Feed Status</div>
        <div className="flex flex-wrap gap-3">
          {FEEDS.map((f,i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1d2e] border border-[#252840]">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{background:f.color}} />
              <span className="text-xs font-semibold text-gray-300">{f.name}</span>
              <span className="text-[10px] font-medium" style={{color:f.color}}>{f.status}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="text-sm font-bold text-white mb-4">IOC Enrichment — 185.199.110.153</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { feed:"VirusTotal", items:[["Engines Flagged","47/72"],["Classification","Malicious"],["Country","Russia"],["ASN","AS47583"]] },
            { feed:"AbuseIPDB",  items:[["Confidence Score","98%"],["Total Reports","124"],["Last Reported","May 27, 2025"],["Category","Hacking"]] },
            { feed:"GreyNoise",  items:[["Classification","MALICIOUS"],["Type","scanner"],["Noise","True"],["RIOT","False"]] },
          ].map((p,i) => (
            <MiniCard key={i} className="p-4">
              <div className="text-xs font-bold text-purple-400 mb-3">{p.feed}</div>
              {p.items.map(([k,v],j)=>(
                <div key={j} className="flex justify-between py-1 border-b border-[#1e2235] last:border-0">
                  <span className="text-[10px] text-gray-600">{k}</span>
                  <span className="text-[10px] font-semibold text-gray-300">{v}</span>
                </div>
              ))}
            </MiniCard>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MitreTab() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="text-sm font-bold text-white mb-2">MITRE ATT&CK Heatmap — 7 Techniques Detected</div>
        <p className="text-xs text-gray-500 mb-4">Tactics and techniques observed in this case are highlighted. Click a cell for details.</p>
        <MitreMatrix activeTactics={["TA0001","TA0002","TA0003","TA0004","TA0005","TA0006"]} activeTechniques={["T1566","T1078","T1059","T1003","T1547","T1027"]} />
      </Card>
      <div className="grid grid-cols-2 gap-4">
        {[
          { id:"T1566", name:"Phishing", tactic:"Initial Access", desc:"Adversaries send phishing messages to gain access to victim systems." },
          { id:"T1078", name:"Valid Accounts", tactic:"Credential Access", desc:"Adversaries may obtain and abuse credentials of existing accounts." },
          { id:"T1059", name:"Command and Scripting Interpreter", tactic:"Execution", desc:"Adversaries may abuse command/script interpreters to execute commands." },
          { id:"T1003", name:"OS Credential Dumping", tactic:"Credential Access", desc:"Adversaries may attempt to dump credentials to obtain account login information." },
          { id:"T1547", name:"Boot or Logon Autostart Execution", tactic:"Persistence", desc:"Adversaries may configure system settings to run a program during system boot." },
          { id:"T1027", name:"Obfuscated Files or Information", tactic:"Defense Evasion", desc:"Adversaries may attempt to make artifacts difficult to discover or analyze." },
        ].map((t,i) => (
          <MiniCard key={i} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">{t.id}</span>
              <span className="text-xs font-bold text-white">{t.name}</span>
            </div>
            <div className="text-[10px] text-gray-500 mb-1">{t.tactic}</div>
            <div className="text-[10px] text-gray-500 leading-relaxed">{t.desc}</div>
          </MiniCard>
        ))}
      </div>
    </div>
  );
}

function PlaybooksTab({ caseId }) {
  const [playbooks, setPlaybooks] = useState([]);
  const [running, setRunning] = useState(null);
  const [loadingPB, setLoadingPB] = useState(true);

  const loadPlaybooks = useCallback(() => {
    if (!caseId || caseId.startsWith("fallback-")) { setLoadingPB(false); return; }
    adminRequest(`/soc/cases/${caseId}/playbooks`)
      .then(r => { if (r?.playbooks) setPlaybooks(r.playbooks); })
      .catch(() => {})
      .finally(() => setLoadingPB(false));
  }, [caseId]);

  useEffect(() => { loadPlaybooks(); }, [loadPlaybooks]);

  const runPlaybook = async (pid) => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    setRunning(pid);
    try {
      await adminRequest(`/soc/cases/${caseId}/playbooks/${pid}/run`, { method: "POST" });
      await loadPlaybooks();
    } catch {} finally { setRunning(null); }
  };

  if (loadingPB) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-purple-400 animate-spin" /></div>;

  const displayPBs = playbooks.length > 0 ? playbooks : MOCK_PLAYBOOKS;

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayPBs.map((p,i) => {
        const isRunning = running === p.id;
        const lastRun = p.lastRun;
        const progress = lastRun ? Math.round(((lastRun.currentStep || 0) / Math.max(p.stepsTotal || p.steps?.length || 1, 1)) * 100) : 0;
        const pbStatus = lastRun?.status === "RUNNING" ? "Active" : lastRun?.status || (p.status || "Ready");
        return (
          <Card key={i} className={`p-5 ${pbStatus==="Active"||pbStatus==="RUNNING" ? "border-purple-500/30" : ""}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-bold text-white">{p.name}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">
                  {lastRun ? `Last run: ${new Date(lastRun.createdAt).toLocaleDateString("en-IN",{month:"short",day:"2-digit"})}` : p.lastRun || "Never run"}
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                pbStatus==="RUNNING"||pbStatus==="Active" ? "text-purple-400 bg-purple-500/10 border-purple-500/30 animate-pulse"
                : pbStatus==="COMPLETED" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : "text-gray-500 bg-white/5 border-white/10"
              }`}>{pbStatus}</span>
            </div>

            {(pbStatus==="RUNNING"||pbStatus==="Active") && (
              <div className="mb-3">
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500 transition-all" style={{width:`${progress||p.progress||0}%`}} />
                </div>
                <div className="text-[9px] text-gray-600 mt-1">{progress||p.progress||0}% complete</div>
              </div>
            )}

            {p.description && <p className="text-[10px] text-gray-600 mb-3">{p.description}</p>}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => runPlaybook(p.id)}
                disabled={isRunning || pbStatus==="RUNNING"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
              >
                {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {pbStatus==="RUNNING"||pbStatus==="Active" ? "Resume" : "Run"}
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-gray-200 transition-colors">Configure</button>
            </div>
          </Card>
        );
      })}
      {displayPBs.length === 0 && (
        <div className="col-span-2 text-center py-12 text-gray-600 text-xs">No playbooks available</div>
      )}
    </div>
  );
}

function ResponseTab({ caseId, onAction }) {
  const [history, setHistory] = useState([]);
  const [executing, setExecuting] = useState(null);

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) {
      setHistory([
        { ts:"11:10 AM", action:"Isolate Host",   target:"WIN-SRV-21",       actor:"Ananya Verma", status:"EXECUTED" },
        { ts:"10:35 AM", action:"Block IP",        target:"185.199.110.153",  actor:"Vikram Das",   status:"EXECUTED" },
      ]);
      return;
    }
    adminRequest(`/soc/cases/${caseId}/response`)
      .then(r => { if (r?.actions) setHistory(r.actions.map(a => ({ ts: new Date(a.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), action: a.actionType, target: a.target || "—", actor: a.executedBy?.name || "System", status: a.status }))); })
      .catch(() => {});
  }, [caseId]);

  const handleAction = async (a) => {
    if (a.target === null) { onAction(a); return; }
    if (!caseId || caseId.startsWith("fallback-")) { onAction(a); return; }
    setExecuting(a.label);
    try {
      await adminRequest(`/soc/cases/${caseId}/response`, { method: "POST", body: { actionType: a.label.toUpperCase().replace(/ /g,"_"), target: a.target, reason: `Manual action: ${a.label}` } });
      // Refresh history
      const r = await adminRequest(`/soc/cases/${caseId}/response`);
      if (r?.actions) setHistory(r.actions.map(a => ({ ts: new Date(a.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), action: a.actionType, target: a.target || "—", actor: a.executedBy?.name || "System", status: a.status })));
    } catch { onAction(a); } finally { setExecuting(null); }
  };

  return (
    <div className="space-y-6">
      {Object.entries(RESPONSE_ACTIONS).map(([group, actions]) => (
        <div key={group}>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{group}</div>
          <div className="flex flex-wrap gap-3">
            {actions.map((a,i) => (
              <button
                key={i}
                onClick={() => handleAction(a)}
                disabled={executing === a.label}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all hover:scale-[1.02] disabled:opacity-60 ${a.bg} ${a.border}`}
                title={a.description}
              >
                {executing === a.label ? <Loader2 className={`w-4 h-4 ${a.color} animate-spin`} /> : <a.icon className={`w-4 h-4 ${a.color}`} />}
                <span className={`text-xs font-semibold ${a.color}`}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2235]">
          <div className="text-sm font-bold text-white">Action History ({history.length})</div>
        </div>
        <table className="w-full text-left">
          <thead className="border-b border-[#1e2235]">
            <tr className="text-[10px] uppercase tracking-widest text-gray-600">
              <th className="px-5 py-3">Time</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Executed By</th><th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1d2e]">
            {history.map((a,i)=>(
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-xs text-gray-500 font-mono">{a.ts}</td>
                <td className="px-4 py-3 text-xs text-gray-300 font-medium">{a.action}</td>
                <td className="px-4 py-3"><span className="text-xs font-mono text-amber-400">{a.target}</span></td>
                <td className="px-4 py-3"><div className="flex items-center gap-1.5"><Avatar name={a.actor} /><span className="text-xs text-gray-400">{a.actor}</span></div></td>
                <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                  a.status==="EXECUTED"||a.status==="Executed" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  : a.status==="FAILED" ? "text-red-400 bg-red-500/10 border-red-500/30"
                  : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                }`}>{a.status}</span></td>
              </tr>
            ))}
            {history.length===0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-gray-600">No actions executed yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function NotesTab({ caseId }) {
  const [channel, setChannel] = useState("Internal");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [posting, setPosting] = useState(false);
  const CHANNELS = ["Internal","Engineering","DevOps","Management","Merchant","Customer"];

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/notes`)
      .then(r => { if (r?.notes?.length) setNotes(r.notes.map(n => ({ author: n.authorName || n.author?.name || "Analyst", ts: new Date(n.createdAt).toLocaleString("en-IN",{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"}), channel: n.channel || "INTERNAL", content: n.content }))); })
      .catch(() => {});
  }, [caseId]);

  const postNote = async () => {
    if (!noteText.trim() || !caseId) return;
    setPosting(true);
    try {
      await adminRequest(`/soc/cases/${caseId}/notes`, { method: "POST", body: { content: noteText, channel } });
      setNoteText("");
      // Refresh
      const r = await adminRequest(`/soc/cases/${caseId}/notes`);
      if (r?.notes?.length) setNotes(r.notes.map(n => ({ author: n.authorName || n.author?.name || "Analyst", ts: new Date(n.createdAt).toLocaleString("en-IN",{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"}), channel: n.channel || "INTERNAL", content: n.content })));
    } catch {} finally { setPosting(false); }
  };

  const filtered = notes.filter(n => channel === "Internal" || (n.channel||"INTERNAL") === channel.toUpperCase() || (n.channel||"").toLowerCase() === channel.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto">
        {CHANNELS.map(c=>(
          <button key={c} onClick={()=>setChannel(c)} className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${channel===c?"bg-purple-500/20 border border-purple-500/40 text-purple-300":"text-gray-500 hover:text-gray-300 bg-white/5 border border-white/5"}`}>{c}</button>
        ))}
      </div>

      <Card className="p-4">
        <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Add a note... Use @mention to notify analysts"
          rows={3} className="w-full bg-[#0b0d14] border border-[#252840] rounded-xl px-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Channel: <span className="text-purple-400">{channel}</span></span>
          <button onClick={postNote} disabled={posting || !noteText.trim()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors">
            <Send className="w-3.5 h-3.5" /> {posting ? "Posting..." : "Post Note"}
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((n,i)=>(
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar name={n.author} size="md" />
              <div>
                <div className="text-xs font-semibold text-white">{n.author}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600">{n.ts}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">{n.channel}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{n.content}</p>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-8 text-gray-600 text-xs">No notes in this channel</div>}
      </div>
    </div>
  );
}


function AuditTab({ caseId }) {
  const [audit, setAudit] = useState(MOCK_AUDIT);
  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/audit`)
      .then(r => { if (r?.audit?.length) setAudit(r.audit.map(a => ({ ts: new Date(a.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), actor: a.actorName, ip: a.actorIp || "—", action: a.action, detail: typeof a.details === "object" ? JSON.stringify(a.details).slice(0,60) : String(a.details||"—") }))); })
      .catch(() => {});
  }, [caseId]);

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1e2235] flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-white">Audit Trail</div>
          <div className="text-[10px] text-gray-600 mt-0.5">Immutable. Entries cannot be edited or deleted.</div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-gray-200 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-[#1e2235]">
          <tr className="text-[10px] uppercase tracking-widest text-gray-600">
            <th className="px-6 py-3">Timestamp</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Detail</th><th className="px-4 py-3">IP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1d2e]">
          {audit.map((a,i)=>(
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-3 font-mono text-xs text-gray-500">{a.ts}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-1.5"><Avatar name={a.actor} /><span className="text-xs text-gray-300">{a.actor}</span></div></td>
              <td className="px-4 py-3"><span className="text-xs font-medium text-purple-400">{a.action}</span></td>
              <td className="px-4 py-3"><span className="text-xs text-gray-400">{a.detail}</span></td>
              <td className="px-4 py-3"><span className="text-xs font-mono text-gray-600">{a.ip}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function RelatedTab({ caseId }) {
  const router = useRouter();
  const [related, setRelated] = useState(MOCK_RELATED);

  useEffect(() => {
    if (!caseId || caseId.startsWith("fallback-")) return;
    adminRequest(`/soc/cases/${caseId}/related`)
      .then(r => {
        if (r?.related?.length) setRelated(r.related.map(rel => ({
          id: rel.relatedCase?.caseNumber || rel.relatedCaseId,
          _realId: rel.relatedCaseId,
          title: rel.relatedCase?.title || "Unknown Case",
          severity: rel.relatedCase?.severity || "MEDIUM",
          status: rel.relatedCase?.status || "OPEN",
          relation: rel.relationship || "Related",
          sim: rel.similarity || 0,
        })));
      })
      .catch(() => {});
  }, [caseId]);

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-white">Related Cases ({related.length})</div>
      {related.length === 0 ? (
        <Card className="p-8 text-center text-gray-600 text-xs">No related cases found</Card>
      ) : related.map((r,i)=>(
        <Card key={i} className="p-5 hover:border-purple-500/30 transition-all cursor-pointer" onClick={()=>router.push(`/soc/cases/${r._realId || r.id}`)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">{r.id}</span>
                <SeverityBadge level={r.severity} />
                <StatusBadge status={r.status} />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">{r.relation}</span>
              </div>
              <div className="text-sm font-medium text-gray-200">{r.title}</div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
              <div className="text-xs font-bold text-white">{r.sim}%</div>
              <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-purple-500" style={{width:`${r.sim}%`}} />
              </div>
              <span className="text-[9px] text-gray-600">similarity</span>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 hover:bg-purple-500/20 transition-colors">
              Open Case <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CaseInvestigationPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [slaSeconds, setSlaSeconds] = useState(2 * 3600 + 18 * 60 + 34);

  // Fetch case
  const loadCase = useCallback(async () => {
    try {
      const res = await adminRequest(`/soc/cases/${params.id}`);
      if (res?.case) setCaseData(res.case);
    } catch {
      // Fallback to mock data — displayCase will use MOCK_CASE
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { loadCase(); }, [loadCase]);

  // SLA countdown
  useEffect(() => {
    const t = setInterval(() => setSlaSeconds(s => Math.max(0, s-1)), 1000);
    return () => clearInterval(t);
  }, []);

  const slaH = Math.floor(slaSeconds / 3600);
  const slaM = Math.floor((slaSeconds % 3600) / 60);
  const slaS = slaSeconds % 60;
  const slaStr = `${slaH}h ${slaM.toString().padStart(2,"0")}m ${slaS.toString().padStart(2,"0")}s`;
  const slaUrgent = slaSeconds < 1800;

  const displayCase = {
    ...MOCK_CASE,
    ...(caseData || {}),
    id: params.id || MOCK_CASE.id,
  };

  const QUICK_ACTIONS = [
    { label:"Isolate Host",    icon:Server,   color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Network-isolate the host", target:"WIN-SRV-21" },
    { label:"Block IP",        icon:Network,  color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Add IP to firewall blocklist", target:"185.199.110.153" },
    { label:"Quarantine File", icon:Shield,   color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Move file to quarantine", target:"b2d3_f9a1.exe" },
    { label:"Disable User",    icon:UserX,    color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/30", description:"Disable user account", target:"merchant_admin" },
    { label:"Reset Password",  icon:Lock,     color:"text-blue-400",   bg:"bg-blue-500/10",   border:"border-blue-500/30",   description:"Force password reset", target:"merchant_admin" },
    { label:"Kill Process",    icon:X,        color:"text-gray-400",   bg:"bg-gray-500/10",   border:"border-gray-500/30",   description:"Terminate process", target:"b2d3_f9a1.exe" },
    { label:"Block Domain",    icon:Globe,    color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/30",    description:"Block at DNS level", target:"evil-update[.]com" },
    { label:"Revoke Session",  icon:Unlock,   color:"text-amber-400",  bg:"bg-amber-500/10",  border:"border-amber-500/30",  description:"Revoke all active sessions", target:"merchant_admin" },
    { label:"More Actions",    icon:Plus,     color:"text-purple-400", bg:"bg-purple-500/10", border:"border-purple-500/30", description:"See all available actions", target:null },
  ];

  const LIVE_ALERTS = [
    { color:"bg-red-500",    ts:"11:43 AM", msg:"Suspicious PowerShell execution on WIN-SRV-21" },
    { color:"bg-amber-500",  ts:"11:41 AM", msg:"New login from unusual country: Russia" },
    { color:"bg-yellow-400", ts:"11:39 AM", msg:"Multiple MFA failures for merchant_admin" },
  ];

  const renderTab = () => {
    const cid = params.id;
    switch(activeTab) {
      case "overview":    return <OverviewTab caseData={displayCase} />;
      case "timeline":    return <TimelineTab caseId={cid} />;
      case "logs":        return <LogsTab caseId={cid} />;
      case "evidence":    return <EvidenceTab caseId={cid} />;
      case "assets":      return <AssetsTab caseId={cid} />;
      case "users":       return <UsersTab caseId={cid} />;
      case "ioc":         return <IocTab caseId={cid} />;
      case "threatintel": return <ThreatIntelTab caseId={cid} />;
      case "mitre":       return <MitreTab caseData={displayCase} />;
      case "playbooks":   return <PlaybooksTab caseId={cid} />;
      case "response":    return <ResponseTab caseId={cid} onAction={a => setConfirmAction(a)} />;
      case "notes":       return <NotesTab caseId={cid} />;
      case "audit":       return <AuditTab caseId={cid} />;
      case "related":     return <RelatedTab caseId={cid} />;
      default:            return <OverviewTab caseData={displayCase} />;
    }
  };

  const TACTIC_COLORS = ["text-red-400","text-orange-400","text-amber-400","text-purple-400","text-blue-400","text-emerald-400"];

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily:"'Space Grotesk', sans-serif" }}>

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div className="border-b border-[#1e2235] bg-[#0f1117] px-8 py-5 sticky top-0 z-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
          <span>Security Operations</span><ChevronRight className="w-3 h-3" />
          <span>SOC</span><ChevronRight className="w-3 h-3" />
          <button onClick={()=>router.push("/soc/cases")} className="hover:text-purple-400 transition-colors">Cases</button><ChevronRight className="w-3 h-3" />
          <span className="text-purple-400 font-mono">{displayCase.id}</span>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <Siren className="w-4 h-4 text-red-400" />
              </div>
              <SeverityBadge level={displayCase.severity || "Critical"} />
              <StatusBadge status={displayCase.status || "In Progress"} />
            </div>
            <h1 className="text-lg font-bold text-white mb-2 truncate">{displayCase.title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 mb-3">
              {[
                ["Created At",        new Date(displayCase.createdAt).toLocaleString("en-IN",{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"})],
                ["Last Updated",      new Date(displayCase.updatedAt).toLocaleString("en-IN",{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"})],
                ["First Seen",        new Date(displayCase.firstSeen).toLocaleString("en-IN",{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"})],
                ["Source",            displayCase.source],
                ["Detection Rule",    displayCase.detectionRule],
                ["Owner / Assignee",  displayCase.assignee?.name],
              ].map(([l,v],i)=>(
                <span key={i}><span className="text-gray-700 uppercase tracking-wider">{l}:</span> <span className="text-gray-400">{v}</span></span>
              ))}
            </div>

            {/* MITRE tactics + Tags */}
            <div className="flex flex-wrap gap-1.5">
              {(displayCase.mitreaTactics || MOCK_CASE.mitreaTactics).map((t,i)=>(
                <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full font-bold bg-white/5 border border-white/10 ${TACTIC_COLORS[i%TACTIC_COLORS.length]}`}>{t}</span>
              ))}
              {(displayCase.tags || MOCK_CASE.tags).map((t,i)=>(
                <span key={i} className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-purple-500/10 border border-purple-500/20 text-purple-300">{t}</span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 text-xs font-medium transition-all">
              <Users className="w-3.5 h-3.5" /> Assign
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 text-xs font-medium transition-all">
              <Flag className="w-3.5 h-3.5" /> Escalate
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all">
              <Play className="w-3.5 h-3.5" /> Run Playbook
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white text-xs font-medium transition-all">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all">
              <X className="w-3.5 h-3.5" /> Close Case
            </button>
            <button className="p-2 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-500 hover:text-gray-200 transition-all">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────────── */}
      <div className="flex gap-6 px-8 py-6 items-start">

        {/* Left: Tab content */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex gap-0.5 overflow-x-auto mb-5 bg-[#0f1117] rounded-2xl border border-[#1e2235] p-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab===tab.id
                    ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/10"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : renderTab()}
        </div>

        {/* Right: Sticky panel */}
        <div className="w-72 shrink-0 space-y-4 sticky top-[200px]">

          {/* Case Health */}
          <Card className="p-4 flex flex-col items-center gap-2">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Case Health</div>
            <CaseHealthGauge score={84} size={90} />
          </Card>

          {/* Case Priority */}
          <Card className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Case Priority</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Flame className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-red-400">Critical</div>
                <div className="text-[10px] text-gray-600">Requires Immediate Attention</div>
              </div>
            </div>
          </Card>

          {/* SLA Countdown */}
          <Card className={`p-4 ${slaUrgent ? "border-red-500/30" : "border-amber-500/20"}`}>
            <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">SLA Countdown</div>
            <div className={`text-2xl font-extrabold font-mono ${slaUrgent ? "text-red-400" : "text-amber-400"}`}>{slaStr}</div>
            <div className={`text-[10px] mt-1 ${slaUrgent ? "text-red-500" : "text-gray-600"}`}>
              Due: May 27, 2025 02:00 PM
            </div>
          </Card>

          {/* IOC Summary */}
          <Card className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">IOC Summary</div>
            <div className="grid grid-cols-3 gap-2">
              {[["IP Addresses",18,"#ef4444"],["Domains",8,"#f97316"],["URLs",12,"#eab308"],["Hashes",6,"#8B5CF6"],["Emails",4,"#3b82f6"]].map(([l,v,c],i)=>(
                <div key={i} className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-extrabold" style={{color:c}}>{v}</span>
                  <span className="text-[8px] text-gray-600 text-center leading-tight mt-0.5">{l}</span>
                </div>
              ))}
            </div>
            <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">View all IOCs →</button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">Quick Actions</div>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((a,i)=>(
                <button key={i} onClick={()=>a.target && setConfirmAction(a)} title={a.label}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all hover:scale-105 ${a.bg} ${a.border}`}>
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                  <span className="text-[8px] font-semibold text-center leading-tight" style={{color:"#94a3b8"}}>{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Live Alerts */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-widest text-gray-600">Live Alerts</div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">3</span>
            </div>
            <div className="space-y-2.5">
              {LIVE_ALERTS.map((a,i)=>(
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 animate-pulse ${a.color}`} />
                  <div>
                    <div className="text-[9px] text-gray-600">{a.ts}</div>
                    <div className="text-[10px] text-gray-400 leading-relaxed">{a.msg}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors">View all live alerts →</button>
          </Card>
        </div>
      </div>

      {/* Confirm Action Modal */}
      {confirmAction && (
        <ConfirmActionModal
          action={confirmAction}
          onConfirm={async () => { /* TODO: call POST /soc/cases/:id/response */ }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
