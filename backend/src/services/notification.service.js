import twilio from "twilio";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { COMMERCE_ADMIN_ROLES, SECURITY_ADMIN_ROLES } from "../config/constants.js";

const hasPlaceholderTwilioConfig = () => {
  if (env.NODE_ENV === "production") return false;

  const accountSid = String(env.TWILIO_ACCOUNT_SID ?? "").trim();
  const authToken = String(env.TWILIO_AUTH_TOKEN ?? "").trim();
  const fromNumber = String(env.TWILIO_WHATSAPP_FROM ?? "").trim();

  return (
    accountSid === "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" ||
    authToken === "twilio-token" ||
    fromNumber === "whatsapp:+12345678901"
  );
};

const twilioClient =
  env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && !hasPlaceholderTwilioConfig()
    ? twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
    : null;

const getMailhogTransport = () => {
  if (!env.MAILHOG_HOST) return null;
  return nodemailer.createTransport({
    host: env.MAILHOG_HOST,
    port: env.MAILHOG_PORT ?? 1025,
    secure: false,
    ignoreTLS: true,
  });
};

const getBrevoTransport = () => {
  if (!env.BREVO_SMTP_USER || !env.BREVO_SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.BREVO_SMTP_USER,
      pass: env.BREVO_SMTP_PASS,
    },
  });
};

const mailhogTransport = getMailhogTransport();
const brevoTransport = getBrevoTransport();

const oneHourAgo = () => new Date(Date.now() - 60 * 60 * 1000);

const checkRateLimit = async ({ recipientId, channel, eventType, destination }) => {
  const count = await prisma.notificationEvent.count({
    where: {
      recipientId,
      channel,
      eventType,
      destination,
      createdAt: {
        gte: oneHourAgo(),
      },
    },
  });

  if (count >= env.NOTIFICATION_HOURLY_LIMIT) {
    await prisma.notificationEvent.create({
      data: {
        recipientId,
        channel,
        eventType,
        destination,
        status: "RATE_LIMITED",
        details: {
          count,
          limit: env.NOTIFICATION_HOURLY_LIMIT,
        },
      },
    });
    loggers.notifications.warn({
      eventType: "notification_rate_limited",
      userId: recipientId,
      details: { channel, eventType, destination, count },
    });
    return false;
  }

  return true;
};

const saveNotificationEvent = async ({ recipientId, channel, eventType, status, destination, details }) => {
  await prisma.notificationEvent.create({
    data: {
      recipientId,
      channel,
      eventType,
      status,
      destination,
      details,
    },
  });
};

const dedupeRecipientsById = (recipients) => {
  const unique = new Map();
  for (const recipient of recipients) {
    if (!recipient?.id) continue;
    if (!unique.has(recipient.id)) unique.set(recipient.id, recipient);
  }
  return [...unique.values()];
};

export const sendEmailNotification = async ({ recipient, eventType, subject, text }) => {
  if (!(await checkRateLimit({ recipientId: recipient.id, channel: "EMAIL", eventType, destination: recipient.email }))) {
    return "RATE_LIMITED";
  }

  const fromEmail = env.MAILHOG_HOST ? "noreply@katabazaar.local" : (env.BREVO_FROM_EMAIL || "noreply@katabazaar.com");
  if (!fromEmail) return "SKIPPED";

  try {
    if (mailhogTransport) {
      await mailhogTransport.sendMail({
        from: fromEmail,
        to: recipient.email,
        subject,
        text,
      });
    } else if (brevoTransport) {
      await brevoTransport.sendMail({
        from: fromEmail,
        to: recipient.email,
        subject,
        text,
      });
    } else {
      loggers.notifications.warn({
        eventType: "email_skipped_no_transport",
        userId: recipient.id,
        details: { recipient: recipient.email, eventType, subject },
      });
      return "SKIPPED";
    }
    await saveNotificationEvent({
      recipientId: recipient.id,
      channel: "EMAIL",
      eventType,
      status: "SENT",
      destination: recipient.email,
      details: { subject },
    });
    loggers.notifications.info({
      eventType: "email_sent",
      userId: recipient.id,
      details: { recipient: recipient.email, eventType },
    });
    return "SENT";
  } catch (error) {
    await saveNotificationEvent({
      recipientId: recipient.id,
      channel: "EMAIL",
      eventType,
      status: "FAILED",
      destination: recipient.email,
      details: { error: error.message },
    });
    loggers.notifications.error({
      eventType: "email_failed",
      userId: recipient.id,
      details: { recipient: recipient.email, eventType, message: error.message },
    });
    return "FAILED";
  }
};

export const sendPasswordResetRequestedNotification = async ({ recipient, resetUrl, expiresInMinutes }) => {
  return sendEmailNotification({
    recipient,
    eventType: "PASSWORD_RESET_REQUESTED",
    subject: "Katabazaar password reset link",
    text: [
      `Hello ${recipient.name},`,
      "",
      "We received a request to reset your Katabazaar password.",
      `Use the secure link below within ${expiresInMinutes} minutes:`,
      resetUrl,
      "",
      "If you did not request this reset, you can ignore this message.",
      "For your security, no changes have been made yet.",
    ].join("\n"),
  });
};

export const sendPasswordResetCompletedNotification = async ({ recipient }) => {
  return sendEmailNotification({
    recipient,
    eventType: "PASSWORD_RESET_COMPLETED",
    subject: "Katabazaar password updated",
    text: [
      `Hello ${recipient.name},`,
      "",
      "Your Katabazaar password has been updated successfully.",
      "All existing refresh sessions have been revoked.",
      "If you did not perform this action, contact support immediately.",
    ].join("\n"),
  });
};

export const sendWhatsAppNotification = async ({ recipient, eventType, message }) => {
  if (!recipient.phone) return;
  const destination = `whatsapp:${recipient.phone}`;

  if (!(await checkRateLimit({ recipientId: recipient.id, channel: "WHATSAPP", eventType, destination }))) {
    return;
  }

  if (!twilioClient || !env.TWILIO_WHATSAPP_FROM) {
    loggers.notifications.warn({
      eventType: "whatsapp_skipped_no_client",
      userId: recipient.id,
      details: { destination, eventType },
    });
    return;
  }

  try {
    await twilioClient.messages.create({
      from: env.TWILIO_WHATSAPP_FROM,
      to: destination,
      body: message,
    });
    await saveNotificationEvent({
      recipientId: recipient.id,
      channel: "WHATSAPP",
      eventType,
      status: "SENT",
      destination,
      details: {},
    });
    loggers.notifications.info({
      eventType: "whatsapp_sent",
      userId: recipient.id,
      details: { destination, eventType },
    });
  } catch (error) {
    await saveNotificationEvent({
      recipientId: recipient.id,
      channel: "WHATSAPP",
      eventType,
      status: "FAILED",
      destination,
      details: { error: error.message },
    });
    loggers.notifications.error({
      eventType: "whatsapp_failed",
      userId: recipient.id,
      details: { destination, eventType, message: error.message },
    });
  }
};

export const notifyOrderEvent = async ({ order, eventType }) => {
  const admins = await prisma.user.findMany({
    where: {
      role: { in: COMMERCE_ADMIN_ROLES },
      isActive: true,
    },
    select: { id: true, email: true, phone: true, name: true },
  });

  const listerIds = [...new Set(order.items.map((item) => item.listerId))];
  const listers = await prisma.user.findMany({
    where: {
      id: { in: listerIds },
      isActive: true,
    },
    select: { id: true, email: true, phone: true, name: true },
  });

  const customer = await prisma.user.findUnique({
    where: { id: order.userId },
    select: { id: true, email: true, phone: true, name: true },
  });

  const recipients = dedupeRecipientsById([...admins, ...listers, ...(customer ? [customer] : [])]);

  const subject = `Order ${order.orderNumber} - ${eventType}`;
  const text = `Order ${order.orderNumber} is now in state ${eventType}.`;

  for (const recipient of recipients) {
    await sendEmailNotification({
      recipient,
      eventType,
      subject,
      text,
    });
    await sendWhatsAppNotification({
      recipient,
      eventType,
      message: text,
    });
  }
};

export const sendOrderConfirmation = async (order) => {
  if (!order || !order.user) return;
  
  const recipient = order.user;
  const eventType = "ORDER_CONFIRMATION";
  const subject = `Order Confirmation - ${order.orderNumber}`;
  
  const text = [
    `Hello ${recipient.name},`,
    "",
    `Thank you for your order! Your order ${order.orderNumber} has been received.`,
    `Total Amount: ${order.currency} ${order.totalAmount}`,
    `Payment Method: ${order.paymentMethod}`,
    "",
    "We will notify you once your order is shipped.",
    "Thank you for shopping with us!"
  ].join("\n");

  await sendEmailNotification({
    recipient,
    eventType,
    subject,
    text,
  });

  if (recipient.phone) {
    await sendWhatsAppNotification({
      recipient,
      eventType,
      message: `Your order ${order.orderNumber} for ${order.currency} ${order.totalAmount} has been confirmed!`,
    });
  }
};

export const sendOrderShipped = async (order) => {
  if (!order || !order.user) return;
  
  const recipient = order.user;
  const eventType = "ORDER_SHIPPED";
  const subject = `Your Order ${order.orderNumber} has Shipped!`;
  
  const text = [
    `Hello ${recipient.name},`,
    "",
    `Great news! Your order ${order.orderNumber} has been shipped.`,
    `It is now on its way to your shipping address:`,
    `${order.shippingAddress}`,
    "",
    "Thank you for shopping with us!"
  ].join("\n");

  await sendEmailNotification({
    recipient,
    eventType,
    subject,
    text,
  });

  if (recipient.phone) {
    await sendWhatsAppNotification({
      recipient,
      eventType,
      message: `Your order ${order.orderNumber} has been shipped and is on its way!`,
    });
  }
};

const getSecurityAlertRecipients = async () => {
  const admins = await prisma.user.findMany({
    where: {
      role: { in: SECURITY_ADMIN_ROLES },
      isActive: true,
    },
    select: { id: true, email: true, phone: true, name: true },
  });

  const configuredEmailRecipients = env.ALERT_EMAIL_TO.map((email) => ({
    id: null,
    email,
    phone: null,
    name: "Configured Alert Recipient",
  }));

  const configuredWhatsAppRecipients = env.ALERT_WHATSAPP_TO.map((phone) => ({
    id: null,
    email: null,
    phone,
    name: "Configured Alert Recipient",
  }));

  return [...admins, ...configuredEmailRecipients, ...configuredWhatsAppRecipients];
};

export const notifySecurityEscalation = async ({ eventType, severity, message, details = {} }) => {
  const recipients = await getSecurityAlertRecipients();
  const normalizedEventType = String(eventType || "SECURITY_ALERT");
  const text = `[${severity}] ${message}`;
  const subject = `${severity} - ${normalizedEventType}`;

  for (const recipient of recipients) {
    if (severity === "ERROR" || severity === "CRITICAL" || severity === "EMERGENCY") {
      if (recipient.email) {
        await sendEmailNotification({
          recipient: {
            id: recipient.id,
            email: recipient.email,
            phone: recipient.phone,
            name: recipient.name,
          },
          eventType: normalizedEventType,
          subject,
          text: `${text}\n\nDetails: ${JSON.stringify(details)}`,
        });
      }
    }

    if (severity === "CRITICAL" || severity === "EMERGENCY") {
      if (recipient.phone) {
        await sendWhatsAppNotification({
          recipient: {
            id: recipient.id,
            email: recipient.email,
            phone: recipient.phone,
            name: recipient.name,
          },
          eventType: normalizedEventType,
          message: `${text}.`,
        });
      }
    }
  }
};
