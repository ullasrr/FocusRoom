// app/dashboard/layout.tsx
import React from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import './dashboard.css';
import Todo from '../../components/Todo';

export const metadata = {
  title: 'Dashboard',
  description: 'User dashboard section',
};

async function getSidebarData(){
    const baseUrl = process.env.backendurl;
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
  return (<> 
    <div className=" bg-slate-900 text-black flex h-screen overflow-hidden">
      {/* You can add a sidebar or topbar here if needed */}
      
      <div className="flex-1">
     
        {children}
    

        </div>
    </div>
  </>
  );
}
