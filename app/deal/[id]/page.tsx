import EditDealForm from './EditDealForm'
  import { supabase } from '../../../lib/supabase'
import ActivityForm from './ActivityForm'
import NotesEditor from './NotesEditor'

export const dynamic = 'force-dynamic'

export default async function DealDetail({
  params
}: {
  params: { id: string }
}) {

  const { data: deal, error: dealError } = await supabase
    .from('deals')
    .select('*, contacts(*)')
    .eq('id', params.id)
    .single()

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select('*')
    .eq('deal_id', params.id)
    .order('created_at', { ascending: false })

  if (dealError) {
    console.error('DEAL LOAD ERROR:', dealError)
  }

  if (activityError) {
    console.error('ACTIVITY LOAD ERROR:', activityError)
  }

  if (!deal) {
    return <p>Deal not found</p>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold">
        {deal.title}
      </h1>

      <p>
        {deal.company} - ${deal.value}
      </p>

      <p className="mt-2">
        Contact: {deal.contacts?.name} - {deal.contacts?.email}
      </p>

      <span
        className={`text-sm px-2 py-1 rounded mt-2 inline-block ${
          deal.stage === 'lead'
            ? 'bg-gray-200 text-gray-700'
            : deal.stage === 'qualified'
            ? 'bg-blue-100 text-blue-700'
            : deal.stage === 'proposal'
            ? 'bg-purple-100 text-purple-700'
            : deal.stage === 'negotiation'
            ? 'bg-orange-100 text-orange-700'
            : deal.stage === 'won'
            ? 'bg-green-100 text-green-700'
            : deal.stage === 'lost'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        {deal.stage}
      </span>

      <NotesEditor
        dealId={deal.id}
        initialNotes={deal.notes}
      />

      <h2 className="text-xl font-bold mt-6">
        Activities
      </h2>

      {activityError && (
        <p className="text-red-600 mt-2">
          Could not load activities: {activityError.message}
        </p>
      )}

      {!activityError && activities?.length === 0 && (
        <p>No activities yet</p>
      )}

      {activities?.map((activity) => (
        <div
          key={activity.id}
          className="border p-2 mt-2 rounded"
        >
          <strong>{activity.type}:</strong>{' '}
          {activity.description}
        </div>
      ))}

      <ActivityForm dealId={deal.id} />

    </div>
  )
}
