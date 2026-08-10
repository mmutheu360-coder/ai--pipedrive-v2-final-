import { supabase } from '../../../lib/supabase'
import ActivityForm from './ActivityForm'
import NotesEditor from './NotesEditor'

export const dynamic = 'force-dynamic'

export default async function DealDetail({
  params,
}: {
  params: { id: string }
}) {
  // Get the deal
  const {
    data: deal,
    error: dealError,
  } = await supabase
    .from('deals')
    .select('*, contacts(*)')
    .eq('id', params.id)
    .single()

  // Get activities
  const {
    data: activities,
    error: activitiesError,
  } = await supabase
    .from('activities')
    .select('*')
    .eq('deal_id', params.id)
    .order('created_at', { ascending: false })

  console.log('DEAL ID:', params.id)
  console.log('ACTIVITIES:', activities)
  console.log('ACTIVITIES ERROR:', activitiesError)

  if (dealError) {
    console.error('DEAL LOAD ERROR:', dealError)
    return (
      <div className="p-6">
        <p>Deal loading error:</p>
        <p>{dealError.message}</p>
      </div>
    )
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

      {/* SHOW QUERY ERROR IF THERE IS ONE */}
      {activitiesError && (
        <div className="mt-2 p-3 border border-red-400 rounded text-red-600">
          <p className="font-bold">
            Could not load activities
          </p>
          <p>
            {activitiesError.message}
          </p>
        </div>
      )}

      {/* SHOW ACTIVITIES */}
      {!activitiesError && activities?.length === 0 && (
        <p>No activities yet</p>
      )}

      {!activitiesError &&
        activities?.map((a) => (
          <div
            key={a.id}
            className="border p-2 mt-2 rounded"
          >
            <strong>{a.type}:</strong> {a.description}
          </div>
        ))}

      <ActivityForm dealId={deal.id} />

    </div>
  )
}
