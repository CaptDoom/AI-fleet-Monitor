// AI governance: PII Redaction
export const redactPII = (text: string): string => {
  let redacted = text;
  // Email regex
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
  // Phone regex
  redacted = redacted.replace(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "[REDACTED_PHONE]");
  // SSN
  redacted = redacted.replace(/\d{3}-\d{2}-\d{4}/g, "[REDACTED_SSN]");
  // Credit Cards
  redacted = redacted.replace(/\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}/g, "[REDACTED_CARD]");
  return redacted;
};
