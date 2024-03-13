import * as fal from '@fal-ai/serverless-client'
import { useEffect, useRef, useState } from 'react'

const useFal = (onResultHandler: any) => {
  // TODO: Correct typing
  const [connection, setConnection] = useState<any>()

  // Should this be in useEffect?
  fal.config({
    credentials: process.env.NEXT_PUBLIC_FAL_KEY,
  })

  useEffect(() => {
    const establishFalConnection = () => {
      return fal.realtime.connect('fal-ai/fast-lightning-sdxl', {
        connectionKey: 'lightning-sdxl',
        // Debounce in ms
        throttleInterval: 128,
        onResult: onResultHandler,
        onError: (error) => {
          console.error(error)
        },
      })
    }

    setConnection(establishFalConnection())

    return () => {
      connection.close()
    }
  }, [])

  return { connection }
}

export default useFal
