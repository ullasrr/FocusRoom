"use client"
import { iconMap } from "../lib/iconMap";
import type React from "react"

import { Clock, StickyNote, Music, Palette, Sparkles, ListChecks, Users, Flame, Quote } from "lucide-react"

interface Link{
  icon: string;
  label:string;
}

interface Props {
  sidebar?: Link[]
}

const LeftSidebar = ({ sidebar =[] }: Props) => {
  return (
    // <div className="h-screen bg-slate-900 text-white w-16 hover:w-64 transition-all duration-300 overflow-hidden border-r border-slate-700 shadow-xl">
    //   <div className="flex flex-col p-3 space-y-2">
    //     <SidebarItem icon={<Clock />} label="Timer" />
    //     <SidebarItem icon={<StickyNote />} label="Notes" />
    //     <SidebarItem icon={<Music />} label="Sounds" />
    //     <SidebarItem icon={<Palette />} label="Themes" />
    //     <SidebarItem icon={<ListChecks />} label="To do" />
    //     <SidebarItem icon={<Users />} label="Create custom room" />
    //     <SidebarItem icon={<Flame />} label="Streak" />
    //     <SidebarItem icon={<Quote />} label="Enable study quotes" />
    //     <SidebarItem icon={<Sparkles />} label="Study GPT" />
    //   </div>
    // </div>
    <div className="h-screen bg-slate-900 text-white w-16 hover:w-64 transition-all duration-300 overflow-hidden border-r border-slate-700 shadow-xl">
      <div className="flex flex-col p-2 space-y-2">
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

      {/* Tooltip for collapsed state */}
      {/* <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none z-50 border border-slate-600 group-hover:delay-500 hidden group-hover:block">
        {label}
        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
      </div> */}
    </div>
  )
}
