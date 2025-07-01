"use client"
import { iconMap } from "../lib/iconMap";
import type React from "react"

import { Clock, StickyNote, Music, Palette, Sparkles, ListChecks, Users, Flame, Quote, Settings } from "lucide-react"

interface Link{
  icon: string;
  label:string;
}

interface Props {
  sidebar?: Link[]
}

const LeftSidebar = ({ sidebar =[] }: Props) => {
  return (
    
    <div className="group h-screen bg-slate-900 text-white w-16 hover:w-64 transition-all duration-300 overflow-hidden border-r border-slate-700 shadow-xl">
      <div className="flex flex-col p-2 space-y-2 ">
        {sidebar.map((item, index) => (
          <SidebarItem
            key={index}
            icon={iconMap[item.icon] ?? iconMap["Clock"]}

            label={item.label}
          />  
        ))}
        
      </div>
    </div>
  )
}

export default LeftSidebar

function SidebarItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-700/70 rounded-lg cursor-pointer group relative transition-all duration-200 ease-in-out hover:shadow-md">
      <div className="text-slate-300 group-hover:text-white transition-colors duration-200 flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
        {label}
      </span>

    
    </div>
  )
}
