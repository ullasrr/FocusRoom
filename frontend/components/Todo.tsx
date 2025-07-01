"use client"

import { useEffect, useState } from "react"

interface TodoItem {
  id: number
  text: string
  completed: boolean
}


interface props{
  showtodo:boolean;
  onClose: ()=>void;
}


const Todo = ({showtodo,onClose}:props) => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState("")

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim() === "") return
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    }
    setTodos((prev) => [newTodo, ...prev])
    setInput("")
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 rounded-2xl shadow-2xl text-white w-96 backdrop-blur-sm border border-white/10">
      <div className="mb-6 relative">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex-grow">
      ✨ Todo List
    </h2>
    <button
      onClick={onClose}
  className="cursor-pointer group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
>
  <span className="absolute inset-0 bg-purple-600 bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 ease-in-out"></span>
  <span className="relative z-10">✕ Close</span>
</button >

  </div>
  <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
</div>

      <div className="flex mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          className="flex-1 px-4 py-3 rounded-l-xl bg-white/10 text-white border border-white/20 border-r-0 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 backdrop-blur-sm transition-all duration-200"
          placeholder="Add new task..."
        />
        <button
          onClick={addTodo}
          className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-3 py-3 rounded-r-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          +
        </button>
      </div>

      <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={`flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 animate-slideIn ${
              todo.completed ? "opacity-75" : ""
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`flex-1 cursor-pointer text-sm transition-all duration-300 ${
                todo.completed ? "line-through text-white/50" : "text-white hover:text-purple-200"
              }`}
            >
              <span className="mr-3 text-lg">{todo.completed ? "✅" : "⭕"}</span>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 transform hover:scale-110 flex-shrink-0"
            >
              🗑️
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-center py-8 text-white/60">
            <div className="text-4xl mb-2">📝</div>
            <p>No tasks yet. Add one above!</p>
          </li>
        )}
      </ul>

      <div className="mt-4 text-center text-xs text-white/50">
        {todos.length} {todos.length === 1 ? "task" : "tasks"} • {todos.filter((t) => t.completed).length} completed
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation-name: slideIn;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-purple-500::-webkit-scrollbar-thumb {
          background: rgb(168 85 247);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default Todo
