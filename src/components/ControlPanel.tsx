import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DotFilledIcon,
  ReloadIcon,
} from '@radix-ui/react-icons'
import * as Toolbar from '@radix-ui/react-toolbar'
import { Box } from '@radix-ui/themes'
import React from 'react'

// TODO: Type
const ControlPanel = ({
  onClickPreviousHandler,
  onClickNextHandler,
  onClickHandler,
  toggleRecording,
  isRecording,
}: {
  onClickPreviousHandler: any
  onClickNextHandler: any
  onClickHandler: any
  toggleRecording: any
  isRecording: any
}) => (
  <Toolbar.Root className="flex justify-between px-6 py-4 w-full min-w-max mt-4 rounded-xl bg-stone-800 border border-stone-400 shadow-md shadow-stone-800">
    <Box className='space-x-1'>
      <Toolbar.Button
        onClick={onClickPreviousHandler}
        className="flex-shrink-0 h-full flex-grow-0 basis-auto font-bold px-[5px] rounded inline-flex leading-none items-center justify-center bg-stone-700 border-stone-300 border text-red-300 outline-none"
      >
        <ArrowLeftIcon className="text-stone-50" />
      </Toolbar.Button>
      <Toolbar.Button
        onClick={onClickNextHandler}
        className="flex-shrink-0 h-full flex-grow-0 basis-auto font-bold px-[5px] rounded inline-flex leading-none items-center justify-center bg-stone-700 border-stone-300 border text-red-300 outline-none"
      >
        <ArrowRightIcon className="text-stone-50" />
      </Toolbar.Button>
      <Toolbar.Button
        onClick={onClickHandler}
        className="flex-shrink-0 h-full flex-grow-0 basis-auto font-bold px-[5px] rounded inline-flex leading-none items-center justify-center bg-stone-700 border-stone-300 border text-red-300 outline-none"
      >
        <ReloadIcon className="text-stone-50" />
      </Toolbar.Button>
    </Box>
    <Toolbar.Button
      onClick={toggleRecording}
      className="w-32 h-8 overflow-visible shadow-md shadow-stone-800 flex-shrink-0 flex-grow-0 basis-auto font-bold px-4 rounded inline-flex leading-none items-center justify-center bg-red-600 border border-red-300 text-red-300 outline-none"
    >
      {isRecording ? (
        'Recording...'
      ) : (
        <>
          <p>Record</p>
          <DotFilledIcon className="-ml-1 -mr-3" width={32} height={32} />
        </>
      )}
    </Toolbar.Button>
  </Toolbar.Root>
)

export default ControlPanel
