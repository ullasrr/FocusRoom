import React from 'react'
import Timer from '../../../components/Timer'
import Notes from '../../../components/Notes'
import LeftSidebar from '../../../components/LeftSidebar'


const DashboardPage = async () => {
  const res= await fetch('http://localhost:3000/', {
    cache: 'no-store',
    
  });
  const data = await res.json();
  return (
    <div>
      <div>this is dashboard</div>
      <Timer initialTime={data.initialTime} />
      <Notes initialText={data.notes} />
    </div>
  )
}

export default DashboardPage
