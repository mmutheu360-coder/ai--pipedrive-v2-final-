import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, deals } = body

    const dealsList = (deals || [])
      .map((d: any) => `${d.id} | ${d.title} | ${d.company} | $${d.value} | ${d.stage}`)
      .join('\n')

    const prompt = `Here is a list of sales deals, one per line, format: id | title | company | value | stage

${dealsList}

The user's search request is: "${query}"

Return ONLY a JSON array of the matching deal ids, nothing else, no explanation, no markdown. Example: ["abc-123","def-456"]`

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

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

    // Strip markdown code fences if Gemini adds them anyway
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let ids: string[] = []
    try {
      ids = JSON.parse(text)
    } catch (parseErr) {
      console.error('AI SEARCH PARSE ERROR:', text)
    }

    return NextResponse.json({ ids })

  } catch (err: any) {
    console.error('AI-SEARCH ROUTE ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
