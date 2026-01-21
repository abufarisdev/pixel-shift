'use client';

import React from 'react';

interface ConvertButtonProps {
  isDisabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function ConvertButton({ isDisabled, isLoading, onClick }: ConvertButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-2xl ${
        isDisabled
          ? 'text-muted-foreground cursor-not-allowed opacity-50'
          : 'bg-gradient-to-r from-primary to-accent text-background hover:shadow-lg'
      }`}
      style={!isDisabled ? {boxShadow: '0 8px 16px rgba(0, 212, 255, 0.2)'} : {}}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
            <span>Converting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Convert Image</span>
          </>
        )}
      </div>
    </button>
  );
}
