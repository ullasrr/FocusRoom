'use client'
import React, { useEffect, useState } from 'react'

interface Timerprops{
    initialTime:number;
}

const Timer = ({initialTime}:Timerprops) => {
  const [time, settime] = useState(initialTime)
  const [running, setrunning] = useState(false)

  useEffect(()=>{
    let interval:NodeJS.Timeout;
    if(running){
        interval=setInterval(()=>{
            settime((prev)=> (prev > 0 ?prev-1:0));
        },1000)
    }
    return () => clearInterval(interval);

  },[running]);

  return (
        <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Pomodoro Timer</h2>
      <p className="text-5xl font-mono mb-4">
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </p>
      <button
        onClick={() => setrunning(!running)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {running ? 'Pause' : 'Start'}
      </button>
    </div>
    
  )
}

export default Timer
