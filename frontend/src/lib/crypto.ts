/**
 * Creates a SHA-256 hash of the provided text
 * @param text The text to hash
 * @returns A hex string representation of the hash
 */
export async function createHash(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
} 