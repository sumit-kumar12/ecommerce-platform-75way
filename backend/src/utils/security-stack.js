import { AppError } from "../errors/app-error.js";

export const REQUIRED_GLOBAL_SECURITY_LAYERS = [
  "disable_x_powered_by",
  "helmet",
  "strict_cors",
  "body_size_limit",
  "request_id",
  "structured_request_logger",
  "suspicious_input_scanner",
  "rate_limiter",
  "overload_protection",
  "csrf_protection",
  "jwt_verification",
  "account_active_check",
  "threat_score_check",
];

export const REQUIRED_TERMINAL_SECURITY_LAYERS = [
  "not_found_handler",
  "central_error_handler",
];

export const assertGlobalSecurityLayerOrder = (registeredLayers) => {
  const missing = REQUIRED_GLOBAL_SECURITY_LAYERS.filter((layer) => !registeredLayers.includes(layer));
  if (missing.length) {
    throw new AppError(
      `Security middleware stack incomplete. Missing: ${missing.join(", ")}`,
      500,
      "SECURITY_STACK_INCOMPLETE",
      { missing },
    );
  }
  const outOfOrder = REQUIRED_GLOBAL_SECURITY_LAYERS.some(
    (layer, index) => registeredLayers.indexOf(layer) !== index,
  );
  if (outOfOrder) {
    throw new AppError(
      "Security middleware stack order invalid.",
      500,
      "SECURITY_STACK_ORDER_INVALID",
      { registeredLayers, required: REQUIRED_GLOBAL_SECURITY_LAYERS },
    );
  }
};

export const assertTerminalSecurityLayerOrder = (registeredLayers) => {
  const missing = REQUIRED_TERMINAL_SECURITY_LAYERS.filter((layer) => !registeredLayers.includes(layer));
  if (missing.length) {
    throw new AppError(
      `Terminal security handlers incomplete. Missing: ${missing.join(", ")}`,
      500,
      "TERMINAL_SECURITY_HANDLERS_INCOMPLETE",
      { missing },
    );
  }
  const outOfOrder = REQUIRED_TERMINAL_SECURITY_LAYERS.some(
    (layer, index) => registeredLayers.indexOf(layer) !== index,
  );
  if (outOfOrder) {
    throw new AppError(
      "Terminal security handlers order invalid.",
      500,
      "TERMINAL_SECURITY_HANDLERS_ORDER_INVALID",
      { registeredLayers, required: REQUIRED_TERMINAL_SECURITY_LAYERS },
    );
  }
};
