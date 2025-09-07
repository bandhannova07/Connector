import React, { useState } from 'react';
import { 
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';

export const FeedbackScreen: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'adminFeedback'), {
        userId: user.uid,
        userEmail: user.email,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your feedback. We'll review it and get back to you if needed.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Feedback</h2>
        <p className="text-lg text-gray-600">
          Help us improve ConnectorbyNova by sharing your thoughts and suggestions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              placeholder="Brief description of your feedback"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {subject.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="input-field resize-none"
              placeholder="Please provide detailed feedback, suggestions, or report any issues you've encountered..."
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/1000 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={!subject.trim() || !message.trim() || loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>Send Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Feedback Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Feedback Guidelines:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Be specific about issues or suggestions</li>
              <li>Include steps to reproduce any bugs</li>
              <li>Mention your device/browser if reporting technical issues</li>
              <li>Be respectful and constructive in your feedback</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Need immediate help?</h3>
        <p className="text-sm text-gray-600 mb-2">
          For urgent issues or direct support, you can also contact us at:
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">
            <strong>Email:</strong> bandhannova@gmail.com
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> +91 7003448284
          </p>
        </div>
      </div>
    </div>
  );
};
