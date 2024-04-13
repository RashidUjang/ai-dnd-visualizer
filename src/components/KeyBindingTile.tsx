type PropType = {
  tile: string
  tileDescription: string
}

const KeyBindingTile = ({ tile, tileDescription }: PropType) => {
  return (
    <li className="flex items-center py-1">
      <kbd className="shadow-2xl flex items-center justify-center font-black text-[0.75rem] border text-stone-300 bg-stone-700 border-stone-300 px-2 py-[2px] rounded-md">
        {tile}
      </kbd>
      <span className="ml-2">{tileDescription}</span>
    </li>
  )
}

export default KeyBindingTile
