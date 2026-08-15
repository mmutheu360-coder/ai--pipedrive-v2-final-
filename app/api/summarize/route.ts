import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, company, value, stage, notes, activities } = body

    const activitiesText = (activities || [])
      .map((a: any) => `- ${a.type}: ${a.description}`)
      .join('\n')

    const prompt = `Summarize this sales deal in 2-3 short sentences for a busy salesperson. Be direct and specific.

Deal: ${title}
Company: ${company}
Value: $${value}
Stage: ${stage}
Notes: ${notes || 'none'}
Activities:
${activitiesText || 'none'}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Could not generate summary.'

    return NextResponse.json({ summary })

  } catch (err: any) {
    console.error('SUMMARY ROUTE ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
