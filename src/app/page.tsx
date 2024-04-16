'use client'

import {
  Box,
  Container,
  Grid,
  Heading,
  Spinner,
  Text,
  TextArea,
} from '@radix-ui/themes'
import anime from 'animejs'
import { EmblaOptionsType } from 'embla-carousel'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { useHotkeys } from 'react-hotkeys-hook'

import ControlPanel from '@/components/ControlPanel'
import CurrentImage from '@/components/CurrentImage'
import FullScreenImage from '@/components/FullScreenImage'
import KeyBindingSection from '@/components/KeyBindingSection'
import PopupContent from '@/components/PopupContent'
import ThumbnailCarousel from '@/components/ThumbnailCarousel'
import useFal from '@/hooks/useFal'
import useRecordVoice from '@/hooks/useRecordVoice'
import { convertBlobToBase64 } from '@/utils/utils'

export default function Home() {
  const options: EmblaOptionsType = {}

  const [currentPicture, setCurrentPicture] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [isPrompting, setIsPrompting] = useState<boolean>(false)
  const [transcription, setTranscription] = useState<string>('')
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const { isRecording, recording, startRecording, stopRecording } =
    useRecordVoice()
  const [pictureHistory, setPictureHistory] = useState<string[]>([])
  const [currentPosition, setCurrentPosition] = useState<number>(0)
  const [previousPosition, setPreviousPosition] = useState<number>(0)
  const [inferenceTime, setInferenceTime] = useState<number>(0)
  const [isEditingTranscription, setIsEditingTranscription] =
    useState<boolean>(false)

  const currentImageRef = useRef<HTMLImageElement>(null)
  const previousImageRef = useRef<HTMLImageElement>(null)

  const openPopup = () => {
    const html = renderToString(<PopupContent />)

    // Open a new window
    const popupWindow = window.open('', 'Popup', 'width=400,height=300')

    // Write content to the popup
    popupWindow!.document.write(html)
  }

  // TODO: Correct typing
  const handlePicture = (result: any) => {
    const blob = new Blob([result.images[0].content], {
      type: 'image/jpeg',
    })
    setCurrentPicture(URL.createObjectURL(blob))
    setInferenceTime(result.timings.inference)
  }
  const { connection } = useFal(handlePicture)

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

  const toggleEditingTranscription = () => {
    setIsEditingTranscription((previousValue) => !previousValue)
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
      setIsTranscribing(true)

      const blobBase64 = await convertBlobToBase64(recording)
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: JSON.stringify({ audio: blobBase64 }),
      })

      console.log('whut')

      if (!response.ok) {
        return
      }

      const body = await response.json()

      setTranscription(body)
      setIsTranscribing(false)
    }

    getData()
  }, [recording])

  useEffect(() => {
    const getData = async () => {
      setIsPrompting(true)
      const generatedPrompt = await fetch('/api/generate-prompt', {
        method: 'POST',
        body: JSON.stringify({ transcription }),
      })

      const promptBody = await generatedPrompt.json()

      setPrompt(promptBody.stableDiffusionPrompt)
      setIsPrompting(false)
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
        setPreviousPosition(currentPosition)
        setCurrentPosition(Math.max(prevArray.length - 1, 0))

        return [...prevArray]
      })
    }

    hasPageBeenRendered.current['e4'] = true
  }, [currentPicture])

  useEffect(() => {
    if (currentImageRef?.current) {
      ;(currentImageRef as any).current.style.opacity = 0
    }

    anime({
      targets: currentImageRef.current,
      opacity: 1,
      duration: 1000,
      autoplay: true,
      easing: 'linear',
    })

    anime({
      targets: previousImageRef.current,
      opacity: 0,
      duration: 1000,
      easing: 'linear',
      autoplay: true,
      complete: () => {
        // Snap opacity back to 1 once the animation is complete
        if (previousImageRef?.current) {
          ;(previousImageRef as any).current.style.opacity = 1
        }
      },
    })
  }, [currentPosition])

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
    setPreviousPosition(currentPosition)
    setCurrentPosition((previousPosition) => Math.max(previousPosition - 1, 0))
  }

  const onClickNextHandler = () => {
    setPreviousPosition(currentPosition)
    setCurrentPosition((previousPosition) =>
      Math.min(previousPosition + 1, pictureHistory.length - 1)
    )
  }

  return (
    <Container pt="9" mt="9">
      <Grid columns="2" gap="3">
        <Box>
          <FullScreenImage
            isFullscreen={isFullscreen}
            pictureHistory={pictureHistory}
            previousPosition={previousPosition}
            currentPosition={currentPosition}
            toggleFullscreen={toggleFullscreen}
            previousImageRef={previousImageRef}
            currentImageRef={currentImageRef}
          />
          <div>
            <p className="text-stone-50 font-black mb-1">{`${currentPosition + 1}/${pictureHistory.length}`}</p>
            <CurrentImage
              currentPicture={currentPicture}
              pictureHistory={pictureHistory}
              currentPosition={currentPosition}
              toggleFullscreen={toggleFullscreen}
            />
            <div>
              <ThumbnailCarousel options={options} slides={pictureHistory} />
            </div>
          </div>
        </Box>
        <Box>
          <Box>
            <Heading
              as="h2"
              size="7"
              className="text-stone-300 !font-serif !tracking-wider"
            >
              Key Bindings
            </Heading>
            <Box mt="1" p="5" className="text-stone-50 rounded-xl bg-stone-800">
              <KeyBindingSection />
            </Box>
          </Box>
          <Box className="mt-4">
            <Heading
              as="h2"
              size="7"
              className="!font-serif !tracking-wider text-stone-300"
            >
              Picture Information
            </Heading>
            <Box
              mt="1"
              p="5"
              className="text-stone-50 rounded-xl bg-stone-800 space-y-3"
            >
              <Box className="space-y-1">
                <Box className="flex flex-row items-center">
                  <Text mr="2" as="label" className="font-black text-stone-300">
                    Transcription
                  </Text>
                  {isTranscribing && <Spinner />}
                </Box>
                {isEditingTranscription ? (
                  <TextArea readOnly value={transcription} />
                ) : (
                  <Text
                    as="label"
                    className="block italic text-sm text-stone-50"
                  >
                    {transcription ? `"${transcription}"` : '-'}
                  </Text>
                )}
              </Box>
              <Box className="space-y-1">
                <Box className="flex flex-row items-center">
                  <Text mr="2" as="label" className="font-black text-stone-300">
                    Prompt
                  </Text>
                  {isPrompting && <Spinner />}
                </Box>
                {isEditingTranscription ? (
                  <TextArea
                    value={prompt}
                    onChange={onChangeHandler}
                    placeholder="Current Prompt"
                  />
                ) : (
                  <Text
                    as="label"
                    className="!line-clamp-4 block text-sm text-stone-50"
                  >
                    {prompt ? prompt : '-'}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
          <ControlPanel
            onClickPreviousHandler={onClickPreviousHandler}
            onClickNextHandler={onClickNextHandler}
            onClickHandler={onClickHandler}
            toggleRecording={toggleRecording}
            isRecording={isRecording}
          />
        </Box>
      </Grid>
      {process.env.NEXT_PUBLIC_DEBUG === 'true' && (
        <div>
          <p>Inference Time</p>
          <p>{inferenceTime * 1000}</p>
        </div>
      )}
    </Container>
  )
}
