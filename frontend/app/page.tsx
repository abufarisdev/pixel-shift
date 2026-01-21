'use client';

import React, { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { FormatSelector } from '@/components/format-selector';
import { ConvertButton } from '@/components/convert-button';
import { ResultSection } from '@/components/result-section';
import { Header } from '@/components/header';

type ImageFormat = 'jpg' | 'png' | 'webp' | 'pdf';

// Main app component
export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('png');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<{ format: ImageFormat; size: string } | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fileSizeKB = (selectedFile.size / 1024).toFixed(2);
    setResult({
      format: selectedFormat,
      size: `${fileSizeKB} KB`
    });
    setIsConverting(false);
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
        </div>

        {result && <ResultSection format={result.format} size={result.size} />}
      </div>
    </main>
  );
}