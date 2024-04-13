import { EnterFullScreenIcon } from '@radix-ui/react-icons'
import { Button, IconButton } from '@radix-ui/themes'
import Image from 'next/image'

const CurrentImage = ({
  currentPicture,
  pictureHistory,
  currentPosition,
  toggleFullscreen,
}: {
  currentPicture: string
  pictureHistory: string[]
  currentPosition: number
  toggleFullscreen: () => void
}) => {
  return currentPicture ? (
    <div className="relative">
      <Image
        className="h-full w-full inset-0 object-contain rounded-xl"
        src={pictureHistory[currentPosition]}
        // fill={true}
        width={128}
        height={128}
        alt="background-image"
      />
      {/* TODO: Fix cursor pointer */}
      <IconButton
        radius="full"
        className="!bg-stone-900/50 !text-stone-400 z-100 absolute right-3 bottom-3 cursor-pointer"
        onClick={toggleFullscreen}
      >
        <EnterFullScreenIcon />
      </IconButton>
    </div>
  ) : (
    <div>Please record audio to get started</div>
  )
}

export default CurrentImage
