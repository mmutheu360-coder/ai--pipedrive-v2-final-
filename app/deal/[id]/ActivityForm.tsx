'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ActivityForm({ dealId }: { dealId: string }) {
  const [type, setType] = useState('call')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('activities').insert({
        deal_id: dealId,
        type,
        description
      })
      if (error) throw error
      setDescription('')
      router.refresh()
    } catch (err: any) {
      alert('Error adding activity: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded">
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
  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e) } }}
  className="border p-2 rounded w-full"
/>
    
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Activity</button>
    </form>
  )
}
