export function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(date);
}

export function validateCID(cid: string): boolean {
  if (!cid || cid.trim().length === 0) return false;
  const cidPattern = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})/;
  return cidPattern.test(cid.trim());
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}