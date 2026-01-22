'use client';

import React from 'react';

type ImageFormat = 'jpg' | 'png' | 'webp' | 'pdf';

interface ResultSectionProps {
  format: ImageFormat;
  size: string;
  onDownload?: () => void;
  onReset?: () => void;
}

export function ResultSection({ format, size, onDownload, onReset }: ResultSectionProps) {
  return (
    <div className="w-full max-w-md rounded-lg p-4 border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl animate-fade-in" style={{boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'}}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg border border-white/20 bg-white/10 backdrop-blur-2xl flex-shrink-0 flex items-center justify-center" style={{boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'}}>
          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Conversion Complete!
          </h3>
          <div className="space-y-0.5 text-sm text-muted-foreground">
            <p>
              Format: <span className="text-primary font-medium">{format.toUpperCase()}</span>
            </p>
            <p>
              Size: <span className="text-accent font-medium">{size}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2">
        <button 
          onClick={onDownload}
          className="flex-1 py-2 px-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-2xl text-foreground hover:bg-white/15 transition-all duration-300 font-medium text-sm"
        >
          <div className="flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </div>
        </button>
        <button 
          onClick={onReset}
          className="flex-1 py-2 px-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-2xl text-foreground hover:bg-white/15 transition-all duration-300 font-medium text-sm"
        >
          <div className="flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Convert Another
          </div>
        </button>
      </div>
    </div>
  );
}