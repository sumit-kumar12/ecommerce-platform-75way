"use client";

const TACTICS = [
  { id: "TA0001", label: "Initial Access",       color: "#ef4444" },
  { id: "TA0002", label: "Execution",            color: "#f97316" },
  { id: "TA0003", label: "Persistence",          color: "#eab308" },
  { id: "TA0004", label: "Privilege Escalation", color: "#a855f7" },
  { id: "TA0005", label: "Defense Evasion",      color: "#6366f1" },
  { id: "TA0006", label: "Credential Access",    color: "#ec4899" },
  { id: "TA0007", label: "Discovery",            color: "#14b8a6" },
  { id: "TA0008", label: "Lateral Movement",     color: "#3b82f6" },
  { id: "TA0009", label: "Collection",           color: "#22c55e" },
  { id: "TA0010", label: "Exfiltration",         color: "#f59e0b" },
  { id: "TA0011", label: "C2",                   color: "#64748b" },
  { id: "TA0040", label: "Impact",               color: "#dc2626" },
];

const TECHNIQUES_BY_TACTIC = {
  TA0001: ["T1566 Phishing","T1078 Valid Accounts","T1190 Exploit Public App"],
  TA0002: ["T1059 Scripting","T1053 Scheduled Task","T1204 User Execution"],
  TA0003: ["T1547 Boot Autostart","T1098 Account Manip","T1543 Create Service"],
  TA0004: ["T1548 Abuse Elevation","T1078 Valid Accounts","T1068 Exploit Vuln"],
  TA0005: ["T1027 Obfuscation","T1070 Indicator Removal","T1562 Impair Defense"],
  TA0006: ["T1110 Brute Force","T1003 OS Cred Dump","T1555 Password Stores"],
  TA0007: ["T1046 Network Scan","T1082 System Info","T1087 Account Discovery"],
  TA0008: ["T1021 Remote Services","T1534 Internal Spearphish","T1570 Lateral Transfer"],
  TA0009: ["T1005 Local Data","T1119 Auto Collection","T1560 Archive Data"],
  TA0010: ["T1041 C2 Channel","T1567 Web Service","T1048 Alt Protocol"],
  TA0011: ["T1071 App Layer","T1095 Non-App Layer","T1132 Data Encoding"],
  TA0040: ["T1485 Data Destruction","T1486 Ransomware","T1499 DoS"],
};

export function MitreMatrix({ activeTechniques = [], activeTactics = [] }) {
  const activeSet = new Set([...activeTechniques, ...activeTactics]);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 min-w-max pb-2">
        {TACTICS.map((tactic) => {
          const techniques = TECHNIQUES_BY_TACTIC[tactic.id] || [];
          const isTacticActive = activeSet.has(tactic.id) || activeSet.has(tactic.label);

          return (
            <div key={tactic.id} className="flex flex-col gap-1.5 w-32">
              {/* Tactic header */}
              <div
                className={`px-2 py-1.5 rounded-lg text-center text-[9px] font-bold uppercase tracking-wider transition-all ${
                  isTacticActive
                    ? "text-white border"
                    : "text-gray-600 bg-white/[0.03] border border-white/5"
                }`}
                style={isTacticActive ? {
                  background: `${tactic.color}22`,
                  borderColor: `${tactic.color}55`,
                  color: tactic.color,
                  boxShadow: `0 0 8px ${tactic.color}22`
                } : {}}
              >
                <div className="text-[8px] opacity-60 mb-0.5">{tactic.id}</div>
                <div className="leading-tight">{tactic.label}</div>
              </div>
              {/* Techniques */}
              {techniques.map((tech, ti) => {
                const techId = tech.split(" ")[0];
                const isActive = activeSet.has(techId) || activeSet.has(tech) || (isTacticActive && ti === 0);
                return (
                  <div
                    key={tech}
                    className={`px-2 py-1.5 rounded text-[9px] leading-tight font-medium cursor-default transition-all ${
                      isActive ? "text-white" : "text-gray-700 bg-white/[0.02]"
                    }`}
                    style={isActive ? {
                      background: `${tactic.color}25`,
                      border: `1px solid ${tactic.color}50`,
                      boxShadow: `0 0 6px ${tactic.color}15`
                    } : { border: "1px solid rgba(255,255,255,0.05)" }}
                    title={tech}
                  >
                    <div className="text-[8px] opacity-60">{techId}</div>
                    <div className="truncate">{tech.replace(techId + " ", "")}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
