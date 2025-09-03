import * as nacl from 'tweetnacl';
import type { KeyPair, EncryptedMessage } from '../types';

// Simple text encoder/decoder for browser compatibility
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Base64 encoding/decoding
function encodeBase64(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data));
}

function decodeBase64(str: string): Uint8Array {
  return new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
}

export class CryptoService {
  private static instance: CryptoService;
  private keyPair: KeyPair | null = null;

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  generateKeyPair(): KeyPair {
    const boxKeys = nacl.box.keyPair();
    const signKeys = nacl.sign.keyPair();
    
    return {
      boxKeys,
      signKeys
    };
  }

  setKeyPair(keyPair: KeyPair | null) {
    this.keyPair = keyPair;
  }

  getKeyPair(): KeyPair | null {
    return this.keyPair;
  }

  encryptMessage(message: string, recipientPublicKey: string): EncryptedMessage {
    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    const nonce = nacl.randomBytes(24);
    const messageBytes = textEncoder.encode(message);
    const recipientKey = decodeBase64(recipientPublicKey);
    
    const encrypted = nacl.box(
      messageBytes,
      nonce,
      recipientKey,
      this.keyPair.boxKeys.secretKey
    );

    if (!encrypted) {
      throw new Error('Failed to encrypt message');
    }

    return {
      ciphertext: encodeBase64(encrypted),
      nonce: encodeBase64(nonce)
    };
  }

  decryptMessage(ciphertext: string, nonce: string, senderPublicKey: string): string {
    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    const ciphertextBytes = decodeBase64(ciphertext);
    const nonceBytes = decodeBase64(nonce);
    const senderKey = decodeBase64(senderPublicKey);

    const decrypted = nacl.box.open(
      ciphertextBytes,
      nonceBytes,
      senderKey,
      this.keyPair.boxKeys.secretKey
    );

    if (!decrypted) {
      throw new Error('Failed to decrypt message');
    }

    return textDecoder.decode(decrypted);
  }

  signMessage(message: string): string {
    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    const messageBytes = textEncoder.encode(message);
    const signature = nacl.sign.detached(messageBytes, this.keyPair.signKeys.secretKey);
    
    return encodeBase64(signature);
  }

  verifySignature(message: string, signature: string, publicKey: string): boolean {
    const messageBytes = textEncoder.encode(message);
    const signatureBytes = decodeBase64(signature);
    const publicKeyBytes = decodeBase64(publicKey);

    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  }

  encryptKeyPair(keyPair: KeyPair, password: string): string {
    const keyPairData = {
      boxKeys: {
        publicKey: encodeBase64(keyPair.boxKeys.publicKey),
        secretKey: encodeBase64(keyPair.boxKeys.secretKey)
      },
      signKeys: {
        publicKey: encodeBase64(keyPair.signKeys.publicKey),
        secretKey: encodeBase64(keyPair.signKeys.secretKey)
      }
    };

    const nonce = nacl.randomBytes(24);
    const passwordKey = nacl.hash(textEncoder.encode(password)).slice(0, 32);
    const dataBytes = textEncoder.encode(JSON.stringify(keyPairData));
    
    const encrypted = nacl.secretbox(dataBytes, nonce, passwordKey);
    
    if (!encrypted) {
      throw new Error('Failed to encrypt key pair');
    }
    
    return encodeBase64(nonce) + '.' + encodeBase64(encrypted);
  }

  decryptKeyPair(encryptedData: string, password: string): KeyPair {
    const [nonceB64, ciphertextB64] = encryptedData.split('.');
    const nonce = decodeBase64(nonceB64);
    const ciphertext = decodeBase64(ciphertextB64);
    const passwordKey = nacl.hash(textEncoder.encode(password)).slice(0, 32);

    const decrypted = nacl.secretbox.open(ciphertext, nonce, passwordKey);
    if (!decrypted) {
      throw new Error('Failed to decrypt key pair');
    }

    const keyPairData = JSON.parse(textDecoder.decode(decrypted));
    
    return {
      boxKeys: {
        publicKey: decodeBase64(keyPairData.boxKeys.publicKey),
        secretKey: decodeBase64(keyPairData.boxKeys.secretKey)
      },
      signKeys: {
        publicKey: decodeBase64(keyPairData.signKeys.publicKey),
        secretKey: decodeBase64(keyPairData.signKeys.secretKey)
      }
    };
  }

  exportPublicKeys(keyPair: KeyPair) {
    return {
      pubBoxKey: encodeBase64(keyPair.boxKeys.publicKey),
      pubSignKey: encodeBase64(keyPair.signKeys.publicKey)
    };
  }
}
