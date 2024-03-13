import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

import { systemPrompt } from '@/app/data/constants'

const groq = new Groq({ apiKey: process.env.GROQ_KEY })

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  console.log("🚀 ~ POST ~ body:", body)

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: body.transcription,
      },
    ],
    model: 'mixtral-8x7b-32768',
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
  })

  console.log(
    '🚀 ~ POST ~ chatCompletion.choices[0].message.content:',
    chatCompletion.choices[0].message.content
  )

  return NextResponse.json({
    stableDiffusionPrompt: chatCompletion.choices[0].message.content,
  })
}
