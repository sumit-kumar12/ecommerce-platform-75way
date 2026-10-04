import sanitizeHtml from "sanitize-html";

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// Also strip null bytes (\x00) — PostgreSQL (UTF-8) rejects them with error code 22021
export const sanitizeText = (value) =>
  sanitizeHtml(String(value), sanitizeOptions)
    .replace(/\x00/g, "")
    .trim();

export const sanitizeContent = (value) => {
  if (typeof value === "string") return sanitizeText(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeContent(item));
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeContent(item)]));
  }
  return value;
};
