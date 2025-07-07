// app/components/ThemeSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/types/themes';
import Image from 'next/image';

interface ThemeSelectorProps {
  themes: Theme[];
}

export default function ThemeSelector({ themes }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes.some((theme) => theme.url === savedTheme)) {
      setSelectedTheme(savedTheme);
    } else if (themes.length > 0) {
      setSelectedTheme(themes[0].url); // Default to first theme
    }
  }, [themes]);

  // Save selected theme to localStorage and apply to dashboard
  useEffect(() => {
    if (selectedTheme) {
      localStorage.setItem('selectedTheme', selectedTheme);
      document.body.style.backgroundImage = `url(http://localhost:3001${selectedTheme})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    }
  }, [selectedTheme]);

  const handleThemeChange = (url: string) => {
    setSelectedTheme(url);
  };

  return (
    <div className="p-4 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-2">Select Theme</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {themes.map((theme, index) => (
          // app/components/ThemeSelector.tsx (updated button section)
<button
  key={index}
  onClick={() => handleThemeChange(theme.url)}
  className={`relative w-full h-24 rounded-md overflow-hidden border-2 ${
    selectedTheme === theme.url ? 'border-blue-500' : 'border-transparent'
  } hover:border-blue-400 transition-colors`}
>
  <Image
    src={`http://localhost:3001${theme.url}`}
    alt={`Theme ${index + 1}`}
    width={100}
    height={96}
    className="w-full h-full object-cover"
  />
</button>
        ))}
      </div>
    </div>
  );
}