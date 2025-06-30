'use client'
import React, { useState } from 'react'

interface NotesProps{
    initialText:string;
}

const Notes = ({initialText}:NotesProps) => {
   const [text, settext] = useState(initialText);

  return (
    <div>
      {initialText}

    </div>
  )
}

export default Notes
