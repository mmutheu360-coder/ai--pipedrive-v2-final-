import Link from 'next/link'
import { supabase } from '../lib/supabase'
import DealsList from './DealsList'

export const dynamic = 'force-dynamic'

export default async function DealsPage() {

  const {
    data: deals,
    error
  } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', {
      ascending: false
    })

  if (error) {
    console.error('DEALS LOAD ERROR:', error)

    return (
      <div className="p-6">
        <p className="text-red-600">
          Error loading deals: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        Fake CRM
      </h1>

      <Link
        href="/new"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + New Deal
      </Link>

      <div className="mt-6">
        <DealsList deals={deals ?? []} />
      </div>

    </div>
  )
}
