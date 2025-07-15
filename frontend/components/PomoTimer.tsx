"use client"
import { useState, useEffect, useRef } from "react"
import { Timer, Coffee, Zap, AlertTriangle, RotateCcw, Trash2, X, Square } from "lucide-react"
import { Quantico } from 'next/font/google';

const quantico = Quantico({ 
  weight: '700', // Bold
  subsets: ['latin'],
});


const SESSION_TYPES = {
  focus: 0.1 * 60,
  shortBreak: 0.1 * 60,
  longBreak: 0.1 * 60,
}

type SessionKey = keyof typeof SESSION_TYPES

export default function PomoTimer() {
  const [session, setSession] = useState<SessionKey>("focus")
  const [timeLeft, setTimeLeft] = useState(SESSION_TYPES[session])
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const dragRef = useRef(null)
  const [setshowResetModal, setSetshowResetModal] = useState(false)

  // Reset timer on session change
  useEffect(() => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [session])

  const [focusCount, setFocusCount] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          // Auto switch and start next session
          setSession((prevSession) => {
            if (prevSession === "focus") {
              const updatedCount = focusCount + 1
              setFocusCount(updatedCount)
              const nextSession = updatedCount % 4 === 0 ? "longBreak" : "shortBreak"
              setTimeout(() => setIsRunning(true), 100)
              return nextSession
            } else {
              setTimeout(() => setIsRunning(true), 100) // Auto start
              return "focus"
            }
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, session, focusCount])

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, "0")
    const s = (time % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const handleReset = () => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    setFocusCount(0)
    if (timerRef.current) clearInterval(timerRef.current)
    if (session === "focus") setFocusCount(0)
  }

  const handleResetcurrent = () => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleSkip = () => {
    if (session !== "focus") {
      setSession("focus")
    }
  }

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
      case "focus":
        return <Zap className="w-5 h-5" strokeWidth={3} />
      case "shortBreak":
        return <Coffee className="w-5 h-5" strokeWidth={3} />
      case "longBreak":
        return <Timer className="w-5 h-5" strokeWidth={3} />
      default:
        return null
    }
  }

  const getSessionColors = () => {
    switch (session) {
      case "focus":
        return {
          bg: "from-violet-900/90 via-purple-900/90 to-indigo-900/90",
          accent: "from-violet-500 to-purple-600",
          shadow: "shadow-violet-500/20",
        }
      case "shortBreak":
        return {
          bg: "from-emerald-900/90 via-teal-900/90 to-cyan-900/90",
          accent: "from-emerald-500 to-teal-600",
          shadow: "shadow-emerald-500/20",
        }
      case "longBreak":
        return {
          bg: "from-amber-900/90 via-orange-900/90 to-red-900/90",
          accent: "from-amber-500 to-orange-600",
          shadow: "shadow-amber-500/20",
        }
    }
  }

  const colors = getSessionColors()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 select-none">
      <div className="relative rounded-3xl p-12 w-full max-w-2xl text-center space-y-12 border-4 border-white/30">
        {/* Session Type Buttons */}
        <div className="flex gap-3 justify-center">
          {Object.keys(SESSION_TYPES).map((key) => (
            <button
              key={key}
              onClick={() => setSession(key as SessionKey)}
              className={`cursor-pointer px-10 py-4 rounded-full text-lg font-black transition-all duration-200 border-3 ${
                session === key
                  ? "bg-blue-600 text-white shadow-2xl border-blue-400"
                  : "bg-transparent text-white border-white/70 hover:border-white"
              }`} 
              style={{
              WebkitTextStroke: "2px rgba(255,255,255,0.)",
              textShadow: "0 0 20px rgba(0, 0, 0, 1)",
            }}
            >
              {key === "focus" ? "Focus" : key === "shortBreak" ? "Short Break" : "Long Break"}
            </button>
          ))}
        </div>

        {/* Focus Sessions Stars */}
        <div className="flex justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`text-4xl transition-all duration-300 font-black ${
                i < focusCount % 4 ? "text-yellow-400" : "text-white/30"
              }`}
              style={{
                textShadow: i < focusCount % 4 ? "0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.6)" : "none",
                WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              }}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Timer Display */}
        <div className="py-2">
          <div
            className={`text-9xl md:text-[10rem] lg:text-[10rem] font-black text-white font-mono tracking-wider ${quantico.className} select-none`}
            style={{
              WebkitTextStroke: "2px rgba(255,255,255,0.8)",
              textShadow: "0 0 20px rgba(0, 0, 0, 1)",
            }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full text-xl font-black transition-all duration-200 hover:scale-105 shadow-2xl border-3 border-blue-400 cursor-pointer"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => setSetshowResetModal(true)}
            className="bg-transparent border-3 border-white/70 hover:border-white hover:bg-white/10 text-white p-5 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" strokeWidth={3} />
          </button>
          {session !== "focus" && (
            <button
              onClick={handleSkip}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 hover:scale-105 border-3 border-white/50 "
            >
              <Square className="w-8 h-8" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Focus Count Display */}
        <div className="text-white/80 text-lg font-black border-2 border-white/40 rounded-xl p-3 bg-white/5">
          Focus Sessions: <span className="font-black text-white">{focusCount}</span>
        </div>
      </div>

      {/* Reset Modal */}
      {setshowResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white/90 backdrop-blur-md text-gray-800 p-8 rounded-3xl shadow-2xl w-[90%] max-w-md space-y-6 border-4 border-white/60">
            {/* Header with icon */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-xl border-2 border-orange-400/40">
                <AlertTriangle className="w-6 h-6 text-orange-600" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800">Reset Timer</h2>
              </div>
              <button
                onClick={() => setSetshowResetModal(false)}
                className="ml-auto p-1 hover:bg-gray-200 rounded-lg transition-colors duration-200 border-2 border-gray-300 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" strokeWidth={3} />
              </button>
            </div>
            <div className="h-1 bg-gray-400"></div>
            <p className="text-sm text-gray-600 font-black">What do you want to reset?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  handleResetcurrent()
                  setSetshowResetModal(false)
                }}
                className="flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all duration-200 hover:scale-[1.02] border-2 border-blue-400 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={3} />
                Current Timer
                <div className="ml-auto text-xs bg-blue-500/30 px-2 py-1 rounded-md font-black border border-blue-400/50">
                  Session Only
                </div>
              </button>
              <button
                onClick={() => {
                  setFocusCount(0)
                  handleReset()
                  setSetshowResetModal(false)
                }}
                className="flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black transition-all duration-200 hover:scale-[1.02] border-2 border-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" strokeWidth={3} />
                Entire Sessions
                <div className="ml-auto text-xs bg-red-500/30 px-2 py-1 rounded-md font-black border border-red-400/50">
                  All Data
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
