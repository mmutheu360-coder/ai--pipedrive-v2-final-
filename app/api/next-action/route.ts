import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, company, value, stage, notes, activities } = body

    const activitiesText = (activities || [])
      .map((a: any) => `- ${a.type}: ${a.description}`)
      .join('\n')

    const prompt = `You are a sales assistant. Based on this deal's current stage and history, suggest the single next best action for the salesperson to take. Be specific and actionable, 1-2 sentences max.

Deal: ${title}
Company: ${company}
Value: $${value}
Stage: ${stage}
Notes: ${notes || 'none'}
Activities:
${activitiesText || 'none'}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const data = await response.json()

    if (data.error) {
      console.error('GEMINI ERROR:', data.error)
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const action =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Could not generate a suggestion.'

    return NextResponse.json({ action })

  } catch (err: any) {
    console.error('NEXT-ACTION ROUTE ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
