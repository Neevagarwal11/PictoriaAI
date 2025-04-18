import Configuration from '@/components/Image Generation/Configuration'
import React from 'react'
import GeneratedImages from '@/app/(dashboard)/image-generation/generatedImages'

function ImageGenerationPage() {
  return (

    // <section className='container mx-auto grid gap-2 grid-col-2 overflow-hidden'>
    <section className=' flex flex-row gap-12 items-center justify-between'>
      <Configuration />
      <div className='col-span-2  w-2/5   mr-[10%] h-fit  p-4 rounded-xl flex items-center justify-center'>
        <GeneratedImages />
      </div>
    </section>
  )
}

export default ImageGenerationPage