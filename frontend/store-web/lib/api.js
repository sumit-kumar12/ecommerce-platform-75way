const DEFAULT_API_BASE = "http://localhost:4000/api/v1";

const trimTrailingSlash = (value) => String(value ?? "").replace(/\/+$/, "");

const parseUrl = (value, fallback) => {
  try {
    return new URL(value);
  } catch {
    return new URL(fallback);
  }
};

const replaceUrlHost = (url, host) => {
  const cloned = new URL(url.toString());
  cloned.hostname = host;
  return trimTrailingSlash(cloned.toString());
};

const getRuntimeHostname = () => {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return String(window.location.hostname).trim().toLowerCase();
  }
  if (typeof globalThis !== "undefined" && globalThis.location?.hostname) {
    return String(globalThis.location.hostname).trim().toLowerCase();
  }
  return "";
};

const buildApiBaseCandidates = (configuredBase) => {
  if (typeof window !== "undefined") {
    return ["/api-proxy/api/v1"];
  }
  const parsed = parseUrl(configuredBase, DEFAULT_API_BASE);
  const runtimeHost = getRuntimeHostname();
  const hosts = Array.from(new Set([runtimeHost, parsed.hostname, "localhost", "127.0.0.1"].filter(Boolean)));
  return hosts.map((host) => replaceUrlHost(parsed, host));
};

const parseJsonSafe = async (response) => response.json().catch(() => ({}));

const API_BASE_CANDIDATES = buildApiBaseCandidates(process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_API_BASE);

let activeApiBase = API_BASE_CANDIDATES[0];
let baseResolved = false;
let cachedCsrfToken = null;
let csrfPromise = null;
let refreshPromise = null;

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const isCsrfValidationFailure = (response, payload) => {
  if (response.status !== 403) return false;
  const code = String(payload?.code || "").toUpperCase();
  const error = String(payload?.error || payload?.message || "").toLowerCase();
  return code === "CSRF_VALIDATION_FAILED" || error.includes("csrf");
};

const hexFromBytes = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const generateSecureIdChunk = () => {
  const webCrypto = globalThis.crypto;

  if (typeof webCrypto?.randomUUID === "function") {
    return webCrypto.randomUUID().replaceAll("-", "");
  }

  if (typeof webCrypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    webCrypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return hexFromBytes(bytes);
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}${Math.random()
    .toString(16)
    .slice(2)}`;
};

export const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return "server-render";
  const existing = window.localStorage.getItem("device-id");
  if (existing && existing.length >= 16) return existing;
  const generated = `${generateSecureIdChunk()}${generateSecureIdChunk()}`.replace(/[^a-f0-9]/gi, "");
  const normalized = generated.length >= 16 ? generated : `${generated}0000000000000000`.slice(0, 16);
  window.localStorage.setItem("device-id", normalized);
  return normalized;
};

const fetchCsrfToken = async () => {
  const attemptErrors = [];
  const orderedBases = [activeApiBase, ...API_BASE_CANDIDATES.filter((base) => base !== activeApiBase)];

  for (const base of orderedBases) {
    const response = await fetch(`${base}/auth/csrf-token`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-device-id": getOrCreateDeviceId(),
      },
      cache: "no-store",
    }).catch((error) => {
      attemptErrors.push(`${base} -> network_error (${error?.message ?? "unknown"})`);
      return null;
    });

    if (!response) continue;

    if (!response.ok) {
      const payload = await parseJsonSafe(response);
      attemptErrors.push(`${base} -> ${response.status}${payload?.error ? ` (${payload.error})` : ""}`);
      continue;
    }

    const payload = await parseJsonSafe(response);
    if (!payload?.csrfToken) {
      attemptErrors.push(`${base} -> 200 (csrfToken missing)`);
      continue;
    }

    activeApiBase = base;
    baseResolved = true;
    cachedCsrfToken = payload.csrfToken;
    return cachedCsrfToken;
  }

  throw new Error(`CSRF token request failed. Attempts: ${attemptErrors.join(" | ")}`);
};

const getCsrfToken = async () => {
  if (cachedCsrfToken) return cachedCsrfToken;
  if (csrfPromise) return csrfPromise;
  csrfPromise = fetchCsrfToken().finally(() => {
    csrfPromise = null;
  });
  return csrfPromise;
};

const ensureApiBaseResolved = async () => {
  if (baseResolved) return;
  await getCsrfToken();
};

export const apiRequest = async (
  path,
  { method = "GET", body, csrf = true, refresh = true, isRetry = false, csrfRetry = false, keepalive = false } = {},
) => {
  await ensureApiBaseResolved();

  const upperMethod = method.toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    "x-device-id": getOrCreateDeviceId(),
  };

  if (!safeMethods.has(upperMethod) && csrf) {
    headers["x-csrf-token"] = await getCsrfToken();
  }

  const createRequestInit = () => ({
    method: upperMethod,
    credentials: "include",
    headers: { ...headers },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    keepalive: keepalive ? true : undefined,
  });

  let requestInit = createRequestInit();

  let response = await fetch(`${activeApiBase}${path}`, requestInit);
  let responsePayload = null;

  // Heal stale or missing CSRF tokens once, then replay the original request.
  if (!response.ok && !safeMethods.has(upperMethod) && csrf && !csrfRetry) {
    const firstPayload = await parseJsonSafe(response);
    responsePayload = firstPayload;
    if (isCsrfValidationFailure(response, firstPayload)) {
      cachedCsrfToken = null;
      headers["x-csrf-token"] = await getCsrfToken();
      requestInit = createRequestInit();
      response = await fetch(`${activeApiBase}${path}`, requestInit);
      responsePayload = null;
    }
  }

  if (!response.ok && responsePayload === null) {
    responsePayload = await parseJsonSafe(response);
  }

  const isAuthFailure = response.status === 401 || responsePayload?.code === "AUTH_REQUIRED";

  // Handle authentication failure with automated refresh
  if (!response.ok && isAuthFailure && refresh && !isRetry && !path.includes("/auth/login") && !path.includes("/auth/refresh")) {
    try {
      if (!refreshPromise) {
        refreshPromise = apiRequest("/auth/refresh", { method: "POST", csrf: true, isRetry: true });
      }

      await refreshPromise.finally(() => {
        refreshPromise = null;
      });

      // If refresh succeeded, retry the original request
      return await apiRequest(path, { method, body, csrf, refresh, isRetry: true, csrfRetry });
    } catch (refreshError) {
      // Expired or absent guest sessions are expected during background probes.
      if (refreshError?.code && refreshError.code !== "AUTH_REQUIRED") {
        console.warn("[API] Session refresh failed:", refreshError);
      }
    }
  }

  if (!response.ok) {
    const errorPayload = responsePayload ?? await parseJsonSafe(response);
    const error = new Error(errorPayload.error ?? `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = errorPayload.code;
    error.details = errorPayload.details;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

export const formatCurrency = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "INR 0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(number);
};
