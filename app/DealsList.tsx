'use client'
import { useState } from 'react'
import Link from 'next/link'
const [aiQuery, setAiQuery] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiIds, setAiIds] = useState<string[] | null>(null)

const STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost']

const stageColor = (stage: string) =>
  stage === 'lead' ? 'bg-gray-200 text-gray-700'
  : stage === 'qualified' ? 'bg-blue-100 text-blue-700'
  : stage === 'proposal' ? 'bg-purple-100 text-purple-700'
  : stage === 'negotiation' ? 'bg-orange-100 text-orange-700'
  : stage === 'won' ? 'bg-green-100 text-green-700'
  : stage === 'lost' ? 'bg-red-100 text-red-700'
  : 'bg-gray-200 text-gray-700'

export default function DealsList({ deals }: { deals: any[] }) {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')

  const baseDeals = aiIds !== null
    ? deals.filter((d) => aiIds.includes(d.id))
    : deals

  const filtered = baseDeals.filter((deal) => {
    const matchesSearch =
      deal.title?.toLowerCase().includes(search.toLowerCase()) ||
      deal.company?.toLowerCase().includes(search.toLowerCase())

    const matchesStage =
      stageFilter === 'all' || deal.stage === stageFilter

    return matchesSearch && matchesStage
    const handleAiSearch = async () => {
    if (!aiQuery.trim()) {
      setAiIds(null)
      return
    }

    setAiLoading(true)

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery, deals })
      })

      const data = await res.json()
      setAiIds(data.ids || [])

    } catch (err) {
      console.error('AI SEARCH ERROR:', err)
      setAiIds([])
    } finally {
      setAiLoading(false)
    }
    }
  })

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          placeholder='Ask AI e.g. "big deals with Amazon"'
          className="border p-2 rounded flex-1"
        />

        <button
          onClick={handleAiSearch}
          disabled={aiLoading}
          className="bg-indigo-600 text-white px-3 py-2 rounded text-sm"
        >
          {aiLoading ? '...' : '🔍 AI Search'}
        </button>

        {aiIds !== null && (
          <button
            onClick={() => { setAiIds(null); setAiQuery('') }}
            className="text-sm text-gray-600 px-2"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or company..."
          className="border p-2 rounded flex-1"
        />

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">

        {filtered.length === 0 && (
          <p>No deals match your search/filter.</p>
        )}

        {filtered.map((deal) => (
          <Link
            key={deal.id}
            href={`/deal/${deal.id}`}
            className="block border p-4 rounded hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <h2 className="font-bold">{deal.title}</h2>
              <span className="text-green-600">${deal.value}</span>
            </div>

            <p className="text-gray-600">{deal.company}</p>

            <span
              className={`text-sm px-2 py-1 rounded mt-2 inline-block ${stageColor(deal.stage)}`}
            >
              {deal.stage}
            </span>
          </Link>
        ))}

      </div>

    </div>
  )
}
