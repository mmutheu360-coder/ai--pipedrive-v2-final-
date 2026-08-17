'use client'
import { useState } from 'react'

export default function AINextAction({
  deal,
  activities
}: {
  deal: any
  activities: any[]
}) {
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSuggest = async () => {
    setLoading(true)
    setAction('')

    try {
      const res = await fetch('/api/next-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: deal.title,
          company: deal.company,
          value: deal.value,
          stage: deal.stage,
          notes: deal.notes,
          activities
        })
      })

      const data = await res.json()
      setAction(data.error ? `Error: ${data.error}` : data.action)

    } catch (err: any) {
      setAction(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleSuggest}
        disabled={loading}
        className="bg-teal-600 text-white px-3 py-1 rounded text-sm"
      >
        {loading ? 'Thinking...' : '👉 What should I do next?'}
      </button>

      {action && (
        <p className="mt-2 text-sm bg-teal-50 p-3 rounded">
          {action}
        </p>
      )}
    </div>
  )
}
