// ─── Seed: SOC Playbooks ──────────────────────────────────────────────────────
// Seeds 7 default enterprise SOC playbooks.
// Safe to re-run — uses upsert on name.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PLAYBOOKS = [
  {
    name: "Phishing Response",
    description: "Standard response procedure for phishing attacks and suspicious email activity.",
    category: "Email Security",
    autoRun: false,
    steps: [
      { id: 1, title: "Isolate affected user sessions", type: "revoke_sessions", order: 1, config: {} },
      { id: 2, title: "Block sender domain", type: "block_domain", order: 2, config: {} },
      { id: 3, title: "Add timeline event — emails purged", type: "add_timeline", order: 3, config: { eventType: "Phishing Emails Deleted", description: "Analyst must delete phishing emails from all mailboxes." } },
      { id: 4, title: "Disable compromised account", type: "disable_user", order: 4, config: {} },
      { id: 5, title: "Notify security team", type: "send_notification", order: 5, config: { message: "Phishing incident active — analyst action required", severity: "HIGH" } },
      { id: 6, title: "Collect email headers as evidence", type: "add_timeline", order: 6, config: { eventType: "Evidence Collection", description: "Analyst must collect email headers and artifacts." } },
      { id: 7, title: "Initiate password reset", type: "add_timeline", order: 7, config: { eventType: "Password Reset Required", description: "User must reset password and re-enroll MFA." } },
      { id: 8, title: "Mark case in-progress", type: "update_status", order: 8, config: { status: "IN_PROGRESS" } },
    ],
  },
  {
    name: "Malware Response",
    description: "Automated response for detected malware, ransomware, or infostealer activity.",
    category: "Endpoint Security",
    autoRun: false,
    steps: [
      { id: 1, title: "Isolate host via EDR", type: "edr_action", order: 1, config: { action: "ISOLATE_HOST" } },
      { id: 2, title: "Kill malicious process", type: "edr_action", order: 2, config: { action: "KILL_PROCESS" } },
      { id: 3, title: "Quarantine detected file", type: "add_timeline", order: 3, config: { eventType: "File Quarantined", description: "Analyst must quarantine identified malicious file via EDR." } },
      { id: 4, title: "Block malicious IP/C2", type: "block_ip", order: 4, config: {} },
      { id: 5, title: "Notify security team", type: "send_notification", order: 5, config: { message: "Malware detected — host isolated", severity: "CRITICAL" } },
      { id: 6, title: "Collect memory dump evidence", type: "add_timeline", order: 6, config: { eventType: "Memory Dump Required", description: "Collect memory dump for forensics before reimaging." } },
      { id: 7, title: "Mark case critical", type: "update_status", order: 7, config: { status: "IN_PROGRESS" } },
    ],
  },
  {
    name: "Account Takeover Response",
    description: "Response for suspected account compromise, credential theft, or unauthorized access.",
    category: "Identity Security",
    autoRun: false,
    steps: [
      { id: 1, title: "Disable compromised user account", type: "disable_user", order: 1, config: {} },
      { id: 2, title: "Revoke all active sessions", type: "revoke_sessions", order: 2, config: {} },
      { id: 3, title: "Lock account temporarily", type: "lock_account", order: 3, config: { minutes: 1440 } },
      { id: 4, title: "Notify user of compromise", type: "send_notification", order: 4, config: { message: "Your account has been secured due to suspicious activity.", severity: "HIGH" } },
      { id: 5, title: "Log investigation start", type: "add_timeline", order: 5, config: { eventType: "Investigation Started", description: "Analyst investigating access logs for unauthorized activity." } },
      { id: 6, title: "Update case to in-progress", type: "update_status", order: 6, config: { status: "IN_PROGRESS" } },
    ],
  },
  {
    name: "API Abuse Response",
    description: "Handles excessive API calls, credential stuffing, or API key misuse.",
    category: "API Security",
    autoRun: false,
    steps: [
      { id: 1, title: "Revoke API key / sessions", type: "revoke_sessions", order: 1, config: {} },
      { id: 2, title: "Block source IP", type: "block_ip", order: 2, config: {} },
      { id: 3, title: "Notify merchant / API owner", type: "send_notification", order: 3, config: { message: "API abuse detected on your account. Keys have been revoked.", severity: "HIGH" } },
      { id: 4, title: "Log API usage audit request", type: "add_timeline", order: 4, config: { eventType: "API Audit Required", description: "Analyst must pull full API usage logs for this key." } },
      { id: 5, title: "Update case status", type: "update_status", order: 5, config: { status: "IN_PROGRESS" } },
    ],
  },
  {
    name: "Data Exfiltration Response",
    description: "Response for suspected or confirmed data exfiltration events.",
    category: "Data Security",
    autoRun: false,
    steps: [
      { id: 1, title: "Isolate source host", type: "edr_action", order: 1, config: { action: "ISOLATE_HOST" } },
      { id: 2, title: "Block outbound destination IP", type: "block_ip", order: 2, config: {} },
      { id: 3, title: "Capture network evidence", type: "add_timeline", order: 3, config: { eventType: "PCAP Required", description: "Analyst must capture network traffic PCAP for forensics." } },
      { id: 4, title: "Notify Data Protection Officer", type: "send_notification", order: 4, config: { message: "Potential data exfiltration detected — immediate review required.", severity: "CRITICAL" } },
      { id: 5, title: "Escalate to compliance team", type: "add_timeline", order: 5, config: { eventType: "Compliance Escalated", description: "Case escalated to compliance and legal for GDPR/data breach assessment." } },
      { id: 6, title: "Update case critical status", type: "update_status", order: 6, config: { status: "IN_PROGRESS" } },
    ],
  },
  {
    name: "Privilege Escalation Response",
    description: "Handles unauthorized privilege escalation attempts.",
    category: "Identity Security",
    autoRun: false,
    steps: [
      { id: 1, title: "Lock escalated account", type: "lock_account", order: 1, config: { minutes: 1440 } },
      { id: 2, title: "Revoke all sessions", type: "revoke_sessions", order: 2, config: {} },
      { id: 3, title: "Log privilege change audit", type: "add_timeline", order: 3, config: { eventType: "Privilege Audit", description: "Analyst must audit all privilege changes for this account in last 24h." } },
      { id: 4, title: "Notify security team", type: "send_notification", order: 4, config: { message: "Privilege escalation detected — account locked pending investigation.", severity: "CRITICAL" } },
      { id: 5, title: "Force MFA re-enrollment", type: "add_timeline", order: 5, config: { eventType: "MFA Re-enrollment Required", description: "User must re-enroll MFA after privilege review completes." } },
    ],
  },
  {
    name: "Insider Threat Response",
    description: "Comprehensive response for potential insider threat or data misuse incidents.",
    category: "Insider Threat",
    autoRun: false,
    steps: [
      { id: 1, title: "Disable insider account", type: "disable_user", order: 1, config: {} },
      { id: 2, title: "Revoke all sessions immediately", type: "revoke_sessions", order: 2, config: {} },
      { id: 3, title: "Preserve evidence", type: "add_timeline", order: 3, config: { eventType: "Evidence Preserved", description: "Analyst must preserve all logs and activity before account deletion." } },
      { id: 4, title: "Notify HR and Legal", type: "send_notification", order: 4, config: { message: "Insider threat case opened. HR and Legal notification required.", severity: "CRITICAL" } },
      { id: 5, title: "Audit file and data access", type: "add_timeline", order: 5, config: { eventType: "Data Access Audit", description: "Audit all data accessed by this user in the past 30 days." } },
      { id: 6, title: "Request forensic image", type: "edr_action", order: 6, config: { action: "FORENSIC_IMAGE" } },
      { id: 7, title: "Document for compliance report", type: "add_timeline", order: 7, config: { eventType: "Compliance Documentation", description: "Document incident for compliance and regulatory reporting." } },
      { id: 8, title: "Mark case in-progress", type: "update_status", order: 8, config: { status: "IN_PROGRESS" } },
    ],
  },
];

async function main() {
  console.log("Seeding SOC playbooks...\n");
  for (const pb of PLAYBOOKS) {
    await prisma.socPlaybook.upsert({
      where: { name: pb.name },
      create: pb,
      update: { description: pb.description, steps: pb.steps, category: pb.category },
    });
    console.log(`  ✅ ${pb.name} (${pb.steps.length} steps)`);
  }
  console.log(`\n✅ Seeded ${PLAYBOOKS.length} playbooks successfully.`);
}

main()
  .catch((err) => {
    console.error("❌ Playbook seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
