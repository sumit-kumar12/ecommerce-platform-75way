// ─── SOC Case Detail Controller ───────────────────────────────────────────────
// Handles all 14 tab sub-resources: timeline, evidence, IOCs, notes, audit,
// assets, users, related cases, playbooks, and response actions.

import { prisma } from "../config/prisma.js";
import { enrichIoc } from "../services/intel-enrichment.service.js";
import { triggerPlaybookRun } from "../services/playbook-engine.service.js";
import { executeResponseAction } from "../services/response-action.service.js";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// ─── Timeline ──────────────────────────────────────────────────────────────────

export const getCaseTimelineController = async (req, res) => {
  try {
    const { id } = req.params;
    const timeline = await prisma.socCaseTimeline.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "asc" },
    });
    return res.json({ timeline });
  } catch {
    return res.status(500).json({ error: "Failed to fetch timeline" });
  }
};

export const addCaseTimelineController = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventType, description, source } = req.body;
    if (!description) return res.status(400).json({ error: "description is required" });
    const entry = await prisma.socCaseTimeline.create({
      data: { caseId: id, eventType: eventType ?? "Manual Entry", description, actorId: req.user.id, actorName: req.user.name, source: source ?? "Analyst" },
    });
    return res.status(201).json({ entry });
  } catch {
    return res.status(500).json({ error: "Failed to add timeline entry" });
  }
};

// ─── Evidence ──────────────────────────────────────────────────────────────────
// Files are stored to public/evidence/{caseId}/ — metadata-only in DB.
// This avoids base64 bloat and keeps RAM usage minimal.

const EVIDENCE_DIR = path.join(process.cwd(), "public", "evidence");

export const getCaseEvidenceController = async (req, res) => {
  try {
    const { id } = req.params;
    const evidence = await prisma.socCaseEvidence.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ evidence });
  } catch {
    return res.status(500).json({ error: "Failed to fetch evidence" });
  }
};

export const addCaseEvidenceController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, source, metadata, fileHash, fileSize } = req.body;
    if (!name || !type) return res.status(400).json({ error: "name and type are required" });

    // Handle file upload if multipart (raw binary stored to disk)
    let filePath = null;
    if (req.file) {
      const dir = path.join(EVIDENCE_DIR, id);
      fs.mkdirSync(dir, { recursive: true });
      filePath = path.join(dir, `${Date.now()}_${req.file.originalname}`);
      fs.writeFileSync(filePath, req.file.buffer);
    }

    const evidence = await prisma.socCaseEvidence.create({
      data: {
        caseId: id, name, type, source: source ?? "Analyst",
        fileHash, fileSize: fileSize ? Number(fileSize) : undefined,
        filePath: filePath ? path.relative(process.cwd(), filePath) : undefined,
        integrity: fileHash ? "VERIFIED" : "UNVERIFIED",
        uploadedById: req.user.id,
        metadata: metadata ?? null,
      },
    });

    await prisma.socCaseTimeline.create({
      data: { caseId: id, eventType: "Evidence Added", description: `Evidence "${name}" (${type}) added by ${req.user.name}`, actorId: req.user.id, actorName: req.user.name, source: "Analyst" },
    });
    await prisma.socCaseAudit.create({
      data: { caseId: id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: "Evidence Added", details: { name, type, fileHash } },
    });

    return res.status(201).json({ evidence });
  } catch (err) {
    return res.status(500).json({ error: "Failed to add evidence" });
  }
};

export const deleteCaseEvidenceController = async (req, res) => {
  try {
    const { id, eid } = req.params;
    const ev = await prisma.socCaseEvidence.findUnique({ where: { id: eid } });
    if (!ev || ev.caseId !== id) return res.status(404).json({ error: "Evidence not found" });

    // Delete file from disk if exists
    if (ev.filePath) {
      const fullPath = path.join(process.cwd(), ev.filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await prisma.socCaseEvidence.delete({ where: { id: eid } });
    await prisma.socCaseAudit.create({
      data: { caseId: id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: "Evidence Deleted", details: { name: ev.name } },
    });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete evidence" });
  }
};

// ─── IOCs ─────────────────────────────────────────────────────────────────────

export const getCaseIocsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const iocs = await prisma.socCaseIoc.findMany({
      where: { caseId: id, ...(type ? { type } : {}) },
      orderBy: [{ reputation: "asc" }, { createdAt: "desc" }],
    });
    return res.json({ iocs });
  } catch {
    return res.status(500).json({ error: "Failed to fetch IOCs" });
  }
};

export const addCaseIocController = async (req, res) => {
  try {
    const { id } = req.params;
    const { indicator, type, reputation = "UNKNOWN", firstSeen, lastSeen } = req.body;
    if (!indicator || !type) return res.status(400).json({ error: "indicator and type are required" });

    const ioc = await prisma.socCaseIoc.create({
      data: {
        caseId: id, indicator, type, reputation,
        firstSeen: firstSeen ? new Date(firstSeen) : new Date(),
        lastSeen: lastSeen ? new Date(lastSeen) : new Date(),
        addedById: req.user.id,
      },
    });

    // Fire async enrichment
    setImmediate(() => enrichIoc(ioc.id));

    await prisma.socCaseAudit.create({
      data: { caseId: id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: "IOC Added", details: { indicator, type } },
    });
    return res.status(201).json({ ioc });
  } catch {
    return res.status(500).json({ error: "Failed to add IOC" });
  }
};

export const deleteCaseIocController = async (req, res) => {
  try {
    const { id, iid } = req.params;
    const ioc = await prisma.socCaseIoc.findUnique({ where: { id: iid } });
    if (!ioc || ioc.caseId !== id) return res.status(404).json({ error: "IOC not found" });
    await prisma.socCaseIoc.delete({ where: { id: iid } });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete IOC" });
  }
};

export const enrichCaseIocController = async (req, res) => {
  try {
    const { id, iid } = req.params;
    const ioc = await prisma.socCaseIoc.findUnique({ where: { id: iid } });
    if (!ioc || ioc.caseId !== id) return res.status(404).json({ error: "IOC not found" });
    setImmediate(() => enrichIoc(iid));
    return res.json({ ok: true, message: "Enrichment started in background" });
  } catch {
    return res.status(500).json({ error: "Failed to start enrichment" });
  }
};

// ─── Notes ────────────────────────────────────────────────────────────────────

export const getCaseNotesController = async (req, res) => {
  try {
    const { id } = req.params;
    const { channel } = req.query;
    const notes = await prisma.socCaseNote.findMany({
      where: { caseId: id, ...(channel ? { channel } : {}) },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
    return res.json({ notes });
  } catch {
    return res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const addCaseNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, channel = "INTERNAL", mentions } = req.body;
    if (!content) return res.status(400).json({ error: "content is required" });

    const note = await prisma.socCaseNote.create({
      data: {
        caseId: id, content, channel,
        authorId: req.user.id, authorName: req.user.name,
        mentions: mentions ? JSON.stringify(mentions) : null,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
    return res.status(201).json({ note });
  } catch {
    return res.status(500).json({ error: "Failed to add note" });
  }
};

// ─── Audit ────────────────────────────────────────────────────────────────────

export const getCaseAuditController = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const audit = await prisma.socCaseAudit.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return res.json({ audit, total: audit.length, immutable: true });
  } catch {
    return res.status(500).json({ error: "Failed to fetch audit trail" });
  }
};

// ─── Assets ───────────────────────────────────────────────────────────────────

export const getCaseAssetsController = async (req, res) => {
  try {
    const assets = await prisma.socCaseAsset.findMany({ where: { caseId: req.params.id }, orderBy: { createdAt: "desc" } });
    return res.json({ assets });
  } catch {
    return res.status(500).json({ error: "Failed to fetch assets" });
  }
};

export const addCaseAssetController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, riskLevel, hostname, ipAddress, eventCount, metadata } = req.body;
    if (!name || !type) return res.status(400).json({ error: "name and type are required" });
    const asset = await prisma.socCaseAsset.create({
      data: { caseId: id, name, type, riskLevel: riskLevel ?? "MEDIUM", hostname, ipAddress, eventCount: eventCount ?? 0, metadata },
    });
    return res.status(201).json({ asset });
  } catch {
    return res.status(500).json({ error: "Failed to add asset" });
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getCaseUsersController = async (req, res) => {
  try {
    const users = await prisma.socCaseUser.findMany({ where: { caseId: req.params.id }, orderBy: { riskScore: "desc" } });
    return res.json({ users });
  } catch {
    return res.status(500).json({ error: "Failed to fetch case users" });
  }
};

export const addCaseUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, riskScore, failedLogins, mfaEnabled, userId } = req.body;
    if (!email) return res.status(400).json({ error: "email is required" });
    const user = await prisma.socCaseUser.create({
      data: { caseId: id, email, name, role, riskScore: riskScore ?? 0, failedLogins: failedLogins ?? 0, mfaEnabled: mfaEnabled ?? false, userId },
    });
    return res.status(201).json({ user });
  } catch {
    return res.status(500).json({ error: "Failed to add case user" });
  }
};

// ─── Related Cases ─────────────────────────────────────────────────────────────

export const getCaseRelatedController = async (req, res) => {
  try {
    const { id } = req.params;
    const related = await prisma.socCaseRelated.findMany({
      where: { primaryCaseId: id },
      include: {
        relatedCase: {
          select: { id: true, caseNumber: true, title: true, severity: true, status: true, createdAt: true },
        },
      },
      orderBy: { similarity: "desc" },
    });
    return res.json({ related });
  } catch {
    return res.status(500).json({ error: "Failed to fetch related cases" });
  }
};

// ─── Playbooks ─────────────────────────────────────────────────────────────────

export const getCasePlaybooksController = async (req, res) => {
  try {
    const { id } = req.params;
    const [playbooks, runs] = await Promise.all([
      prisma.socPlaybook.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
      prisma.socPlaybookRun.findMany({ where: { caseId: id }, orderBy: { createdAt: "desc" } }),
    ]);

    const runsByCaseId = runs.reduce((acc, r) => {
      if (!acc[r.playbookId] || r.createdAt > acc[r.playbookId].createdAt) acc[r.playbookId] = r;
      return acc;
    }, {});

    return res.json({
      playbooks: playbooks.map(p => ({
        ...p,
        lastRun: runsByCaseId[p.id] ?? null,
        stepsTotal: Array.isArray(p.steps) ? p.steps.length : 0,
      })),
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch playbooks" });
  }
};

export const runCasePlaybookController = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const caseRow = await prisma.socCase.findUnique({ where: { id }, select: { id: true } });
    if (!caseRow) return res.status(404).json({ error: "Case not found" });

    const run = await triggerPlaybookRun(id, pid, req.user.id);

    await prisma.socCaseAudit.create({
      data: { caseId: id, actorId: req.user.id, actorName: req.user.name, actorIp: req.ip, action: "Playbook Started", details: { playbookId: pid, runId: run.id } },
    });
    return res.status(201).json({ run });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to start playbook" });
  }
};

// ─── Response Actions ──────────────────────────────────────────────────────────

export const getCaseResponseActionsController = async (req, res) => {
  try {
    const actions = await prisma.socResponseAction.findMany({
      where: { caseId: req.params.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ actions });
  } catch {
    return res.status(500).json({ error: "Failed to fetch response actions" });
  }
};

export const executeCaseResponseActionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType, target, reason } = req.body;
    if (!actionType) return res.status(400).json({ error: "actionType is required" });

    const caseRow = await prisma.socCase.findUnique({ where: { id }, select: { id: true } });
    if (!caseRow) return res.status(404).json({ error: "Case not found" });

    const { action, result } = await executeResponseAction({
      caseId: id,
      actionType,
      target,
      reason,
      executedById: req.user.id,
      actorName: req.user.name,
      actorIp: req.ip,
    });

    return res.status(201).json({ action, result });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to execute action" });
  }
};
