'use client'

import * as fal from '@fal-ai/serverless-client'
import { SpeakerQuietIcon } from '@radix-ui/react-icons'
import { Button, TextField } from '@radix-ui/themes'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'

import useRecordVoice from '@/hooks/useRecordVoice'
import { convertBlobToBase64 } from '@/utils/utils'

export default function Home() {
  const [picture, setPicture] = useState<string>()
  const [prompt, setPrompt] = useState<string>()

  // Audio recorder
  const { isRecording, recording, startRecording, stopRecording } =
    useRecordVoice()

  const stopRecordingHandler = async () => {
    stopRecording()

    const blobBase64 = await convertBlobToBase64(recording)

    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      body: JSON.stringify({ audio: blobBase64 }),
    })

    console.log(response)
  }

  const stopRecordingHandler2 = async () => {
    stopRecording()

    const blobBase64 = await convertBlobToBase64(recording)

    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      body: JSON.stringify({ audio: blobBase64 }),
    })

    console.log(response)
  }

  fal.config({
    credentials: process.env.NEXT_PUBLIC_FAL_KEY,
  })

  const connection = fal.realtime.connect('fal-ai/fast-lightning-sdxl', {
    connectionKey: 'lightning-sdxl',
    // Debounce in ms
    throttleInterval: 128,
    onResult: (result) => {
      const blob = new Blob([result.images[0].content], {
        type: 'image/jpeg',
      })
      setPicture(URL.createObjectURL(blob))
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const onClickHandler = async () => {
    const input = {
      _force_msgpack: new Uint8Array([]),
      enable_safety_checker: true,
      image_size: 'square_hd',
      sync_mode: true,
      num_images: 1,
      num_inference_steps: '2',
      prompt: prompt,
    }

    connection.send(input)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* https://medium.com/@nazardubovyk/creating-voice-input-with-openai-api-and-next-js-14-ff398c60e5b4 */}
      <Image src={picture!} width={1024} height={1024} alt="background-image" />
      <TextField.Input
        value={prompt}
        onChange={onChangeHandler}
        placeholder="Enter your email"
      />
      <Button onClick={onClickHandler}>Test</Button>
      <Button
        onMouseDown={startRecording} // Start recording when mouse is pressed
        onMouseUp={stopRecordingHandler2} // Stop recording when mouse is released
        onTouchStart={startRecording} // Start recording when touch begins on a touch device
        onTouchEnd={stopRecordingHandler2} // Stop recording when touch ends on a touch device
      >
        {/* Microphone icon component */}
        <SpeakerQuietIcon />
      </Button>
      <audio controls src={URL.createObjectURL(recording)}></audio>
    </main>
  )
}
