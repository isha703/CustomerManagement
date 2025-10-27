// utils/crypto.ts
export function base64UrlToUint8Array(b64url: string): Uint8Array {
  // convert base64url -> base64
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    + '=='.slice((2 - b64url.length * 3) & 3);
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

// derive AES key bytes from secret string (server used Base64.decode or raw bytes and then first up to 32 bytes)
export function deriveAesKeyBytes(secret: string): Uint8Array {
  try {
    // try base64 decode (server uses Base64.getDecoder())
    const bin = atob(secret);
    const tmp = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) tmp[i] = bin.charCodeAt(i);
    return tmp.slice(0, Math.min(32, tmp.length));
  } catch {
    // fallback: UTF-8 bytes
    return new TextEncoder().encode(secret).slice(0, 32);
  }
}

export async function decryptAesGcmEncoded(encB64Url: string, secret: string): Promise<any> {
  const data = base64UrlToUint8Array(encB64Url);
  if (data.length < 13) throw new Error('invalid payload');
  const iv = data.slice(0, 12);
  const cipher = data.slice(12);

  const keyBytes = deriveAesKeyBytes(secret);
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['decrypt']);

  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, cryptoKey, cipher);
  const text = new TextDecoder().decode(plainBuf);
  return JSON.parse(text);
}