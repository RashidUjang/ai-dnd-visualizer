import Image from 'next/image'
import React from 'react'

type PropType = {
  selected: boolean
  onClick: () => void
  image: string
}

const ThumbnailCarouselButton: React.FC<PropType> = ({
  selected,
  onClick,
  image,
}: PropType) => {
  return (
    <div className="min-w-0 pl-3 grow-0 shrink-0">
      <button
        onClick={onClick}
        type="button"
        className="appearance-none flex no-underline cursor-pointer p-0 m-0 font-semibold items-center justify-center"
      >
        {/* TODO: Write a proper alt */}
        <Image className="rounded-xl" src={image} width={128} height={128} alt="image" />
      </button>
    </div>
  )
}

export default ThumbnailCarouselButton
