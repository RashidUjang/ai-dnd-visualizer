import * as fal from '@fal-ai/serverless-client'
import { useEffect, useRef, useState } from 'react'

const useFal = (onResultHandler: any) => {
  const [connection, setConnection] = useState<any>()
  const connectionRef = useRef<any>()

  fal.config({
    credentials: process.env.NEXT_PUBLIC_FAL_KEY,
  })

  useEffect(() => {
    const establishFalConnection = () => {
      return fal.realtime.connect('fal-ai/fast-lightning-sdxl', {
        connectionKey: 'lightning-sdxl',
        throttleInterval: 128,
        onResult: onResultHandler,
        onError: (error) => {
          console.error(error)
        },
      })
    }

    // Store the connection in the ref to maintain state between renders
    connectionRef.current = establishFalConnection()
    setConnection(connectionRef.current)

    // Return cleanup function
    return () => {
      // Close the connection stored in the ref
      connectionRef.current.close()
    }
  }, [])

  return { connection }
}

export default useFal
