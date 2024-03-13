import fs from 'fs'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
})

export const POST = async (req: any) => {
  const body = await req.json()

  const base64Audio = body.audio

  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, 'base64')

  // Define the file path for storing the temporary WAV file
  const filePath = 'input.wav'

  try {
    // Write the audio data to a temporary WAV file synchronously
    fs.writeFileSync(filePath, audio)

    // Create a readable stream from the temporary WAV file
    const readStream = fs.createReadStream(filePath)

    const data = await openai.audio.transcriptions.create({
      file: readStream,
      model: 'whisper-1', 
      language: "en"
    })

    // Remove the temporary file after successful processing
    fs.unlinkSync(filePath);

    return NextResponse.json(data.text)
  } catch (error: any) {
    console.error('Error processing audio:', error.error.message)
    return NextResponse.error()
  }
}
