import React from 'react'
import AuthImg from '@/public/Abstract Curves and Colors.jpeg'
import Image from 'next/image' 
import Logo from '@/components/Logo'

function AuthenticationPage() {
  return (
    <main className='h-screen grid grid-cols-2 relatives '>
        <div className='relative w-full flex flex-col bg-muted p-10 text-primary-foreground'>
            <Image src ={AuthImg} alt="login img" className='w-full h-full object-cover'></Image>

            <div className='absolute z-20 flex items-center'>
            <Logo/>
            </div>
        </div>

        <div >
            Login form
        </div>
        
    </main>
  )
}

export default AuthenticationPage