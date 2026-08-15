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

      <EditDealForm
        dealId={deal.id}
        initialTitle={deal.title}
        initialCompany={deal.company}
        initialValue={deal.value}
        initialStage={deal.stage}
      />

      <p className="mt-2">
        Contact: {deal.contacts?.name} - {deal.contacts?.email}
      </p>

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
