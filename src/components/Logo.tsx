import { Sparkles } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

function Logo() {
  return (
    <Link href="/" className='flex items-center gap-2'>
        <Sparkles className='size-10' strokeWidth={1.5} />
        <span className='font-semibold text-lg'>Pictoria AI</span>
    </Link>
  )
}

export default Logo