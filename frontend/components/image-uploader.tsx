'use client';

import React, { useRef } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function ImageUploader({ onFileSelect, selectedFile }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-4">
        Upload Image
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-white/20 bg-white/5 hover:border-primary/50 hover:bg-primary/5'
        }`}
        style={isDragging ? {boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'} : {}}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload image file"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-lg border border-white/20 bg-white/10 backdrop-blur-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
            </svg>
          </div>

          {selectedFile ? (
            <div className="text-center">
              <p className="text-base font-medium text-primary">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-base font-medium text-foreground">
                Drag and drop your image here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
