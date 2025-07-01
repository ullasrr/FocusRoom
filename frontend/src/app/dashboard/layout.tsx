// app/dashboard/layout.tsx
import React from 'react';
import LeftSidebar from '../../../components/LeftSidebar';
import './dashboard.css';

export const metadata = {
  title: 'Dashboard',
  description: 'User dashboard section',
};

async function getSidebarData(){
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res= await fetch(`${baseUrl}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.sidebar?.links || [];
}

export default async function DashboardLayout({

  children,
}: {
  children: React.ReactNode;
}) 
{
const sidebarLinks = await getSidebarData();
  return (
    <div className="min-h-screen bg-slate-900 text-black flex">
      {/* You can add a sidebar or topbar here if needed */}
      <LeftSidebar sidebar={sidebarLinks} />
      <div className="flex-1 p-4">
        {children}</div>
    </div>
  );
}
