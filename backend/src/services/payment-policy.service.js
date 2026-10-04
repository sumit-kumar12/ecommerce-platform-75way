import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { parseMoneyToPaise, paiseToDecimalString } from "../utils/money.js";

const singletonWhere = { singletonKey: "GLOBAL" };

const defaultPolicyCreate = {
  singletonKey: "GLOBAL",
  onlineOnly: false,
  allowCOD: true,
  forceDigitalOnline: true,
  minCODPrice: null,
};

export const getGlobalPaymentPolicy = async () =>
  prisma.globalPaymentPolicy.upsert({
    where: singletonWhere,
    update: {},
    create: defaultPolicyCreate,
  });

export const updateGlobalPaymentPolicy = async ({ actorId, input }) => {
  const normalizedMinCODPrice =
    input.minCODPrice === undefined || input.minCODPrice === null || input.minCODPrice === 0
      ? input.minCODPrice === undefined
        ? undefined
        : null
      : input.minCODPrice;

  if (input.onlineOnly && input.allowCOD) {
    throw new AppError("Global onlineOnly policy cannot allow COD.", 400, "INVALID_PAYMENT_POLICY");
  }

  if (normalizedMinCODPrice !== undefined && normalizedMinCODPrice !== null) {
    const minPaise = parseMoneyToPaise(normalizedMinCODPrice, "minCODPrice");
    if (minPaise < 100) {
      throw new AppError("Global minCODPrice must be at least 1.00.", 400, "INVALID_MIN_COD_PRICE");
    }
  }

  return prisma.globalPaymentPolicy.upsert({
    where: singletonWhere,
    update: {
      ...(input.onlineOnly !== undefined ? { onlineOnly: input.onlineOnly } : {}),
      ...(input.allowCOD !== undefined ? { allowCOD: input.allowCOD } : {}),
      ...(input.forceDigitalOnline !== undefined ? { forceDigitalOnline: input.forceDigitalOnline } : {}),
      ...(normalizedMinCODPrice !== undefined
        ? {
            minCODPrice:
              normalizedMinCODPrice === null
                ? null
                : paiseToDecimalString(parseMoneyToPaise(normalizedMinCODPrice, "minCODPrice")),
          }
        : {}),
      updatedById: actorId,
    },
    create: {
      ...defaultPolicyCreate,
      ...(input.onlineOnly !== undefined ? { onlineOnly: input.onlineOnly } : {}),
      ...(input.allowCOD !== undefined ? { allowCOD: input.allowCOD } : {}),
      ...(input.forceDigitalOnline !== undefined ? { forceDigitalOnline: input.forceDigitalOnline } : {}),
      ...(normalizedMinCODPrice !== undefined
        ? {
            minCODPrice:
              normalizedMinCODPrice === null
                ? null
                : paiseToDecimalString(parseMoneyToPaise(normalizedMinCODPrice, "minCODPrice")),
          }
        : {}),
      updatedById: actorId,
    },
  });
};

export const enforceGlobalPaymentPolicy = async ({ isDigital, paymentMethod }) => {
  const policy = await getGlobalPaymentPolicy();

  if (paymentMethod === "ONLINE") return policy;

  if (policy.onlineOnly) {
    throw new AppError("COD is disabled by global policy.", 400, "GLOBAL_PAYMENT_POLICY_BLOCK");
  }
  if (!policy.allowCOD) {
    throw new AppError("COD is not allowed by global policy.", 400, "GLOBAL_PAYMENT_POLICY_BLOCK");
  }
  if (isDigital && policy.forceDigitalOnline) {
    throw new AppError("Digital products must be online-only by global policy.", 400, "GLOBAL_PAYMENT_POLICY_BLOCK");
  }

  return policy;
};
