import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full bg-transparent backdrop-filter backdrop-blur-md">
      <nav className="flex justify-start items-center py-8 max-w-[1400px] w-full m-auto">
        <Image src="/seerstone-logo.png" height={28} width={28} alt="Company Logo"/>
        <h1 className="text-stone-50 text-2xl ml-2 font-serif tracking-widest font-bold">SeerStone</h1>
      </nav>
    </header>
  )
}

export default Header
