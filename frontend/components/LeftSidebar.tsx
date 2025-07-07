"use client"
import { iconMap } from "../lib/iconMap";
import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Clock, StickyNote, Music, Palette, Sparkles, ListChecks, Users, Flame, Quote, Settings } from "lucide-react"

interface Link{
  icon: string;
  label:string;
}

interface Props {
  sidebar?: Link[];
  onItemClick?: (label : string) =>void;
}

const LeftSidebar = ({ sidebar =[],onItemClick }: Props) => {
  return (
    
    <TooltipProvider delayDuration={300}>
      <div className="h-screen text-white w-16 border-r border-slate-700 shadow-xl">
        <div className="flex flex-col space-y-2 p-2">
          {sidebar.filter((item) => iconMap[item.icon]).map((item, index) => (
            <SidebarItem
              key={index}
              icon={iconMap[item.icon] ?? iconMap["Clock"]}
              label={item.label}
              onClick={() => onItemClick?.(item.label)}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default LeftSidebar

function SidebarItem({ icon, label,onClick }: { icon: React.ReactNode; label: string; onClick?: () => void; }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={onClick}
          className="flex items-center justify-center w-12 h-12 hover:bg-slate-700/70 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md group"
        >
          <div className="text-slate-300 group-hover:text-white transition-colors duration-200">{icon}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="ml-2">
        <p className="text-sm font-medium">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
