// Debug script to identify exact permission error
console.log('=== Firebase Debug Started ===');

// Check current user
import { auth, db } from './src/firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('✅ User authenticated:', user.uid);
    console.log('Email:', user.email);
    
    try {
      // Test 1: Try to write to users collection
      console.log('🧪 Testing users collection write...');
      await setDoc(doc(db, 'users', user.uid), {
        test: 'data',
        timestamp: new Date()
      });
      console.log('✅ Users collection write: SUCCESS');
      
      // Test 2: Try to write to handles collection
      console.log('🧪 Testing handles collection write...');
      await setDoc(doc(db, 'handles', 'test-handle'), {
        uid: user.uid,
        reserved: true
      });
      console.log('✅ Handles collection write: SUCCESS');
      
      // Test 3: Try to read from users collection
      console.log('🧪 Testing users collection read...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('✅ Users collection read:', userDoc.exists());
      
      // Test 4: Try to create contact request
      console.log('🧪 Testing contactRequests collection...');
      await addDoc(collection(db, 'contactRequests'), {
        fromUid: user.uid,
        toUid: 'test-uid',
        status: 'pending',
        createdAt: new Date()
      });
      console.log('✅ ContactRequests collection: SUCCESS');
      
    } catch (error) {
      console.error('❌ Permission Error Details:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Full Error:', error);
      
      // Identify which operation failed
      if (error.message.includes('users')) {
        console.error('🔴 PROBLEM: Users collection permissions');
      } else if (error.message.includes('handles')) {
        console.error('🔴 PROBLEM: Handles collection permissions');
      } else if (error.message.includes('contactRequests')) {
        console.error('🔴 PROBLEM: ContactRequests collection permissions');
      } else {
        console.error('🔴 PROBLEM: Unknown permission issue');
      }
    }
  } else {
    console.log('❌ User not authenticated');
  }
});
