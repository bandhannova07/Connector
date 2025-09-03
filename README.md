# ConnectorbyNova

A secure, end-to-end encrypted chat application built with React, TypeScript, and Firebase.

## Features

- **End-to-End Encryption**: All messages are encrypted client-side using NaCl (tweetnacl)
- **Firebase Backend**: Authentication, Firestore database, and Cloud Storage
- **Real-time Messaging**: Live message updates with Firestore listeners
- **User Search & Contact Requests**: Find and connect with other users
- **PWA Support**: Installable as a Progressive Web App
- **Dark/Light Theme**: System-aware theme switching
- **WebAuthn Support**: Biometric authentication for app lock
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Encryption**: tweetnacl (NaCl)
- **PWA**: Vite PWA Plugin

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ConnectorbyNova
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Update `src/firebase/config.ts` with your Firebase configuration
   - Deploy Firestore security rules: `firebase deploy --only firestore:rules`

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Security

- **Client-side Encryption**: Messages are encrypted before leaving your device
- **Zero-Knowledge**: Server never sees plaintext messages
- **Key Management**: Encryption keys are stored locally and encrypted with user password
- **WebAuthn**: Optional biometric authentication for app unlock

## Firebase Setup

### Firestore Collections

- `users/{uid}` - User profiles and public keys
- `handles/{username}` - Username reservations
- `contactRequests/{requestId}` - Friend requests
- `chats/{chatId}` - Chat metadata
- `chats/{chatId}/messages/{messageId}` - Encrypted messages

### Security Rules

Deploy the included `firestore.rules` file to your Firebase project.

## Development

### Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Route components
├── services/          # Business logic and API calls
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and helpers
└── firebase/          # Firebase configuration
```

### Key Services

- `AuthService` - User authentication and profile management
- `ChatService` - Messaging and real-time updates
- `CryptoService` - End-to-end encryption
- `WebAuthnService` - Biometric authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## About BandhanNova

ConnectorbyNova is developed by BandhanNova, a technology company focused on creating secure and user-friendly digital solutions.

Visit: [bandhannova.netlify.app](https://bandhannova.netlify.app)
