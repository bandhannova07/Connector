import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-3xl font-bold text-white mb-2">ConnectorbyNova</h1>
        <p className="text-primary-100">Loading your secure chat...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
