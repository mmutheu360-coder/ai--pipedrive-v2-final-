'use client'
import { useState } from 'react'

export default function AIEmailWriter({
  deal,
  activities
}: {
  deal: any
  activities: any[]
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleWrite = async () => {
    setLoading(true)
    setEmail('')
    setCopied(false)

    try {
      const res = await fetch('/api/write-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: deal.title,
          company: deal.company,
          value: deal.value,
          stage: deal.stage,
          notes: deal.notes,
          activities,
          contactName: deal.contacts?.name
        })
      })

      const data = await res.json()
      setEmail(data.error ? `Error: ${data.error}` : data.email)

    } catch (err: any) {
      setEmail(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleWrite}
        disabled={loading}
        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
      >
        {loading ? 'Writing...' : '✉️ Draft follow-up email'}
      </button>

      {email && (
        <div className="mt-2 bg-indigo-50 p-3 rounded">
          <p className="text-sm whitespace-pre-wrap">{email}</p>

          <button
            onClick={handleCopy}
            className="mt-2 text-xs text-indigo-700 underline"
          >
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
        </div>
      )}
    </div>
  )
}
