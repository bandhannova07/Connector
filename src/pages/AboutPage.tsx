import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              About
            </h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* App Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ConnectorbyNova
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Secure end-to-end encrypted chat application
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version 1.0.0
            </p>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security Features
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <LockClosedIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    End-to-End Encryption
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All messages are encrypted on your device before being sent. Only you and the recipient can read them.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Zero-Knowledge Architecture
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We never have access to your messages or encryption keys. Your privacy is guaranteed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <GlobeAltIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Multi-Device Support
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Securely sync your conversations across all your devices with individual device keys.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About BandhanNova
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ConnectorbyNova is developed by BandhanNova, a technology company focused on creating 
              secure and user-friendly digital solutions. We believe in privacy-first design and 
              building tools that empower users to communicate safely.
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn more about us
                </p>
                <a 
                  href="https://bandhannova.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  bandhannova.netlify.app
                </a>
              </div>
            </div>
          </div>

          {/* Technical Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Technical Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Encryption</p>
                <p className="text-gray-900 dark:text-white">NaCl (Curve25519)</p>
              </div>
              
              <div>
                <p className="text-gray-500 dark:text-gray-400">Authentication</p>
                <p className="text-gray-900 dark:text-white">Firebase Auth</p>
              </div>
              
              <div>
                <p className="text-gray-500 dark:text-gray-400">Database</p>
                <p className="text-gray-900 dark:text-white">Cloud Firestore</p>
              </div>
              
              <div>
                <p className="text-gray-500 dark:text-gray-400">Framework</p>
                <p className="text-gray-900 dark:text-white">React + TypeScript</p>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legal & Privacy
            </h3>
            
            <div className="space-y-2 text-sm">
              <button className="text-primary-600 dark:text-primary-400 hover:underline">
                Privacy Policy
              </button>
              <br />
              <button className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms of Service
              </button>
              <br />
              <button className="text-primary-600 dark:text-primary-400 hover:underline">
                Open Source Licenses
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2024 BandhanNova. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
