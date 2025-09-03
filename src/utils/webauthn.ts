export class WebAuthnService {
  private static instance: WebAuthnService;

  static getInstance(): WebAuthnService {
    if (!WebAuthnService.instance) {
      WebAuthnService.instance = new WebAuthnService();
    }
    return WebAuthnService.instance;
  }

  async isWebAuthnSupported(): Promise<boolean> {
    return !!(navigator.credentials && navigator.credentials.create);
  }

  async createPasskey(userId: string, username: string): Promise<boolean> {
    try {
      if (!await this.isWebAuthnSupported()) {
        throw new Error('WebAuthn not supported');
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "ConnectorbyNova",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          {
            alg: -7, // ES256
            type: "public-key"
          },
          {
            alg: -257, // RS256
            type: "public-key"
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (credential) {
        // Store credential ID for future authentication
        localStorage.setItem('webauthn_credential_id', credential.id);
        localStorage.setItem('webauthn_enabled', 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to create passkey:', error);
      return false;
    }
  }

  async authenticateWithPasskey(): Promise<boolean> {
    try {
      if (!await this.isWebAuthnSupported()) {
        throw new Error('WebAuthn not supported');
      }

      const credentialId = localStorage.getItem('webauthn_credential_id');
      if (!credentialId) {
        throw new Error('No passkey found');
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
          type: 'public-key'
        }],
        timeout: 60000,
        userVerification: "required"
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      return !!assertion;
    } catch (error) {
      console.error('Failed to authenticate with passkey:', error);
      return false;
    }
  }

  isPasskeyEnabled(): boolean {
    return localStorage.getItem('webauthn_enabled') === 'true';
  }

  disablePasskey(): void {
    localStorage.removeItem('webauthn_credential_id');
    localStorage.removeItem('webauthn_enabled');
  }
}
