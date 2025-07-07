import { Database } from '@datatypes.types'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'



type ModelType = {
    error: string | null,
    success: boolean,
    data: Database["public"]["Tables"]["models"]["Row"][] | []
}


interface ModelsListProps{
    models: ModelType
}


function ModelsList({models} : ModelsListProps) {

    const{data , success , error} = models;
    console.log("Model Data"  , data)

    if(data == null){
        return (
            <Card className='flex h-[450px] flex-col items-center justify-center text-center'>
                <CardHeader>
                    <CardTitle>
                        No Models Found...
                    </CardTitle>
                    <CardDescription>
                        You have not trained any models yet. Start by creating a new model.
                    </CardDescription>
                    <Link href="/model-training" className='inline-block pt-2'>
                        <Button className='w-fit'>
                            Create Model
                        </Button>
                    </Link>
                </CardHeader>
            </Card>
        )
    }


  return (
    <div>ModelsList</div>
  )
}

export default ModelsList