
import React, { useState, useCallback } from 'react';
import { recreateThumbnail } from '../services/geminiService';
import Button from './common/Button';
import FileUpload from './common/FileUpload';
import { DownloadIcon } from './icons/DownloadIcon';

const Recreator: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleRecreate = useCallback(async () => {
    if (!thumbnail || !prompt.trim()) {
      setError('Please upload a thumbnail and describe the changes you want.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    try {
      const imageUrl = await recreateThumbnail(thumbnail, prompt);
      setResultImage(imageUrl);
    } catch (err) {
      setError('Failed to recreate thumbnail. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [thumbnail, prompt]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Thumbnail Recreation</h2>
        <p className="text-gray-400 mt-1">Upload a thumbnail and tell the AI how to modify it.</p>
      </div>

      <div className="space-y-6">
        <FileUpload
          label="1. Upload Existing Thumbnail"
          onFileSelect={setThumbnail}
          disabled={isLoading}
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="2. Describe your desired changes... e.g., 'Change the background to a futuristic city' or 'Make the text neon pink'"
          className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          disabled={isLoading}
        />
      </div>

      <Button onClick={handleRecreate} isLoading={isLoading} disabled={!thumbnail || !prompt.trim() || isLoading}>
        {isLoading ? 'Recreating...' : 'Recreate Thumbnail'}
      </Button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {resultImage && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-center">Recreated Thumbnail</h3>
          <div className="relative group">
            <img src={resultImage} alt="Recreated thumbnail" className="rounded-lg w-full aspect-video object-cover border-2 border-gray-600" />
            <a
              href={resultImage}
              download="pikzels-recreated.png"
              className="absolute bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all opacity-0 group-hover:opacity-100 flex items-center"
              aria-label="Download result"
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recreator;
