import React from 'react'
// import Timer from '../../../components/Timer'
import PomodoroTimer from '../../../components/PomodoroTimer'
import Notes from '../../../components/Notes'
// import dotenv from 'dotenv'
// dotenv.config()


const DashboardPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res= await fetch(`${baseUrl}`, {
    cache: 'no-store',
    
  });
  const data = await res.json();
  return (
    <>
    <div className="flex justify-center items-center h-full bg-slate-900 text-white">
      <PomodoroTimer />
    </div>
    </>
  )
}

export default DashboardPage
