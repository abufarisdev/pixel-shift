'use client';

import React, { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { FormatSelector } from '@/components/format-selector';
import { ConvertButton } from '@/components/convert-button';
import { ResultSection } from '@/components/result-section';
import { Header } from '@/components/header';

type ImageFormat = 'jpg' | 'png' | 'webp' | 'pdf';

interface ConversionResult {
  format: ImageFormat;
  size: string;
  downloadUrl?: string;
  filename?: string;
}

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Main app component
export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('png');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  // Real conversion with backend
  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('format', selectedFormat);
      
      const response = await fetch(`${API_URL}/api/convert`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResult({
          format: data.data.format,
          size: data.data.size,
          downloadUrl: data.data.downloadUrl,
          filename: data.data.filename
        });
      } else {
        setError(data.message || 'Conversion failed');
      }
    } catch (error: any) {
      console.error('Conversion error:', error);
      setError(error.message || 'Failed to connect to server. Make sure backend is running on port 3001.');
      
      // Fallback to mock conversion for testing
      const fileSizeKB = (selectedFile.size / 1024).toFixed(2);
      setResult({
        format: selectedFormat,
        size: `${fileSizeKB} KB`,
        downloadUrl: '#',
        filename: `converted.${selectedFormat}`
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Download function
  const handleDownload = async () => {
    if (!result || !result.downloadUrl || !result.filename) {
      setError('No file to download');
      return;
    }

    try {
      // Check if it's a mock download URL
      if (result.downloadUrl === '#') {
        setError('Mock conversion - No actual file to download');
        return;
      }

      const fullUrl = `${API_URL}${result.downloadUrl}`;
      const response = await fetch(fullUrl);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || `converted-image.${result.format}`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Download failed');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed. Make sure backend is running.');
    }
  };

  // Reset function
  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/background.jpg')",
          opacity: 0.3
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <Header />

        <div className="w-full max-w-md rounded-lg p-4 border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl mb-8" style={{boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'}}>
          <ImageUploader onFileSelect={handleFileSelect} selectedFile={selectedFile} />

          <div className="my-4 border-t border-white/10"></div>

          <FormatSelector selectedFormat={selectedFormat} onFormatSelect={setSelectedFormat} />

          <div className="my-4 border-t border-white/10"></div>

          <ConvertButton 
            isDisabled={!selectedFile} 
            isLoading={isConverting} 
            onClick={handleConvert}
          />

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="w-full max-w-md">
            <ResultSection 
              format={result.format} 
              size={result.size} 
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </main>
  );
}