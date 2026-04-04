/** Map GraphQL / service messages to concise UX copy */
export function mapAuthErrorMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('invalid email or password')) {
    return 'That email or password does not match our records.';
  }
  if (m.includes('email already registered')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (m.includes('name is required')) return 'Please enter your full name.';
  if (m.includes('invalid email')) return 'Enter a valid email address.';
  if (m.includes('password must be at least')) return 'Password must be at least 8 characters.';
  if (m.includes('network error')) return raw;
  return raw;
}
