'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewDeal() {
  const [form, setForm] = useState({title:'', company:'', value:0, stage:'Lead', contact:'', email:''})
  const router = useRouter()

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const { data: contact } = await supabase.from('contacts').insert({name: form.contact, email: form.email, company: form.company}).select().single()
    await supabase.from('deals').insert({title: form.title, company: form.company, value: form.value, stage: form.stage, contact_id: contact.id})
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Add New Deal</h1>
      <input required placeholder="Deal Title" onChange={e=>setForm({...form, title:e.target.value})} className="border p-2 w-full"/>
      <input required placeholder="Company" onChange={e=>setForm({...form, company:e.target.value})} className="border p-2 w-full"/>
      <input required placeholder="Value" type="number" onChange={e=>setForm({...form, value:+e.target.value})} className="border p-2 w-full"/>
      <input required placeholder="Contact Name" onChange={e=>setForm({...form, contact:e.target.value})} className="border p-2 w-full"/>
      <input required placeholder="Contact Email" type="email" onChange={e=>setForm({...form, email:e.target.value})} className="border p-2 w-full"/>
      <select onChange={e=>setForm({...form, stage:e.target.value})} className="border p-2 w-full">
        <option>Lead</option><option>Proposal</option><option>Negotiation</option><option>Won</option><option>Lost</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Save Deal</button>
    </form>
  )
}
