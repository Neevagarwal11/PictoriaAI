import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CreditCard, LayersIcon, Wand2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

function QuickActions() {
  return (

    
    <Card>

            <CardHeader >
                <CardTitle>
                    Quick Actions
                </CardTitle>
                <CardDescription>Get Started with common actions</CardDescription>
            </CardHeader>

            <CardContent className='grid gap-4'>
                <Button asChild className='w-full'>
                    <Link href = "/image-generation">
                        <Wand2Icon className='mr-2 h-4 w-4' /> Generate Image
                    </Link>
                </Button>

                <Button asChild className='w-full' variant="secondary">
                    <Link href = "/model-training">
                        <Wand2Icon className='mr-2 h-4 w-4' /> Train New Model
                    </Link>
                </Button>

                <Button asChild variant="secondary" className='w-full'>
                    <Link href = "/billing">
                        <CreditCard className='mr-2 h-4 w-4' /> Billing
                    </Link>
                </Button>

            </CardContent>

        </Card>
  )
}

export default QuickActions