import { EnterFullScreenIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import Image from 'next/image'
import { RefObject } from 'react'

const FullScreenImage = ({
  isFullscreen,
  pictureHistory,
  previousPosition,
  currentPosition,
  toggleFullscreen,
  previousImageRef,
  currentImageRef,
}: {
  // TODO: Type this
  isFullscreen: boolean
  pictureHistory: string[]
  previousPosition: number
  currentPosition: number
  toggleFullscreen: () => void
  previousImageRef: RefObject<HTMLImageElement>
  currentImageRef: RefObject<HTMLImageElement>
}) => {
  return (
    isFullscreen && (
      <div
        className="fixed top-0 left-0 bg-black w-full h-full z-50 flex items-center justify-center"
        onClick={toggleFullscreen}
      >
        <Image
          src={pictureHistory[previousPosition]}
          ref={previousImageRef}
          className="absolute h-full w-full inset-0 object-contain bg-black"
          alt="fullscreen"
          width={128}
          height={128}
        />
        <Image
          src={pictureHistory[currentPosition]}
          ref={currentImageRef}
          className="absolute h-full w-full inset-0 object-contain bg-black"
          alt="fullscreen"
          width={128}
          height={128}
        />
      </div>
      // <div
      //   className="fixed flex-row top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50"
      //   onClick={toggleFullscreen}
      // >
      //   <div className="flex flex-row">
      //     <div>
      //       <h2>Previous Image</h2>
      //       <Image
      //         src={pictureHistory[previousPosition]}
      //         ref={previousImageRef}
      //         className="static h-full w-full inset-0"
      //         alt="fullscreen"
      //         width={100}
      //         height={100}
      //       />
      //     </div>
      //     <div>
      //       <h2>Current Image</h2>
      //       <Image
      //         src={pictureHistory[currentPosition]}
      //         ref={currentImageRef}
      //         className="static h-full w-full inset-0"
      //         alt="fullscreen"
      //         width={100}
      //         height={100}
      //       />
      //     </div>
      //   </div>
      // </div>
    )
  )
}

export default FullScreenImage
