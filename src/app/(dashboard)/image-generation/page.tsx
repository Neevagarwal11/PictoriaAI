import Configuration from '@/components/Image Generation/Configuration'
import React from 'react'

function ImageGenerationPage() {
  return (

    <section className='container mx-auto grid gap-4 grid-col-3 overflow-hidden'>
      <Configuration />
      <div className='col-span-2 p-4 rounded-xl flex items-center justify-center'>
        Output Imgs
      </div>
    </section>
  )
}

export default ImageGenerationPage