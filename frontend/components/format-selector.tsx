'use client';

import React from 'react';

type ImageFormat = 'jpg' | 'png' | 'webp' | 'pdf';

interface FormatSelectorProps {
  selectedFormat: ImageFormat;
  onFormatSelect: (format: ImageFormat) => void;
}

const formats: { value: ImageFormat; label: string }[] = [
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'pdf', label: 'PDF' },
];

export function FormatSelector({ selectedFormat, onFormatSelect }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-4">
        Target Format
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {formats.map(format => (
          <button
            key={format.value}
            onClick={() => onFormatSelect(format.value)}
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-2xl ${
              selectedFormat === format.value
                ? 'border-primary/50 bg-primary/20 text-primary'
                : 'text-foreground hover:border-white/40 hover:bg-white/15'
            }`}
            style={selectedFormat === format.value ? {boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'} : {}}
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
}
