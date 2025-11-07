import Configuration from '@/components/Image Generation/Configuration'
import React from 'react'
import GeneratedImages from '@/app/(dashboard)/image-generation/generatedImages'
import { fetchModels } from '@/app/actions/model-actions';

interface searchParams{
  model_id?:string
}

async function ImageGenerationPage({searchParams} : {searchParams:Promise<searchParams>}) {

  const model_id = (await searchParams).model_id;
  const {data: userModels} = await fetchModels()


  return (

    // <section className='container mx-auto grid gap-2 grid-cols-3 overflow-hidden'>
    <section className=' flex flex-col lg:flex-row lg:h-screen lg:gap-1 lg:px-8 md:gap-2 items-center justify-between'> 
      <Configuration userModels = {userModels || []} model_id={model_id || ""} />
      <div className='col-span-2 sm:w-full md:w-full sm:justify-center lg:w-full  h-fit  p-4 rounded-xl flex items-center justify-center'>
        <GeneratedImages />
      </div>
    </section>
  )
}

export default ImageGenerationPage