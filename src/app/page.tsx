'use client'

import * as fal from '@fal-ai/serverless-client'
import { EnterFullScreenIcon, PlayIcon, StopIcon } from '@radix-ui/react-icons'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  TextArea,
  TextField,
} from '@radix-ui/themes'
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import useRecordVoice from '@/hooks/useRecordVoice'
import { convertBlobToBase64 } from '@/utils/utils'

export default function Home() {
  const [currentPicture, setCurrentPicture] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [transcription, setTranscription] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const { isRecording, recording, startRecording, stopRecording } =
    useRecordVoice()
  const [pictureHistory, setPictureHistory] = useState<string[]>([])
  const [position, setPosition] = useState<number>(0)
  const [inferenceTime, setInferenceTime] = useState<number>(0)

  const hasPageBeenRendered = useRef({
    e1: false,
    e2: false,
    e3: false,
    e4: false,
  })

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen((previousValue) => !previousValue)
  }

  useHotkeys('p', () => {
    toggleRecording()
  })

  useHotkeys('f', () => {
    toggleFullscreen()
  })

  useHotkeys('g', () => {
    refreshImage()
  })

  useHotkeys('left', () => {
    onClickPreviousHandler()
  })

  useHotkeys('right', () => {
    onClickNextHandler()
  })

  useEffect(() => {
    const getData = async () => {
      if (recording.size === 0) {
        return
      }

      const blobBase64 = await convertBlobToBase64(recording)
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: JSON.stringify({ audio: blobBase64 }),
      })

      if (!response.ok) {
        return
      }

      const body = await response.json()

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

      setPrompt(promptBody.stableDiffusionPrompt)
    }

    if (hasPageBeenRendered.current['e2']) {
      getData()
    }

    hasPageBeenRendered.current['e2'] = true
  }, [transcription])

  useEffect(() => {
    if (hasPageBeenRendered.current['e3']) {
      generateImage()
    }

    hasPageBeenRendered.current['e3'] = true
  }, [prompt])

  useEffect(() => {
    if (hasPageBeenRendered.current['e4']) {
      setPictureHistory((prevArray) => {
        prevArray.push(currentPicture)
        setPosition(Math.max(prevArray.length - 1, 0))

        return [...prevArray]
      })
    }

    hasPageBeenRendered.current['e4'] = true
  }, [currentPicture])

  // TODO: Refactor to be an API
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
      setCurrentPicture(URL.createObjectURL(blob))
      setInferenceTime(result.timings.inference)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const generateImage = async () => {
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

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const refreshImage = () => {
    generateImage()
  }

  const onClickHandler = () => {
    generateImage()
  }

  const onClickPreviousHandler = () => {
    setPosition((previousPosition) => Math.max(previousPosition - 1, 0))
  }

  const onClickNextHandler = () => {
    setPosition((previousPosition) =>
      Math.min(previousPosition + 1, pictureHistory.length - 1)
    )
  }

  return (
    <Container>
      <Grid columns="2" gap="3">
        <Box>
          {/* TODO: Fix cursor pointer */}
          <Button
            variant="ghost"
            className="absolute top-0 left-0 z-100 cursor-pointer"
            onClick={toggleFullscreen}
          >
            <EnterFullScreenIcon />
          </Button>
          {isFullscreen && (
            <div
              className="fixed top-0 left-0 w-1/2 h-full bg-black bg-opacity-80 z-50 flex items-center justify-center"
              onClick={toggleFullscreen}
            >
              <Image
                src={pictureHistory[position]}
                className="object-fit"
                alt="fullscreen"
                fill={true}
              />
            </div>
          )}
          <div>
            {position}
            {currentPicture ? (
              <Image
                className="!static object-contain"
                src={pictureHistory[position]}
                fill={true}
                alt="background-image"
              />
            ) : (
              <div>Please record audio to get started</div>
            )}
            <Button onClick={onClickPreviousHandler}>Previous</Button>
            <Button onClick={onClickNextHandler}>Next</Button>
            <div>
              <p>Image History</p>
              <div className="flex flex-wrap">
                {pictureHistory.length > 0 &&
                  pictureHistory.map((picture) => {
                    return (
                      <Image
                        className="!static object-contain"
                        src={picture}
                        width={128}
                        height={128}
                        alt="background-image"
                      />
                    )
                  })}
              </div>
            </div>
          </div>
        </Box>
        <Box className="space-y-2">
          {process.env.NEXT_PUBLIC_DEBUG === 'true' && (
            <div>
              <p>Inference Time</p>
              <p>{inferenceTime * 1000}</p>
            </div>
          )}
          <TextArea
            value={prompt}
            onChange={onChangeHandler}
            placeholder="Current Prompt"
          />
          <Button onClick={onClickHandler}>Generate Image</Button>
          <TextArea readOnly value={transcription} />
          <Button
            onMouseDown={startRecording} // Start recording when mouse is pressed
            onMouseUp={stopRecording} // Stop recording when mouse is released
            onTouchStart={startRecording} // Start recording when touch begins on a touch device
            onTouchEnd={stopRecording} // Stop recording when touch ends on a touch device
          >
            {isRecording ? <StopIcon /> : <PlayIcon />}
          </Button>
        </Box>
      </Grid>
    </Container>
  )
}
