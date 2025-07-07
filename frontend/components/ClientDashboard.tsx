'use client';

import React, { useState, useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import PomodoroTimer from './PomodoroTimer';
import Todo from './Todo';
import Notes from './Notes';
import { SessionProvider } from 'next-auth/react';
import PomoTimer from './PomoTimer';
import TodaySchedule from './TodaySchedule';
import StudyGPT from './StudyGPT';

// Define Theme interface
interface Theme {
  url: string;
}

interface Link {
  icon: string;
  label: string;
}

interface Props {
  sidebarLinks: Link[];
}

const ClientDashboard = ({ sidebarLinks }: Props) => {
  const [showTodo, setShowTodo] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCal, SetshowCal] = useState(false)
  const [showTheme, setshowTheme] = useState(false)
  const [showgpt, setshowgpt] = useState(false)

  // Fetch themes from backend
  useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch('http://localhost:3001/api/themes');
        if (!res.ok) {
          throw new Error('Failed to fetch themes');
        }
        const data: string[] = await res.json();
        setThemes(data.map((url) => ({ url })));
        console.log("image is fetched")
      } catch (err) {
        setError('Failed to load themes');
        console.error('Error fetching themes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);
  
  // Load saved theme from localStorage and set default
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes.some((theme) => theme.url === savedTheme)) {
      setSelectedTheme(savedTheme);
    } else if (themes.length > 0) {
      setSelectedTheme(themes[0].url); // Default to first theme
    }
  }, [themes]);
  

  // Apply selected theme as background
  const dashboardStyle: React.CSSProperties = {
    backgroundImage: selectedTheme ? `url(http://localhost:3001${selectedTheme})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };


  const handleSidebarClick = (label: string) => {
    if (label === 'Todo') setShowTodo((prev) => !prev);
    if (label === 'Notes') setShowNotes((prev) => !prev);
    if(label==='Timer') SetshowCal((prev)=>!prev)
    if(label==='Study GPT') setshowgpt((prev)=>!prev)
    if (label === 'Themes') {
      setshowTheme((prev)=>!prev);
    }
  };

  return (
    <SessionProvider>
      <div
        className="flex h-screen text-white overflow-hidden relative"
        style={dashboardStyle}
      >
        {/* Sidebar */}
        <LeftSidebar sidebar={sidebarLinks} onItemClick={handleSidebarClick} />

        {/* Main content */}
        <div className="flex-1 relative">
          {/* Theme Selector */}

          {showTheme && <div className="absolute top-4 left-4 z-20">
            {loading && <p className="text-gray-300">Loading themes...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && themes.length > 0 && (
              <div className="p-4 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Select Theme</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {themes.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedTheme(theme.url);
                        localStorage.setItem('selectedTheme', theme.url);
                      }}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedTheme === theme.url ? 'border-blue-500' : 'border-transparent'
                      } hover:border-blue-400 transition-colors`}
                    >
                      <img
                        src={`http://localhost:3001${theme.url}`}
                        alt={`Theme ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>}

          {/* Timer */}
          <div className="flex justify-center items-center h-full">
            <div className="p-6  bg-opacity-80 rounded-lg shadow-lg">
              <PomoTimer />
            </div>
          </div>

          {/* Notes */}
          {showNotes && (
            <div className="absolute top-4 right-4 z-10">
              <Notes />
            </div>
          )}
          
          {/* show calendar */}

          {showCal && (
            <div className='absolute left-0 z-100 top-0'>
              <TodaySchedule />
            </div>
          )}

          {showgpt && (
            <div className='absolute right-0 top-10'>
              <StudyGPT />
            </div>
          )}




          {/* Todo */}
          {showTodo && (
            <div className="absolute bottom-4 left-4 z-10">
              <Todo showtodo={showTodo} onClose={() => setShowTodo(false)} />
                
            </div>
          )}
        </div>
      </div>
    </SessionProvider>
  );
};

export default ClientDashboard;