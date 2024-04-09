import { EnterFullScreenIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import Image from 'next/image'

const CurrentImage = ({
  currentPicture,
  pictureHistory,
  currentPosition,
  toggleFullscreen,
}: {
  // TODO: Type this
  currentPicture: string
  pictureHistory: string[]
  currentPosition: number
  toggleFullscreen: () => void
}) => {
  return currentPicture ? (
    <div>
      <Image
        className="static h-full w-full inset-0 object-contain"
        src={pictureHistory[currentPosition]}
        // fill={true}
        width={128}
        height={128}
        alt="background-image"
      />
      {/* TODO: Fix cursor pointer */}
      <Button
        variant="ghost"
        className="z-100 cursor-pointer"
        onClick={toggleFullscreen}
      >
        <EnterFullScreenIcon />
      </Button>
    </div>
  ) : (
    <div>Please record audio to get started</div>
  )
}

export default CurrentImage
