"use client"
import { User } from '@supabase/supabase-js'
import React, { useId } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { updateProfile } from '@/app/actions/auth-actions'

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email()
})

interface AccountFormProps {
    user: User
}

function AccountForm({ user }: AccountFormProps) {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
    },
  })



  // 2. Define a submit handler.

  const toastId = useId()
  
  async function onSubmit(values: z.infer<typeof formSchema>) {

    toast.loading("Updating Profile...", {id: toastId})

    try{
        const {success , error} = await updateProfile(values);
        if(!success){
            toast.error(error, {id: toastId})
        }else{
            toast.success("Profile Updated Successfully", {id: toastId})
        }
    }catch (error) {
        toast.error("An unexpected error occurred" , {id: toastId})
    }


  }

  return (
    <Card>
        <CardHeader>

            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>

        <CardContent>
             <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input  {...field}  disabled/>
              </FormControl>
              <FormDescription>
                Your email address is used for signin and communications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
        </CardContent>


    </Card>
  )
}



export default AccountForm