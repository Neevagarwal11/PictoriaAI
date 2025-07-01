import { Tables } from '@datatypes.types'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'



interface ImageDialogProps{
  image: {url:string | undefined} & Tables<"generated_images">,
  onClose: () => void
}

function ImageDialog({image ,onClose} : ImageDialogProps) {
  return (
<Sheet open={true} onOpenChange={onClose}>
  <SheetContent className='max-w-full sm:max-w-xl w-full'>
    <SheetHeader>
      <SheetTitle className='text-2xl w-full'>Image Details</SheetTitle>

      <div className='relative w-fit h-fit'>
        <Image src= {image.url || ""} alt={image.prompt || ""} width={image.width || 0} height={image.height || 0} className="rounded w-full h-auto flex mb-3"></Image>

        <div className='flex gap-4 aboslute bottom-4 right-4'>
          <Button className='w-fit '>
            <Download className='w-4 h-4 mr-2'/>Download
          </Button>
          <Button className='w-fit' variant='destructive' >
            <Trash2 className='w-4 h-4'>Delete</Trash2>
          </Button>
        </div>
        
      </div>
      <hr className='inline-block w-full border-primary/30 mb-2' />


    <p className='text-primary/90 w-full flex flex-col'>
      <span className='text-primary text-xl font-semibold'>Prompt</span>
      {image.prompt}
    </p>
      <hr className='inline-block w-full border-primary/30 mb-2' />


    </SheetHeader>
  </SheetContent>
</Sheet>  )
}

export default ImageDialog