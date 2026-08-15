'use client'
import { useState } from 'react'

export default function AISummary({
  deal,
  activities
}: {
  deal: any
  activities: any[]
}) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    setLoading(true)
    setSummary('')

    try {
      const res = await fetch('/api/summarize', {
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
      setSummary(data.error ? `Error: ${data.error}` : data.summary)

    } catch (err: any) {
      setSummary(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
      >
        {loading ? 'Summarizing...' : '✨ Summarize with AI'}
      </button>

      {summary && (
        <p className="mt-2 text-sm bg-purple-50 p-3 rounded">
          {summary}
        </p>
      )}
    </div>
  )
}
