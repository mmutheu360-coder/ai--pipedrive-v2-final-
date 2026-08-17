import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, company, value, stage, notes, activities, contactName } = body

    const activitiesText = (activities || [])
      .map((a: any) => `- ${a.type}: ${a.description}`)
      .join('\n')

    const prompt = `Write a short, professional follow-up email to ${contactName || 'the client'} about this sales deal. Keep it 3-5 sentences, natural tone, no placeholders like [Your Name]. Just the email body, no subject line.

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

    const email =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Could not generate an email.'

    return NextResponse.json({ email })

  } catch (err: any) {
    console.error('WRITE-EMAIL ROUTE ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
  }
