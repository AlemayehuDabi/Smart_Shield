const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Email is required.";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(value: string, min = 8): string | null {
  if (!value) return "Password is required.";
  if (value.length < min) return `Use at least ${min} characters.`;
  return null;
}

export function validateName(value: string): string | null {
  if (!value.trim()) return "Full name is required.";
  return null;
}

export function validatePasswordMatch(password: string, confirm: string): string | null {
  if (password !== confirm) return "Passwords do not match.";
  return null;
}
