# Firebase Setup Instructions

## Fix Permissions Error

The "Missing or insufficient permissions" error occurs because Firestore security rules need to be deployed. Follow these steps:

### Option 1: Deploy via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `connetor-by-nova`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with this temporary permissive rule:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all authenticated users to read and write during development
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

### Option 2: Firebase CLI Setup (বিস্তারিত)

#### Step 1: Firebase CLI Install করুন
```bash
# Global install
npm install -g firebase-tools

# Version check করুন
firebase --version
```

#### Step 2: Firebase Login করুন
```bash
# Login command
firebase login

# Browser এ login page খুলবে
# আপনার Google account দিয়ে login করুন
# Terminal এ success message দেখুন
```

#### Step 3: Project Initialize করুন
```bash
# Project directory তে যান
cd /home/lordbandhan/MyProjects/ConnectorbyNova

# Firebase project initialize করুন
firebase init

# নিচের options select করুন:
# - Firestore: Configure security rules and indexes files for Firestore
# - Use existing project: connetor-by-nova
# - firestore.rules file: Enter (default)
# - firestore.indexes.json file: Enter (default)
```

#### Step 4: Rules Deploy করুন
```bash
# শুধুমাত্র Firestore rules deploy করুন
firebase deploy --only firestore:rules

# অথবা সব কিছু deploy করতে চাইলে
firebase deploy
```

#### Step 5: Verify করুন
```bash
# Project status check করুন
firebase projects:list

# Current project check করুন
firebase use
```

#### Troubleshooting Commands:
```bash
# যদি project switch করতে হয়
firebase use connetor-by-nova

# Rules validate করতে চাইলে
firebase firestore:rules:validate

# Local emulator run করতে চাইলে
firebase emulators:start --only firestore
```

### Test Account Creation

After deploying the rules, try creating an account again. The app should work properly.

### Security Note

The current rules are permissive for development. For production, use more restrictive rules from the original `firestore.rules` file.
