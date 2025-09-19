
import React, { useState, useCallback } from 'react';
import { FeatureTab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import FaceSwap from './components/FaceSwap';
import TitleGenerator from './components/TitleGenerator';
import Recreator from './components/Recreator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>(FeatureTab.Generate);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case FeatureTab.Generate:
        return <ThumbnailGenerator />;
      case FeatureTab.FaceSwap:
        return <FaceSwap />;
      case FeatureTab.Title:
        return <TitleGenerator />;
      case FeatureTab.Recreate:
        return <Recreator />;
      default:
        return <ThumbnailGenerator />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-8 bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-purple-500/10">
            {renderContent()}
          </div>
        </main>
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Pikzels. Built with AI for Creators.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
