
import React from 'react';
import { FeatureTab } from '../types';
import { GenerateIcon } from './icons/GenerateIcon';
import { FaceSwapIcon } from './icons/FaceSwapIcon';
import { TitleIcon } from './icons/TitleIcon';
import { RecreateIcon } from './icons/RecreateIcon';

interface TabsProps {
  activeTab: FeatureTab;
  setActiveTab: (tab: FeatureTab) => void;
}

const TABS_CONFIG = [
  { id: FeatureTab.Generate, label: 'Generate', icon: <GenerateIcon /> },
  { id: FeatureTab.FaceSwap, label: 'FaceSwap', icon: <FaceSwapIcon /> },
  { id: FeatureTab.Title, label: 'Title Gen', icon: <TitleIcon /> },
  { id: FeatureTab.Recreate, label: 'Recreate', icon: <RecreateIcon /> },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center bg-gray-800 p-2 rounded-full border border-gray-700">
      <div className="flex space-x-2">
        {TABS_CONFIG.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center w-full px-4 py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
              ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
          >
            <span className="mr-2 h-5 w-5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
