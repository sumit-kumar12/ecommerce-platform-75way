// ─── Intel Enrichment Service ─────────────────────────────────────────────────
// Async IOC enrichment via VirusTotal, AbuseIPDB, and GreyNoise.
// Keys are stored in SiemConfig (plain text for development; consider encrypt at rest in production).
// Enrichment is always async — never blocks the request.

import { prisma } from "../config/prisma.js";
import { loggers } from "../config/logger.js";

const FETCH_TIMEOUT_MS = 10_000;

// ─── VirusTotal ────────────────────────────────────────────────────────────────

async function vtLookup(indicator, type, apiKey) {
  let url;
  if (type === "IP")         url = `https://www.virustotal.com/api/v3/ip_addresses/${encodeURIComponent(indicator)}`;
  else if (type === "DOMAIN") url = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(indicator)}`;
  else if (type === "HASH_SHA256") url = `https://www.virustotal.com/api/v3/files/${encodeURIComponent(indicator)}`;
  else if (type === "URL")   url = `https://www.virustotal.com/api/v3/urls/${Buffer.from(indicator).toString("base64url")}`;
  else return null;

  const resp = await fetch(url, {
    headers: { "x-apikey": apiKey },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!resp.ok) {
    loggers.security.warn({ eventType: "intel_vt_error", details: { status: resp.status, indicator } });
    return null;
  }

  const data = await resp.json();
  const stats = data?.data?.attributes?.last_analysis_stats ?? {};
  return {
    malicious: stats.malicious ?? 0,
    suspicious: stats.suspicious ?? 0,
    clean: stats.undetected ?? 0,
    totalEngines: Object.values(stats).reduce((a, b) => a + b, 0),
    country: data?.data?.attributes?.country ?? null,
    asn: data?.data?.attributes?.asn ?? null,
    permalink: `https://www.virustotal.com/gui/ip-address/${indicator}`,
  };
}

// ─── AbuseIPDB (IP only) ───────────────────────────────────────────────────────

async function abuseIpLookup(ip, apiKey) {
  const resp = await fetch(
    `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`,
    {
      headers: { Key: apiKey, Accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }
  );
  if (!resp.ok) return null;
  const { data } = await resp.json();
  return {
    abuseConfidenceScore: data?.abuseConfidenceScore ?? 0,
    totalReports: data?.totalReports ?? 0,
    countryCode: data?.countryCode ?? null,
    isp: data?.isp ?? null,
    isWhitelisted: data?.isWhitelisted ?? false,
    permalink: `https://www.abuseipdb.com/check/${ip}`,
  };
}

// ─── GreyNoise (IP only) ───────────────────────────────────────────────────────

async function greyNoiseLookup(ip, apiKey) {
  const resp = await fetch(`https://api.greynoise.io/v3/community/${encodeURIComponent(ip)}`, {
    headers: { key: apiKey },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  return {
    noise: data?.noise ?? false,
    riot: data?.riot ?? false,
    classification: data?.classification ?? "unknown",
    name: data?.name ?? null,
    link: data?.link ?? null,
    message: data?.message ?? null,
  };
}

// ─── Reputation Calculator ─────────────────────────────────────────────────────

function calculateReputation(vtResult, abuseResult) {
  const malicious = vtResult?.malicious ?? 0;
  const abuseScore = abuseResult?.abuseConfidenceScore ?? 0;

  if (malicious >= 5 || abuseScore >= 80) return { reputation: "MALICIOUS", score: Math.min(100, malicious * 2 + Math.floor(abuseScore / 2)) };
  if (malicious >= 1 || abuseScore >= 40) return { reputation: "SUSPICIOUS", score: Math.min(80, malicious * 10 + Math.floor(abuseScore / 3)) };
  return { reputation: "CLEAN", score: Math.max(0, abuseScore / 2) };
}

// ─── Main Enrichment Function ──────────────────────────────────────────────────

/**
 * Enrich a single IOC. Called asynchronously — does not throw.
 * @param {string} iocId - SocCaseIoc.id
 */
export async function enrichIoc(iocId) {
  try {
    const ioc = await prisma.socCaseIoc.findUnique({ where: { id: iocId } });
    if (!ioc) return;

    const config = await prisma.siemConfig.findUnique({ where: { id: "singleton" } });
    if (!config?.enrichmentEnabled) return;

    const [vtResult, abuseResult, gnResult] = await Promise.allSettled([
      config.vtApiKey   ? vtLookup(ioc.indicator, ioc.type, config.vtApiKey) : Promise.resolve(null),
      ioc.type === "IP" && config.abuseApiKey ? abuseIpLookup(ioc.indicator, config.abuseApiKey) : Promise.resolve(null),
      ioc.type === "IP" && config.gnApiKey    ? greyNoiseLookup(ioc.indicator, config.gnApiKey)  : Promise.resolve(null),
    ]);

    const vt    = vtResult.status    === "fulfilled" ? vtResult.value    : null;
    const abuse = abuseResult.status === "fulfilled" ? abuseResult.value : null;
    const gn    = gnResult.status    === "fulfilled" ? gnResult.value    : null;

    const { reputation, score } = calculateReputation(vt, abuse);

    await prisma.socCaseIoc.update({
      where: { id: iocId },
      data: {
        vtResult:    vt    ?? undefined,
        abuseResult: abuse ?? undefined,
        gnResult:    gn    ?? undefined,
        reputation,
        threatScore: score,
        enrichedAt:  new Date(),
      },
    });

    loggers.security.info({
      eventType: "intel_enrichment_complete",
      details: { iocId, indicator: ioc.indicator, type: ioc.type, reputation, score },
    });
  } catch (err) {
    loggers.error.error({
      eventType: "intel_enrichment_failed",
      details: { iocId, err: err.message },
    });
  }
}

/**
 * Enrich all un-enriched IOCs for a case.
 */
export async function enrichCaseIocs(caseId) {
  const iocs = await prisma.socCaseIoc.findMany({
    where: { caseId, enrichedAt: null },
    select: { id: true },
  });
  // Fire async — don't await, non-blocking
  for (const ioc of iocs) {
    setImmediate(() => enrichIoc(ioc.id));
  }
}
