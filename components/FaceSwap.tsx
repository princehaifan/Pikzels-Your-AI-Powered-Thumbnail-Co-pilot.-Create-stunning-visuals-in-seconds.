
import React, { useState, useCallback, useEffect } from 'react';
import { faceSwap } from '../services/geminiService';
import Button from './common/Button';
import FileUpload from './common/FileUpload';
import { DownloadIcon } from './icons/DownloadIcon';

const FaceSwap: React.FC = () => {
  const [baseImage, setBaseImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [swapIntensity, setSwapIntensity] = useState<number>(() => {
    const savedIntensity = localStorage.getItem('swapIntensity');
    return savedIntensity ? parseFloat(savedIntensity) : 1;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('swapIntensity', String(swapIntensity));
  }, [swapIntensity]);

  const handleSwap = useCallback(async () => {
    if (!baseImage || !faceImage) {
      setError('Please upload both a base thumbnail and a face image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    try {
      const imageUrl = await faceSwap(baseImage, faceImage, swapIntensity);
      setResultImage(imageUrl);
    } catch (err) {
      setError('Failed to perform face swap. Please try again with clearer images.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [baseImage, faceImage, swapIntensity]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI FaceSwap</h2>
        <p className="text-gray-400 mt-1">Upload a thumbnail and a face to create a personalized visual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="1. Upload Base Thumbnail"
          onFileSelect={setBaseImage}
          disabled={isLoading}
        />
        <FileUpload
          label="2. Upload Face Image"
          onFileSelect={setFaceImage}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
          <label htmlFor="intensity-slider" className="block text-sm font-medium text-gray-300">
            Swap Intensity: <span className="font-bold text-purple-400">{(swapIntensity * 100).toFixed(0)}%</span>
          </label>
          <input
            id="intensity-slider"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={swapIntensity}
            onChange={(e) => setSwapIntensity(parseFloat(e.target.value))}
            disabled={isLoading}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            aria-label="Face swap intensity"
          />
      </div>

      <Button onClick={handleSwap} isLoading={isLoading} disabled={!baseImage || !faceImage || isLoading}>
        {isLoading ? 'Swapping Faces...' : 'Swap Faces'}
      </Button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {resultImage && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-center">Result</h3>
          <div className="relative group">
            <img src={resultImage} alt="Face-swapped thumbnail" className="rounded-lg w-full aspect-video object-cover border-2 border-gray-600" />
            <a
              href={resultImage}
              download="pikzels-faceswap.png"
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

export default FaceSwap;
