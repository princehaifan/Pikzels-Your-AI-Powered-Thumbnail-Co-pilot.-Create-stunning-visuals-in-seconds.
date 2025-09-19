
import React, { useState, useCallback } from 'react';
import { generateThumbnail } from '../services/geminiService';
import Button from './common/Button';
import { DownloadIcon } from './icons/DownloadIcon';

const ThumbnailGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your thumbnail.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateThumbnail(prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate thumbnail. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Thumbnail Generation</h2>
        <p className="text-gray-400 mt-1">Describe your video, and let AI create the perfect thumbnail.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A developer coding at night with a glowing screen"
          className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          disabled={isLoading}
        />
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim() || isLoading}>
          {isLoading ? 'Generating...' : 'Generate Thumbnail'}
        </Button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {generatedImage && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-center">Your Generated Thumbnail</h3>
          <div className="relative group">
            <img src={generatedImage} alt="Generated thumbnail" className="rounded-lg w-full aspect-video object-cover border-2 border-gray-600" />
            <a
              href={generatedImage}
              download="pikzels-thumbnail.jpg"
              className="absolute bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all opacity-0 group-hover:opacity-100 flex items-center"
              aria-label="Download thumbnail"
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGenerator;
