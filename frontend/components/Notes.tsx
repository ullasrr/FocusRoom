"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit3, Trash2, Save, X, Search, StickyNote, Calendar, Tag } from "lucide-react"

interface Note {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" })

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create new note
  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        const createdNote = await response.json()
        setNotes([createdNote, ...notes])
        setNewNote({ title: "", content: "", tags: "" })
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  // Update note
  const updateNote = async (id: string, updatedData: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setNotes(notes.map((note) => (note._id === id ? updatedNote : note)))
        setEditingId(null)
      }
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  // Delete note
  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== id))
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // Filter notes based on search term
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="fixed top-20 right-4 w-96 bg-white rounded-xl shadow-lg z-50 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-20 right-4 w-96 max-h-[80vh] bg-white rounded-xl shadow-lg z-50 border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-bold text-gray-800">My Notes</h2>
            <Badge variant="secondary" className="text-xs">
              {notes.length}
            </Badge>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-8 text-sm"
          />
        </div>
      </div>

      {/* Create Note Form */}
      {isCreating && (
        <Card className="m-4 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-700">Create New Note</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-6 w-6 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="h-8 text-sm"
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={3}
              className="text-sm resize-none"
            />
            <Input
              placeholder="Tags (comma separated)..."
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              className="h-8 text-sm"
            />
            <Button onClick={createNote} size="sm" className="w-full bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-1" />
              Save Note
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <ScrollArea className="flex-1 max-h-96">
        <div className="p-4 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">{searchTerm ? "No notes found" : "No notes yet. Create your first note!"}</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                isEditing={editingId === note._id}
                onEdit={() => setEditingId(note._id)}
                onSave={(updatedData) => updateNote(note._id, updatedData)}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteNote(note._id)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface NoteCardProps {
  note: Note
  isEditing: boolean
  onEdit: () => void
  onSave: (data: Partial<Note>) => void
  onCancel: () => void
  onDelete: () => void
  formatDate: (date: string) => string
}

function NoteCard({ note, isEditing, onEdit, onSave, onCancel, onDelete, formatDate }: NoteCardProps) {
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content,
    tags: note.tags.join(", "),
  })

  const handleSave = () => {
    onSave({
      title: editData.title,
      content: editData.content,
      tags: editData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
  }

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-3 space-y-2">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="h-8 text-sm font-medium"
          />
          <Textarea
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            rows={3}
            className="text-sm resize-none"
          />
          <Input
            value={editData.tags}
            onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
            placeholder="Tags (comma separated)"
            className="h-8 text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1 h-7 text-xs">
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm" className="flex-1 h-7 text-xs bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow border-gray-200 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">{note.title}</h3>
          <div className="flex gap-1 ml-2">
            <Button onClick={onEdit} variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-100">
              <Edit3 className="w-3 h-3 text-blue-600" />
            </Button>
            <Button onClick={onDelete} variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-100">
              <Trash2 className="w-3 h-3 text-red-600" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-3">{note.content}</p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(note.updatedAt)}
        </div>
      </CardContent>
    </Card>
  )
}
