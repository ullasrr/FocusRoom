// app/dashboard/layout.tsx
import React from 'react';
import LeftSidebar from '../../../components/LeftSidebar';
import './dashboard.css';

export const metadata = {
  title: 'Dashboard',
  description: 'User dashboard section',
};

async function getSidebarData(){
  const res= await fetch('http://localhost:3000/', {
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
    <div className="min-h-screen bg-gray-100 text-black flex">
      {/* You can add a sidebar or topbar here if needed */}
      <LeftSidebar sidebar={sidebarLinks} />
      <div className="p-4">
        {children}</div>
    </div>
  );
}
