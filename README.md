# ConnectorbyNova - Secure Chat Application

A modern, secure, end-to-end encrypted chat application built with React, TypeScript, Firebase, and Supabase.

## 🚀 Features

- **End-to-End Encryption**: All messages are encrypted using NaCl (TweetNaCl) with X25519/XSalsa20-Poly1305
- **Real-time Messaging**: Instant messaging with Firebase Firestore
- **Media Sharing**: Upload and share images, videos, voice messages, and files via Supabase Storage
- **Friend System**: Send and accept friend requests to connect with other users
- **Group Chats**: Create and manage group conversations
- **User Search**: Find and connect with other users
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **PWA Support**: Can be installed as a Progressive Web App
- **Passkey Authentication**: Modern biometric authentication support (planned)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Storage**: Supabase Storage
- **Encryption**: NaCl (TweetNaCl)
- **State Management**: Zustand
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Supabase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd connectorbynova
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at Firebase Console
   - Enable Authentication (Email/Password + Google Sign-In)
   - Create a Firestore database
   - Update `src/lib/firebase.ts` with your Firebase config

4. Configure Supabase:
   - Create a Supabase project at Supabase
   - Create a storage bucket named `chat-media`
   - Update `src/lib/supabase.ts` with your Supabase config

5. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

6. Start development server:
```bash
npm run dev
```

## 🔐 Security Features

- **Client-side Encryption**: All messages are encrypted on the client before being sent to the server
- **Zero-knowledge Architecture**: The server never sees plaintext messages
- **Secure Key Management**: Private keys are encrypted with user passwords and stored locally
- **Firestore Security Rules**: Comprehensive rules ensure users can only access their own data
- **File Upload Security**: Supabase storage with signed URLs and file type validation

## 📱 Usage

1. **Sign Up/Sign In**: Create an account or sign in with email/password or Google
2. **Search Users**: Find other users by email or display name
3. **Send Friend Requests**: Connect with other users
4. **Start Chatting**: Send encrypted messages, images, videos, and voice messages
5. **Create Groups**: Start group conversations with multiple participants
6. **Manage Settings**: Customize your profile and app preferences

## 🚀 Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy to: `connectorbynova.netlify.app`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication forms
│   ├── chat/           # Chat-related components
│   ├── friends/        # Friends management
│   ├── layout/         # Layout components
│   ├── screens/        # Main screen components
│   └── search/         # User search
├── lib/                # Utility libraries
│   ├── encryption.ts   # End-to-end encryption
│   ├── firebase.ts     # Firebase configuration
│   ├── supabase.ts     # Supabase configuration
│   └── fileUpload.ts   # File upload utilities
├── store/              # Zustand state management
│   ├── authStore.ts    # Authentication state
│   ├── chatStore.ts    # Chat state
│   └── friendsStore.ts # Friends state
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔒 Privacy & Security

ConnectorbyNova is designed with privacy as the top priority:

- **End-to-End Encryption**: Messages are encrypted using industry-standard NaCl encryption
- **Local Key Storage**: Private keys never leave your device
- **Zero Server Access**: The server cannot decrypt your messages
- **Secure File Sharing**: Files are encrypted and shared via signed URLs
- **No Data Mining**: We don't collect or analyze your personal data

## 📞 Support

For support or questions:
- Email: bandhannova@gmail.com
- Phone: +91 7003448284
- Website: https://bandhannova.netlify.app

## 📄 License

This project is licensed under the MIT License.

## 🏢 About BandhanNova

ConnectorbyNova is developed by BandhanNova, a technology company focused on creating secure and user-friendly digital communication solutions.

---

**ConnectorbyNova v1.0.0** - Built with ❤️ by BandhanNova
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
