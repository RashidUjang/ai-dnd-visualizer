'use client'

import * as fal from '@fal-ai/serverless-client'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'
import { Button, TextField } from '@radix-ui/themes'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'

import useRecordVoice from '@/hooks/useRecordVoice'
import { convertBlobToBase64 } from '@/utils/utils'

export default function Home() {
  const [picture, setPicture] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [transcription, setTranscription] = useState<string>('')
  const { isRecording, recording, startRecording, stopRecording } =
    useRecordVoice()

  useEffect(() => {
    const getData = async () => {
      const blobBase64 = await convertBlobToBase64(recording)

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: JSON.stringify({ audio: blobBase64 }),
      })
      const body = await response.json()

      console.log('transcription of speech done. the user said: ', body)

      setTranscription(body)
    }

    getData()
  }, [recording])

  useEffect(() => {
    const getData = async () => {
      const generatedPrompt = await fetch('/api/text-to-prompt', {
        method: 'POST',
        body: JSON.stringify({ transcription }),
      })

      const promptBody = await generatedPrompt.json()

      console.log(
        'generation of prompt is done, the prompt is: ',
        promptBody.stableDiffusionPrompt
      )

      setPrompt(promptBody.stableDiffusionPrompt)
    }

    getData()
  }, [transcription])

  useEffect(() => {
    onClickHandler()
  }, [prompt])

  const stopRecordingHandler = async () => {
    stopRecording()
    // console.log('🚀 ~ stopRecordingHandler ~ recording:', recording)

    // const blobBase64 = await convertBlobToBase64(recording)

    // const response = await fetch('/api/speech-to-text', {
    //   method: 'POST',
    //   body: JSON.stringify({ audio: blobBase64 }),
    // })
    // const body = await response.json()

    // setTranscription(body)

    // const generatedPrompt = await fetch('/api/text-to-prompt', {
    //   method: 'POST',
    //   body: JSON.stringify({ transcription }),
    // })

    // const promptBody = await generatedPrompt.json()

    // setPrompt(promptBody.stableDiffusionPrompt)

    // onClickHandler()
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
    <main className="flex h-screen items-center justify-between p-24">
      {/* https://medium.com/@nazardubovyk/creating-voice-input-with-openai-api-and-next-js-14-ff398c60e5b4 */}
      <div>
        {picture ? (
          <Image
            src={picture}
            width={800}
            height={800}
            alt="background-image"
          />
        ) : (
          <div>Please record audio to get started</div>
        )}
      </div>
      <div className="space-y-2">
        <TextField.Input
          value={prompt}
          onChange={onChangeHandler}
          placeholder="Current Prompt"
        />
        <Button onClick={onClickHandler}>Test</Button>
        <TextField.Input value={transcription} />
        <Button
          onMouseDown={startRecording} // Start recording when mouse is pressed
          onMouseUp={stopRecordingHandler} // Stop recording when mouse is released
          onTouchStart={startRecording} // Start recording when touch begins on a touch device
          onTouchEnd={stopRecordingHandler} // Stop recording when touch ends on a touch device
        >
          {isRecording ? <StopIcon /> : <PlayIcon />}
        </Button>
        <audio controls src={URL.createObjectURL(recording)}></audio>
      </div>
    </main>
  )
}
