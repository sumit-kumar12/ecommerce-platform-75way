const passwordRequirements = [
  {
    id: "length",
    label: "At least 12 characters",
    test: (password) => password.length >= 12,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "symbol",
    label: "One special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const getPasswordChecks = (password) =>
  passwordRequirements.map((requirement) => ({
    id: requirement.id,
    label: requirement.label,
    satisfied: requirement.test(password),
  }));

export const assessPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: "Enter a password",
      percent: 0,
      tone: "idle",
      checks: getPasswordChecks(password),
    };
  }

  const checks = getPasswordChecks(password);
  const score = checks.filter((check) => check.satisfied).length;

  if (score <= 2) {
    return {
      score,
      label: "Weak",
      percent: 32,
      tone: "weak",
      checks,
    };
  }

  if (score === 3) {
    return {
      score,
      label: "Fair",
      percent: 56,
      tone: "fair",
      checks,
    };
  }

  if (score === 4) {
    return {
      score,
      label: "Strong",
      percent: 78,
      tone: "strong",
      checks,
    };
  }

  return {
    score,
    label: "Very strong",
    percent: 100,
    tone: "excellent",
    checks,
  };
};

export const isPasswordPolicySatisfied = (password) =>
  getPasswordChecks(password).every((check) => check.satisfied);

export const maskEmailAddress = (email) => {
  const normalized = String(email ?? "").trim();
  const atIndex = normalized.indexOf("@");

  if (atIndex <= 1) return normalized;

  const local = normalized.slice(0, atIndex);
  const domain = normalized.slice(atIndex + 1);
  const visibleLocal = local.slice(0, 2);
  const maskedLocal = `${visibleLocal}${"*".repeat(Math.max(local.length - 2, 2))}`;
  return `${maskedLocal}@${domain}`;
};
