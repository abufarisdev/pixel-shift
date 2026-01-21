'use client';

import React from 'react';

export function Header() {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-3">
        <div className="w-10 h-10 rounded-lg border border-gray-300/20 bg-gradient-to-br from-gray-100/20 to-gray-300/10 backdrop-blur-2xl flex items-center justify-center" style={{boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)'}}>
          <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-100 bg-clip-text text-transparent">
        Pixel Shift
      </h1>

      <p className="text-base text-gray-300 font-light tracking-wide">
        Fast image format conversion
      </p>
    </div>
  );
}