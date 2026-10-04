import { AppError } from "../errors/app-error.js";

export const parseMoneyToPaise = (value, fieldName = "amount") => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new AppError(`${fieldName} must be a positive number.`, 400, "INVALID_AMOUNT");
  }
  return Math.round(numeric * 100);
};

export const paiseToDecimalString = (paise) => {
  if (!Number.isInteger(paise)) {
    throw new AppError("Money conversion error: paise must be an integer.", 500, "MONEY_CONVERSION_ERROR");
  }
  return (paise / 100).toFixed(2);
};

export const decimalToPaise = (decimal) => parseMoneyToPaise(Number(decimal), "decimal");
