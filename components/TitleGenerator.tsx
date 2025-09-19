
import React, { useState, useCallback } from 'react';
import { generateTitles } from '../services/geminiService';
import Button from './common/Button';

const TitleGenerator: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      setError('Please enter a video description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTitles([]);
    try {
      const generatedTitles = await generateTitles(description);
      setTitles(generatedTitles);
    } catch (err) {
      setError('Failed to generate titles. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [description]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Title Generation</h2>
        <p className="text-gray-400 mt-1">Get catchy and creative title ideas for your videos.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe your video content here..."
          className="w-full h-36 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          disabled={isLoading}
        />
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!description.trim() || isLoading}>
          {isLoading ? 'Generating...' : 'Generate Titles'}
        </Button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {titles.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-center">Generated Titles</h3>
          <ul className="space-y-3">
            {titles.map((title, index) => (
              <li
                key={index}
                className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center group"
              >
                <span className="text-gray-200">{title}</span>
                <button 
                  onClick={() => copyToClipboard(title)}
                  className="text-gray-400 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Copy title"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TitleGenerator;
