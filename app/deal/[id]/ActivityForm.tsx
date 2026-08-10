'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ActivityForm({ dealId }: { dealId: string }) {
  const router = useRouter()

  const [type, setType] = useState('call')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('Saving...')

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          deal_id: dealId,
          type,
          description: description.trim(),
        })
        .select()
        .single()

      if (error) {
        console.error('ACTIVITY INSERT ERROR:', error)
        setMessage(`ERROR: ${error.message}`)
        return
      }

      console.log('ACTIVITY SAVED:', data)

      setDescription('')
      setMessage('Activity saved successfully.')

      // Refresh the server-rendered deal page
      router.refresh()

    } catch (err: any) {
      console.error('ACTIVITY ERROR:', err)
      setMessage(`ERROR: ${err.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">

      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="call">Call</option>
        <option value="email">Email</option>
        <option value="meeting">Meeting</option>
        <option value="note">Note</option>
      </select>

      <input
        required
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Activity
      </button>

      {message && (
        <p className="mt-2 text-sm">
          {message}
        </p>
      )}

    </form>
  )
}
