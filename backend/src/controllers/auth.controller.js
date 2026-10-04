import { z } from "zod";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import { randomToken } from "../utils/crypto.js";
import {
  accessCookieClearOptions,
  accessCookieOptions,
  csrfCookieClearOptions,
  getDeviceId,
  refreshCookieClearOptions,
  refreshCookieOptions,
} from "../utils/cookies.js";
import { sanitizeText } from "../utils/sanitize.js";
import { mergeGuestCartIntoUser, clearGuestCart } from "../services/cart.service.js";
import { mergeGuestWishlistIntoUser, clearGuestWishlist } from "../services/wishlist.service.js";
import {
  loginUser,
  loginWithOAuth,
  logoutUser,
  refreshSession,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
  validatePasswordResetToken,
} from "../services/auth.service.js";
import { issueCsrfCookie } from "../middlewares/csrf.middleware.js";
import { verifyAccessToken } from "../services/token.service.js";
import { markAccessTokenRevoked } from "../services/security-state.service.js";

const passwordSchema = z
  .string()
  .min(12)
  .max(128)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^\+\d{10,15}$/).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordParamsSchema = z.object({
  token: z.string().min(32).max(256),
});

const resetPasswordSchema = z.object({
  token: z.string().min(32).max(256),
  password: passwordSchema,
});

export const csrfTokenController = (req, res) => {
  const csrfToken = issueCsrfCookie(req, res);
  res.status(200).json({ csrfToken });
};

export const registerController = async (req, res) => {
  const input = registerSchema.parse(req.body);
  const user = await registerUser({
    email: input.email,
    password: input.password,
    name: sanitizeText(input.name),
    phone: input.phone,
  });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

export const loginController = async (req, res) => {
  const input = loginSchema.parse(req.body);
  const deviceId = req.get("x-device-id") || "oauth-default-device";
  const session = await loginUser({
    req,
    email: input.email,
    password: input.password,
    deviceId,
  });

  res.cookie(env.ACCESS_COOKIE_NAME, session.accessToken, accessCookieOptions());
  res.cookie(env.REFRESH_COOKIE_NAME, session.refreshToken, refreshCookieOptions());
  
  await mergeGuestCartIntoUser(req, session.user.id);
  await mergeGuestWishlistIntoUser(req, session.user.id);
  
  clearGuestCart(res);
  clearGuestWishlist(res);

  res.status(200).json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    },
    accessToken: session.accessToken,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
  });
};

export const refreshController = async (req, res) => {
  const deviceId = req.get("x-device-id") || "oauth-default-device";
  const refreshToken = req.cookies[env.REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing.", code: "REFRESH_TOKEN_MISSING" });
  }

  const refreshed = await refreshSession({
    req,
    refreshToken,
    deviceId,
  });

  res.cookie(env.ACCESS_COOKIE_NAME, refreshed.accessToken, accessCookieOptions());
  res.cookie(env.REFRESH_COOKIE_NAME, refreshed.refreshToken, refreshCookieOptions());
  res.status(200).json({
    accessToken: refreshed.accessToken,
    accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
  });
};

export const logoutController = async (req, res) => {
  const accessToken = req.cookies[env.ACCESS_COOKIE_NAME];
  const refreshToken = req.cookies[env.REFRESH_COOKIE_NAME];

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);
      await markAccessTokenRevoked({
        jti: decoded.jti,
        userId: decoded.sub,
        familyId: decoded.sid ?? null,
        reason: "User logout",
        expiresAt: new Date(decoded.exp * 1000),
      });
    } catch {
      // Access token may be expired or invalid. Logout continues regardless.
    }
  }

  await logoutUser({ refreshToken });
  clearGuestCart(res);
  clearGuestWishlist(res);
  res.clearCookie(env.ACCESS_COOKIE_NAME, accessCookieClearOptions());
  res.clearCookie(env.REFRESH_COOKIE_NAME, refreshCookieClearOptions());
  res.clearCookie(env.CSRF_COOKIE_NAME, csrfCookieClearOptions());
  res.status(204).send();
};

export const forgotPasswordController = async (req, res) => {
  const input = forgotPasswordSchema.parse(req.body);

  await requestPasswordReset({
    req,
    email: input.email,
  });

  res.status(202).json({
    message: "If an account exists for that email, a reset link has been sent.",
  });
};

export const validateResetPasswordTokenController = async (req, res) => {
  const params = resetPasswordParamsSchema.parse(req.params);
  const result = await validatePasswordResetToken({
    req,
    token: params.token,
  });

  res.status(200).json({
    valid: true,
    expiresAt: result.expiresAt,
  });
};

export const resetPasswordController = async (req, res) => {
  const input = resetPasswordSchema.parse(req.body);

  await resetPasswordWithToken({
    req,
    token: input.token,
    password: input.password,
  });

  res.status(200).json({
    message: "Password updated successfully.",
  });
};

export const issueSseTokenController = async (req, res) => {
  const sseToken = randomToken(16);
  await redis.set(`sse:${sseToken}`, req.user.id, "EX", 30);
  res.status(200).json({ sseToken, expiresIn: 30 });
};

// Google OAuth
export const googleOAuthInitController = (req, res) => {
  const redirectUri = encodeURIComponent(`${env.OAUTH_CALLBACK_URL || "http://localhost:4000/api/v1/auth"}/google/callback`);
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: "Google Client ID not configured" });
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  res.redirect(url);
};

export const googleOAuthCallbackController = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${env.FRONTEND_URL || "http://localhost:3000"}/login?error=no_code`);

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${env.OAUTH_CALLBACK_URL || "http://localhost:4000/api/v1/auth"}/google/callback`,
        grant_type: "authorization_code"
      })
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Failed to get access token: " + (tokenData.error_description || tokenData.error || JSON.stringify(tokenData)));

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileResponse.json();
    if (!profile.email) throw new Error("No email found in Google profile");

    const deviceId = req.get("x-device-id") || "oauth-default-device";
    const session = await loginWithOAuth({
      req,
      email: profile.email,
      name: profile.name,
      provider: "google",
      providerId: profile.id,
      deviceId
    });

    res.cookie(env.ACCESS_COOKIE_NAME, session.accessToken, accessCookieOptions());
    res.cookie(env.REFRESH_COOKIE_NAME, session.refreshToken, refreshCookieOptions());
    
    await mergeGuestCartIntoUser(req, session.user.id);
    await mergeGuestWishlistIntoUser(req, session.user.id);
    
    clearGuestCart(res);
    clearGuestWishlist(res);

    res.redirect(`${env.FRONTEND_URL || "http://localhost:3000"}`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    let errorParam = "oauth_failed"; if (err.errorCode === "ACCOUNT_EXISTS_DIFFERENT_PROVIDER") { errorParam = "account_exists"; } res.redirect(`${env.FRONTEND_URL || "http://localhost:3000"}/login?error=${errorParam}&details=${encodeURIComponent(err.message)}`);
  }
};

// Instagram OAuth
export const instagramOAuthInitController = (req, res) => {
  const redirectUri = encodeURIComponent(`${env.OAUTH_CALLBACK_URL || "http://localhost:4000/api/v1/auth"}/instagram/callback`);
  const clientId = env.INSTAGRAM_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: "Instagram Client ID not configured" });
  
  const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
  res.redirect(url);
};

export const instagramOAuthCallbackController = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${env.FRONTEND_URL || "http://localhost:3000"}/login?error=no_code`);

  try {
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.INSTAGRAM_CLIENT_ID,
        client_secret: env.INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: `${env.OAUTH_CALLBACK_URL || "http://localhost:4000/api/v1/auth"}/instagram/callback`,
        code
      })
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Failed to get access token: " + (tokenData.error_description || tokenData.error || JSON.stringify(tokenData)));

    const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
    const profile = await profileResponse.json();
    
    const email = `${profile.username || profile.id}@instagram.local`;
    const deviceId = req.get("x-device-id") || "oauth-default-device";
    const session = await loginWithOAuth({
      req,
      email,
      name: profile.username || "Instagram User",
      provider: "instagram",
      providerId: profile.id,
      deviceId
    });

    res.cookie(env.ACCESS_COOKIE_NAME, session.accessToken, accessCookieOptions());
    res.cookie(env.REFRESH_COOKIE_NAME, session.refreshToken, refreshCookieOptions());
    
    await mergeGuestCartIntoUser(req, session.user.id);
    await mergeGuestWishlistIntoUser(req, session.user.id);
    
    clearGuestCart(res);
    clearGuestWishlist(res);

    res.redirect(`${env.FRONTEND_URL || "http://localhost:3000"}`);
  } catch (err) {
    console.error("Instagram OAuth error:", err);
    let errorParam = "oauth_failed"; if (err.errorCode === "ACCOUNT_EXISTS_DIFFERENT_PROVIDER") { errorParam = "account_exists"; } res.redirect(`${env.FRONTEND_URL || "http://localhost:3000"}/login?error=${errorParam}&details=${encodeURIComponent(err.message)}`);
  }
};
