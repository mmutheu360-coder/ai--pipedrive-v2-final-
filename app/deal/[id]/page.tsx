import { supabase } from '@/lib/supabase'

export default async function DealDetail({params}: {params: {id: string}}) {
  const { data: deal } = await supabase.from('deals').select('*, contacts(*)').eq('id', params.id).single()
  const { data: activities } = await supabase.from('activities').select('*').eq('deal_id', params.id)

  if(!deal) return <p>Deal not found</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{deal.title}</h1>
      <p>{deal.company} - ${deal.value}</p>
      <p className="mt-2">Contact: {deal.contacts?.name} - {deal.contacts?.email}</p>
      <p className="mt-4"><b>Notes:</b> {deal.notes || 'No notes yet'}</p>
      
      <h2 className="text-xl font-bold mt-6">Activities</h2>
      {activities?.length === 0 && <p>No activities yet</p>}
      {activities?.map(a => <div key={a.id} className="border p-2 mt-2 rounded">{a.type}: {a.description}</div>)}
    </div>
  )
}
