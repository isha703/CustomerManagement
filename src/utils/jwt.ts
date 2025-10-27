// utils/jwt.ts
export async function encryptPayload(plainText: string, secret: string): Promise<string> {
  const enc = new TextEncoder();

  // Convert secret to Uint8Array
  let keyBytes: Uint8Array;
  try {
    keyBytes = Uint8Array.from(atob(secret), c => c.charCodeAt(0));
  } catch {
    keyBytes = enc.encode(secret);
  }

  const aesKeyBytes = keyBytes.slice(0, 32); // match backend key length
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    aesKeyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // Generate random 12-byte IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    enc.encode(plainText)
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.byteLength);

  // Base64 URL encode
  let binary = "";
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
