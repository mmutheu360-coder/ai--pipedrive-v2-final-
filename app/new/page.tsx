'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewDeal() {

  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'lead',
    contact: '',
    email: ''
  })

  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('Saving...')

    try {

      // 1. Create contact
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          name: form.contact,
          email: form.email
        })
        .select()
        .single()

      if (contactError) {
        console.error('CONTACT INSERT ERROR:', contactError)
        throw contactError
      }

      // 2. Create deal
      const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert({
          title: form.title,
          company: form.company,
          value: Number(form.value),
          stage: form.stage,
          contact_id: contact.id
        })
        .select()
        .single()

      if (dealError) {
        console.error('DEAL INSERT ERROR:', dealError)
        throw dealError
      }

      console.log('DEAL SAVED:', deal)

      setMessage('Deal saved successfully.')

      // Clear form
      setForm({
        title: '',
        company: '',
        value: '',
        stage: 'lead',
        contact: '',
        email: ''
      })

      // Give Supabase/Next a moment, then reload the deals page
      setTimeout(() => {
        window.location.href = '/'
      }, 500)

    } catch (err: any) {

      console.error('DEAL SAVE ERROR:', err)

      setMessage(`ERROR: ${err.message}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl mx-auto space-y-4"
    >

      <h1 className="text-2xl font-bold">
        Add New Deal
      </h1>

      <input
        required
        placeholder="Deal Title"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value
          })
        }
        className="border p-2 w-full"
      />

      <input
        required
        placeholder="Company"
        value={form.company}
        onChange={(e) =>
          setForm({
            ...form,
            company: e.target.value
          })
        }
        className="border p-2 w-full"
      />

      <input
        required
        placeholder="Value"
        type="number"
        value={form.value}
        onChange={(e) =>
          setForm({
            ...form,
            value: e.target.value
          })
        }
        className="border p-2 w-full"
      />

      <input
        required
        placeholder="Contact Name"
        value={form.contact}
        onChange={(e) =>
          setForm({
            ...form,
            contact: e.target.value
          })
        }
        className="border p-2 w-full"
      />

      <input
        required
        placeholder="Contact Email"
        type="email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value
          })
        }
        className="border p-2 w-full"
      />

      <select
        value={form.stage}
        onChange={(e) =>
          setForm({
            ...form,
            stage: e.target.value
          })
        }
        className="border p-2 w-full"
      >
        <option value="lead">lead</option>
        <option value="qualified">qualified</option>
        <option value="proposal">proposal</option>
        <option value="negotiation">negotiation</option>
        <option value="won">won</option>
        <option value="lost">lost</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save Deal
      </button>

      {message && (
        <p className="text-sm mt-2">
          {message}
        </p>
      )}

    </form>
  )
      }
