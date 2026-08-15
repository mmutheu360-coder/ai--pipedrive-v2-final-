'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

const STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost']

export default function EditDealForm({
  dealId,
  initialTitle,
  initialCompany,
  initialValue,
  initialStage
}: {
  dealId: string
  initialTitle: string
  initialCompany: string
  initialValue: number
  initialStage: string
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [company, setCompany] = useState(initialCompany)
  const [value, setValue] = useState(String(initialValue))
  const [stage, setStage] = useState(initialStage)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setMessage('Saving...')
    try {
      const { error } = await supabase
        .from('deals')
        .update({
          title,
          company,
          value: Number(value),
          stage
        })
        .eq('id', dealId)

      if (error) {
        console.error('DEAL UPDATE ERROR:', error)
        setMessage(`Error: ${error.message}`)
        return
      }

      window.location.reload()

    } catch (err: any) {
      console.error('DEAL EDIT ERROR:', err)
      setMessage(`Error: ${err.message}`)
    }
  }

  const stageColor = (s: string) =>
    s === 'lead' ? 'bg-gray-200 text-gray-700'
    : s === 'qualified' ? 'bg-blue-100 text-blue-700'
    : s === 'proposal' ? 'bg-purple-100 text-purple-700'
    : s === 'negotiation' ? 'bg-orange-100 text-orange-700'
    : s === 'won' ? 'bg-green-100 text-green-700'
    : s === 'lost' ? 'bg-red-100 text-red-700'
    : 'bg-gray-200 text-gray-700'

  if (!editing) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          {title}{' '}
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 underline text-sm ml-2"
          >
            Edit
          </button>
        </h1>

        <p>
          {company} - ${value}
        </p>

        <span
          className={`text-sm px-2 py-1 rounded mt-2 inline-block ${stageColor(stage)}`}
        >
          {stage}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full font-bold text-xl"
        placeholder="Deal Title"
      />

      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border p-2 w-full"
        placeholder="Company"
      />

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 w-full"
        placeholder="Value"
      />

      <select
        value={stage}
        onChange={(e) => setStage(e.target.value)}
        className="border p-2 w-full"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="flex gap-3 items-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setEditing(false)}
          className="text-gray-600"
        >
          Cancel
        </button>
      </div>

      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  )
    }
