import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function DealsPage() {
  const { data: deals } = await supabase.from('deals').select('*').order('created_at', {ascending: false})

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Fake CRM</h1>
      <Link href="/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ New Deal</Link>
      
      <div className="mt-6 space-y-3">
        {deals?.length === 0 && <p>No deals yet. Click "New Deal" to add one.</p>}
        {deals?.map(deal => (
          <Link key={deal.id} href={`/deal/${deal.id}`} className="block border p-4 rounded hover:bg-gray-50">
            <div className="flex justify-between">
              <h2 className="font-bold">{deal.title}</h2>
              <span className="text-green-600">${deal.value}</span>
            </div>
            <p className="text-gray-600">{deal.company}</p>
            <span className="text-sm bg-gray-200 px-2 py-1 rounded mt-2 inline-block">{deal.stage}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
