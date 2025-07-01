import React from 'react'
import ClientDashboard from '../../../components/ClientDashboard'


async function getSidebarData(){
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res= await fetch(`${baseUrl}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.sidebar?.links || [];
}


const DashboardPage = async () => {
  const sidebarLinks = await getSidebarData();

  return (
    <>
    <div className=" ">
      <ClientDashboard sidebarLinks={sidebarLinks} />
    </div>
    </>
  )
}

export default DashboardPage
