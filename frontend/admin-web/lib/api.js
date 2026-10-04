const DEFAULT_ADMIN_API_BASE = "http://localhost:4000/f9d3b1c8a5e740d2";
const DEFAULT_CORE_API_BASE = "http://localhost:4000/api/v1";

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

const buildHostCandidates = (adminUrl, coreUrl) => {
  const runtimeHost = getRuntimeHostname();
  const hosts = [
    runtimeHost,
    adminUrl.hostname,
    coreUrl.hostname,
    "localhost",
    "127.0.0.1",
  ]
    .map((host) => String(host || "").trim())
    .filter(Boolean);

  return Array.from(new Set(hosts));
};

const buildApiBasePairs = (configuredAdminBase, configuredCoreBase) => {
  if (typeof window !== "undefined") {
    return [{
      adminBase: "/api-proxy/f9d3b1c8a5e740d2",
      coreBase: "/api-proxy/api/v1",
    }];
  }

  const adminUrl = parseUrl(configuredAdminBase, DEFAULT_ADMIN_API_BASE);
  const coreUrl = parseUrl(configuredCoreBase, DEFAULT_CORE_API_BASE);
  const hosts = buildHostCandidates(adminUrl, coreUrl);

  const pairs = [];

  for (const host of hosts) {
    pairs.push({
      adminBase: replaceUrlHost(adminUrl, host),
      coreBase: replaceUrlHost(coreUrl, host),
    });
  }

  const seen = new Set();
  return pairs.filter((pair) => {
    const key = `${pair.adminBase}|${pair.coreBase}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const CONFIGURED_ADMIN_API_BASE = trimTrailingSlash(
  process.env.NEXT_PUBLIC_ADMIN_API_BASE ?? DEFAULT_ADMIN_API_BASE,
);
const CONFIGURED_CORE_API_BASE = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_CORE_API_BASE,
);
const API_BASE_PAIRS = buildApiBasePairs(CONFIGURED_ADMIN_API_BASE, CONFIGURED_CORE_API_BASE);

let activePairIndex = 0;
let apiPairResolved = false;
let csrfToken = null;
let csrfPromise = null;

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const parseJsonSafe = async (response) => response.json().catch(() => ({}));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (fn, { retries = 3, initialDelay = 1000 } = {}) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries || (error.code && error.code === "AUTH_REQUIRED")) {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      await wait(delay);
    }
  }
};

const AUTH_REQUIRED_CODE = "AUTH_REQUIRED";
const isBrowserRuntime = typeof window !== "undefined";

const redirectToLogin = () => {
  if (!isBrowserRuntime) return;
  const current = window.location.pathname || "/";
  if (current.startsWith("/login")) return;
  const next = encodeURIComponent(`${current}${window.location.search || ""}`);
  window.location.assign(`/login?next=${next}`);
};

const buildAuthError = (payload) => {
  const message = payload?.error && String(payload.error).toLowerCase() !== "not found" 
    ? payload.error 
    : "Authentication required. Please sign in again.";
  const error = new Error(message);
  error.code = AUTH_REQUIRED_CODE;
  return error;
};

const getActivePair = () => API_BASE_PAIRS[activePairIndex] ?? API_BASE_PAIRS[0];

const getCandidateIndexes = () => {
  const indexes = API_BASE_PAIRS.map((_, index) => index);
  if (activePairIndex > 0 && activePairIndex < indexes.length) {
    const [active] = indexes.splice(activePairIndex, 1);
    indexes.unshift(active);
  }
  return indexes;
};

const hexFromBytes = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const generateSecureIdChunk = () => {
  const webCrypto = globalThis.crypto;
  if (typeof webCrypto?.randomUUID === "function") {
    return webCrypto.randomUUID().replaceAll("-", "");
  }
  if (typeof webCrypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    webCrypto.getRandomValues(bytes);
    // UUIDv4 bit layout for interoperability.
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return hexFromBytes(bytes);
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
};

const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return "admin-server-device-id";
  const storageKey = "admin-device-id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing && existing.length >= 16) return existing;

  const generated = `${generateSecureIdChunk()}${generateSecureIdChunk()}`.replace(/[^a-f0-9]/gi, "");
  const normalized = generated.length >= 16 ? generated : `${generated}0000000000000000`.slice(0, 16);
  window.localStorage.setItem(storageKey, normalized);
  return normalized;
};

const resetCsrfState = () => {
  csrfToken = null;
  apiPairResolved = false;
  csrfPromise = null;
};

const applyRetryDeviceId = (headers) => {
  const retryDeviceId = getOrCreateDeviceId();
  headers["x-device-id"] = retryDeviceId;
  return retryDeviceId;
};

const withCsrfRefreshRetry = async ({
  response,
  upperMethod,
  headers,
  requestInit,
  buildUrl,
  errorPrefix,
}) => {
  if (response.ok || safeMethods.has(upperMethod) || response.status !== 403) {
    return response;
  }

  const firstPayload = await parseJsonSafe(response);
  if (firstPayload?.code !== "CSRF_VALIDATION_FAILED") {
    const error = new Error(firstPayload.error ?? `${errorPrefix} (${response.status})`);
    error.code = firstPayload.code;
    throw error;
  }

  resetCsrfState();
  applyRetryDeviceId(headers);
  headers["x-csrf-token"] = await getCsrfToken();
  return fetch(buildUrl(), requestInit);
};

const buildAdminUrl = (path) => `${getActivePair().adminBase}${path}`;
const buildCoreUrl = (path) => `${getActivePair().coreBase}${path}`;

const normalizeHeadersForRequest = (headers) => {
  // Keep `x-device-id` refreshed in case runtime state changes after hot reload.
  if (!headers["x-device-id"]) {
    headers["x-device-id"] = getOrCreateDeviceId();
  }
  return headers;
};

const fetchCsrfToken = async () => {
  const attemptErrors = [];

  for (const index of getCandidateIndexes()) {
    const pair = API_BASE_PAIRS[index];
    try {
      const response = await fetch(`${pair.coreBase}/auth/csrf-token`, {
        method: "GET",
        credentials: "include",
        headers: {
          "x-device-id": getOrCreateDeviceId(),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const payload = await parseJsonSafe(response);
        attemptErrors.push(
          `${pair.coreBase} -> ${response.status}${payload?.error ? ` (${payload.error})` : ""}`,
        );
        continue;
      }

      const payload = await parseJsonSafe(response);
      if (!payload?.csrfToken) {
        attemptErrors.push(`${pair.coreBase} -> 200 (csrfToken missing)`);
        continue;
      }

      activePairIndex = index;
      apiPairResolved = true;
      csrfToken = payload.csrfToken;
      return csrfToken;
    } catch (error) {
      attemptErrors.push(`${pair.coreBase} -> network_error (${error?.message ?? "unknown"})`);
    }
  }

  throw new Error(
    `Unable to retrieve CSRF token. Check backend on port 4000 and NEXT_PUBLIC_API_BASE. Attempts: ${attemptErrors.join(
      " | ",
    )}`,
  );
};

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (csrfPromise) return csrfPromise;
  csrfPromise = fetchCsrfToken().finally(() => {
    csrfPromise = null;
  });
  return csrfPromise;
};

const ensureApiPairResolved = async () => {
  if (apiPairResolved) return;
  await getCsrfToken();
};

const throwApiError = async (response, fallbackMessage, { isAdminSurface = false } = {}) => {
  const payload = await parseJsonSafe(response);

  const isAuthFailure = payload?.code === AUTH_REQUIRED_CODE || response.status === 401;
  const isHiddenAdminAuthFailure =
    isAdminSurface && response.status === 404 && String(payload?.error ?? "").toLowerCase() === "not found";

  if (isAuthFailure || isHiddenAdminAuthFailure) {
    if (isBrowserRuntime && !(window.location.pathname || "/").startsWith("/login")) {
      redirectToLogin();
      await new Promise(() => {}); // Block execution so error handlers don't trigger alerts before redirect
    } else {
      throw buildAuthError(payload); // We are already on login page, just throw normally so components can handle it
    }
  }

  const errorMsg = payload.details?.issues ? `${payload.error}: ${JSON.stringify(payload.details.issues)}` : payload.error;
  const error = new Error(errorMsg ?? `${fallbackMessage} (${response.status})`);
  error.code = payload.code;
  throw error;
};

export const resolveAdminApiBase = async () => {
  await ensureApiPairResolved();
  return getActivePair().adminBase;
};

export const getCurrentUser = async () => coreApiRequest("/users/me", { method: "GET", csrf: false });

export const loginRequest = async ({ email, password }) =>
  coreApiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    csrf: true,
  });

export const logoutRequest = async () =>
  coreApiRequest("/auth/logout", {
    method: "POST",
    csrf: true,
  });

export const adminRequest = async (path, { method = "GET", body } = {}) => {
  return withRetry(async () => {
    await ensureApiPairResolved();

    const upperMethod = method.toUpperCase();
    const headers = {
      "Content-Type": "application/json",
      "x-device-id": getOrCreateDeviceId(),
    };
    normalizeHeadersForRequest(headers);

    if (!safeMethods.has(upperMethod)) {
      headers["x-csrf-token"] = await getCsrfToken();
    }

    const requestInit = {
      method: upperMethod,
      credentials: "include",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    };

    let response = await fetch(buildAdminUrl(path), requestInit);
    response = await withCsrfRefreshRetry({
      response,
      upperMethod,
      headers,
      requestInit,
      buildUrl: () => buildAdminUrl(path),
      errorPrefix: "Admin request failed",
    });

    if (!response.ok) {
      await throwApiError(response, "Admin request failed", { isAdminSurface: true });
    }

    if (response.status === 204) return null;
    return parseJsonSafe(response);
  });
};

export const coreApiRequest = async (path, { method = "GET", body, csrf = true } = {}) => {
  return withRetry(async () => {
    await ensureApiPairResolved();

    const upperMethod = method.toUpperCase();
    const headers = {
      "Content-Type": "application/json",
      "x-device-id": getOrCreateDeviceId(),
    };
    normalizeHeadersForRequest(headers);

    if (!safeMethods.has(upperMethod) && csrf) {
      headers["x-csrf-token"] = await getCsrfToken();
    }

    const requestInit = {
      method: upperMethod,
      credentials: "include",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    };

    let response = await fetch(buildCoreUrl(path), requestInit);
    response = await withCsrfRefreshRetry({
      response,
      upperMethod,
      headers,
      requestInit,
      buildUrl: () => buildCoreUrl(path),
      errorPrefix: "Core API request failed",
    });

    if (!response.ok) {
      await throwApiError(response, "Core API request failed");
    }

    if (response.status === 204) return null;
    return parseJsonSafe(response);
  });
};

const normalizeAdminPath = (path) => {
  const normalized = String(path ?? "");
  if (!normalized.startsWith("/admin/")) return normalized;
  const withoutAdminPrefix = normalized.slice("/admin".length);
  return withoutAdminPrefix.length ? withoutAdminPrefix : "/";
};

// Compatibility wrapper for legacy admin pages.
export const apiRequest = async (path, options = {}) => {
  const normalizedPath = String(path ?? "");
  if (normalizedPath.startsWith("/admin/")) {
    return adminRequest(normalizeAdminPath(normalizedPath), options);
  }
  return coreApiRequest(normalizedPath, options);
};

