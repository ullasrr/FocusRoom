'use client';
import React, { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import PomodoroTimer from './PomodoroTimer';
import Todo from './Todo';

interface Link {
  icon: string;
  label: string;
}

interface Props {
  sidebarLinks: Link[];
}

const ClientDashboard = ({ sidebarLinks }: Props) => {
  const [showTodo, setShowTodo] = useState(false);
 

  const handleSidebarclick = (label:string) =>{
    if(label === "Todo"){
      setShowTodo(prev=>!prev);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Sidebar */}
      <LeftSidebar sidebar={sidebarLinks} onItemClick={handleSidebarclick} />

      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Centered Pomodoro */}
        <div className="flex justify-center items-center h-full">
          <PomodoroTimer />
        </div>

        {/* Toggle Todo button */}
      

        {/* Todo at bottom-left */}
        {showTodo && (
          <div className="absolute bottom-4 left-4 flex">
            <Todo showtodo={showTodo} onClose={()=>setShowTodo(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
