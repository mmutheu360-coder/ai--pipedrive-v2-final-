'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function NotesEditor({
  dealId,
  initialNotes
}: {
  dealId: string
  initialNotes: string
}) {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(initialNotes || '')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSave = async () => {
    setMessage('Saving...')

    try {
      const { error } = await supabase
        .from('deals')
        .update({ notes })
        .eq('id', dealId)

      if (error) {
        console.error('NOTES UPDATE ERROR:', error)
        setMessage(`Error: ${error.message}`)
        return
      }

      setEditing(false)
      setMessage('Notes saved successfully.')

      // Refresh the server-rendered deal data
      router.refresh()

    } catch (err: any) {
      console.error('NOTES ERROR:', err)
      setMessage(`Error: ${err.message}`)
    }
  }

  if (!editing) {
    return (
      <div className="mt-4">
        <p>
          <b>Notes:</b> {notes || 'No notes yet'}{' '}
          <button
            onClick={() => {
              setMessage('')
              setEditing(true)
            }}
            className="text-blue-600 underline text-sm"
          >
            Edit
          </button>
        </p>

        {message && (
          <p className="text-sm text-green-600 mt-1">
            {message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4">
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="border p-2 rounded w-full"
        rows={3}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-3 py-1 rounded mt-1 mr-2"
      >
        Save
      </button>

      <button
        onClick={() => setEditing(false)}
        className="text-gray-600 mt-1"
      >
        Cancel
      </button>

      {message && (
        <p className="text-sm mt-1">
          {message}
        </p>
      )}
    </div>
  )
}
