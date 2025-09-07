import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';

// Generate a new key pair for a user
export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey),
  };
}

// Generate a symmetric key for group chats
export function generateSymmetricKey() {
  const key = nacl.randomBytes(32);
  return util.encodeBase64(key);
}

// Encrypt a message using the recipient's public key and sender's private key
export function encryptMessage(
  message: string,
  recipientPublicKey: string,
  senderPrivateKey: string
): string {
  const messageBytes = util.decodeUTF8(message);
  const recipientPublicKeyBytes = util.decodeBase64(recipientPublicKey);
  const senderPrivateKeyBytes = util.decodeBase64(senderPrivateKey);
  
  const nonce = nacl.randomBytes(24);
  const encrypted = nacl.box(messageBytes, nonce, recipientPublicKeyBytes, senderPrivateKeyBytes);
  
  // Combine nonce and encrypted message
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);
  
  return util.encodeBase64(combined);
}

// Decrypt a message using the sender's public key and recipient's private key
export function decryptMessage(
  encryptedMessage: string,
  senderPublicKey: string,
  recipientPrivateKey: string
): string | null {
  try {
    const combined = util.decodeBase64(encryptedMessage);
    const nonce = combined.slice(0, 24);
    const encrypted = combined.slice(24);
    
    const senderPublicKeyBytes = util.decodeBase64(senderPublicKey);
    const recipientPrivateKeyBytes = util.decodeBase64(recipientPrivateKey);
    
    const decrypted = nacl.box.open(encrypted, nonce, senderPublicKeyBytes, recipientPrivateKeyBytes);
    
    if (!decrypted) {
      return null;
    }
    
    return util.encodeUTF8(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

// Encrypt a message using a symmetric key (for group chats)
export function encryptWithSymmetricKey(message: string, symmetricKey: string): string {
  const messageBytes = util.decodeUTF8(message);
  const keyBytes = util.decodeBase64(symmetricKey);
  
  const nonce = nacl.randomBytes(24);
  const encrypted = nacl.secretbox(messageBytes, nonce, keyBytes);
  
  // Combine nonce and encrypted message
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);
  
  return util.encodeBase64(combined);
}

// Decrypt a message using a symmetric key (for group chats)
export function decryptWithSymmetricKey(encryptedMessage: string, symmetricKey: string): string | null {
  try {
    const combined = util.decodeBase64(encryptedMessage);
    const nonce = combined.slice(0, 24);
    const encrypted = combined.slice(24);
    
    const keyBytes = util.decodeBase64(symmetricKey);
    
    const decrypted = nacl.secretbox.open(encrypted, nonce, keyBytes);
    
    if (!decrypted) {
      return null;
    }
    
    return util.encodeUTF8(decrypted);
  } catch (error) {
    console.error('Symmetric decryption failed:', error);
    return null;
  }
}

// Encrypt the private key with a password for storage
export function encryptPrivateKey(privateKey: string, password: string): string {
  const privateKeyBytes = util.decodeBase64(privateKey);
  const passwordBytes = util.decodeUTF8(password);
  
  // Use the password to derive a key (simple approach - in production, use proper key derivation)
  const key = nacl.hash(passwordBytes).slice(0, 32);
  const nonce = nacl.randomBytes(24);
  
  const encrypted = nacl.secretbox(privateKeyBytes, nonce, key);
  
  // Combine nonce and encrypted private key
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);
  
  return util.encodeBase64(combined);
}

// Decrypt the private key with a password
export function decryptPrivateKey(encryptedPrivateKey: string, password: string): string | null {
  try {
    const combined = util.decodeBase64(encryptedPrivateKey);
    const nonce = combined.slice(0, 24);
    const encrypted = combined.slice(24);
    
    const passwordBytes = util.decodeUTF8(password);
    const key = nacl.hash(passwordBytes).slice(0, 32);
    
    const decrypted = nacl.secretbox.open(encrypted, nonce, key);
    
    if (!decrypted) {
      return null;
    }
    
    return util.encodeBase64(decrypted);
  } catch (error) {
    console.error('Private key decryption failed:', error);
    return null;
  }
}

// Encrypt symmetric key for a specific user (for group chats)
export function encryptSymmetricKeyForUser(
  symmetricKey: string,
  userPublicKey: string,
  senderPrivateKey: string
): string {
  return encryptMessage(symmetricKey, userPublicKey, senderPrivateKey);
}
