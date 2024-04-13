import ThumbnailCarouselButton from './ThumbnailCarouselButton'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
}

const ThumbnailCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    loop: false,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect)
    emblaMainApi.on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="max-w-3xl m-auto">
      <div className="mt-3">
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex flex-row items-start -ml-3">
            {slides.map((value, index) => (
              <ThumbnailCarouselButton
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                image={value}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThumbnailCarousel
