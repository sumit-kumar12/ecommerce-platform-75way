import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const commonCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "strict",
  path: "/",
};

const clearCookieBaseOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "strict",
  path: "/",
};

export const accessCookieOptions = () => ({
  ...commonCookieOptions,
  maxAge: 10 * 60 * 1000,
});

export const refreshCookieOptions = () => ({
  ...commonCookieOptions,
  maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
});

export const guestCookieOptions = () => ({
  ...commonCookieOptions,
  maxAge: 14 * 24 * 60 * 60 * 1000,
});

export const accessCookieClearOptions = () => ({
  ...clearCookieBaseOptions,
});

export const refreshCookieClearOptions = () => ({
  ...clearCookieBaseOptions,
});

export const guestCookieClearOptions = () => ({
  ...clearCookieBaseOptions,
});

export const csrfCookieClearOptions = () => ({
  httpOnly: false,
  secure: env.COOKIE_SECURE,
  sameSite: "strict",
  path: "/",
});

export const csrfCookieOptions = () => ({
  httpOnly: false,
  secure: env.COOKIE_SECURE,
  sameSite: "strict",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
});

export const getDeviceId = (req) => {
  const deviceId = req.get("x-device-id");
  if (!deviceId || deviceId.length < 16 || deviceId.length > 128) {
    throw new AppError("A valid x-device-id header is required.", 400, "DEVICE_ID_REQUIRED");
  }
  return deviceId;
};
