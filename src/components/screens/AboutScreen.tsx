import React from 'react';
import { 
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

export const AboutScreen: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About ConnectorbyNova</h2>
        <p className="text-lg text-gray-600">
          Secure, encrypted messaging for everyone
        </p>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">App Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Build</span>
            <span className="font-medium">2025.01.01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform</span>
            <span className="font-medium">Web</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
            End-to-end encryption for all messages
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
            Real-time messaging
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
            Group chats with multiple participants
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
            Media sharing (images, videos, voice messages)
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
            Friend request system
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
            Passkey authentication support
          </li>
        </ul>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">About BandhanNova</h3>
        <p className="text-gray-600 mb-4">
          ConnectorbyNova is developed by BandhanNova, a technology company focused on creating 
          secure and user-friendly digital communication solutions.
        </p>
        
        <div className="space-y-3">
          <a
            href="https://bandhannova.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <GlobeAltIcon className="h-5 w-5" />
            <span>Visit our website</span>
          </a>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <EnvelopeIcon className="h-5 w-5" />
            <span>bandhannova@gmail.com</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <PhoneIcon className="h-5 w-5" />
            <span>+91 7003448284</span>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h3>
        <div className="space-y-3 text-gray-600">
          <p>
            Your privacy is our top priority. ConnectorbyNova uses end-to-end encryption 
            to ensure that only you and your intended recipients can read your messages.
          </p>
          <p>
            We use industry-standard encryption protocols (NaCl/TweetNaCl) to protect 
            your communications. Your private keys are encrypted with your password and 
            stored securely on your device.
          </p>
          <p>
            We do not have access to your message content, and we cannot decrypt your 
            messages even if we wanted to.
          </p>
        </div>
      </div>

      {/* Open Source */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology</h3>
        <div className="space-y-2 text-gray-600">
          <p><strong>Frontend:</strong> React, TypeScript, Tailwind CSS</p>
          <p><strong>Backend:</strong> Firebase (Auth & Firestore)</p>
          <p><strong>Storage:</strong> Supabase Storage</p>
          <p><strong>Encryption:</strong> NaCl (TweetNaCl)</p>
          <p><strong>Deployment:</strong> Netlify</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
        <p>&copy; 2025 BandhanNova. All rights reserved.</p>
        <p className="mt-1">ConnectorbyNova v1.0.0</p>
      </div>
    </div>
  );
};
