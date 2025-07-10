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

    // <section className='container mx-auto grid gap-2 grid-col-2 overflow-hidden'>
    <section className=' flex flex-row gap-12 items-center justify-between'>
      <Configuration userModels = {userModels || []} model_id={model_id} />
      <div className='col-span-2  w-2/5   mr-[10%] h-fit  p-4 rounded-xl flex items-center justify-center'>
        <GeneratedImages />
      </div>
    </section>
  )
}

export default ImageGenerationPage