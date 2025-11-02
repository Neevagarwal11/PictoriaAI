'use client'
import { User } from '@supabase/supabase-js'
import React, { useId } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { resetPassword } from '@/app/actions/auth-actions'


interface SecuritySettingProps {
    user: User
}


function SecuritySetting({ user }: SecuritySettingProps) {


      const toastId = useId()
      
      async function handleChangePassword() {
    
        toast.loading("Sending Password Reset Email...", {id: toastId})
    
        try{
            const {success , error} = await resetPassword({email: user.email || ""});
            if(!success){
                toast.error(error + " Please try again later.", {id: toastId})
            }else{
                toast.success("Password Reset Email Sent! Please check your email for instructions", {id: toastId})
            }
        }catch (error) {
            toast.error("Error sending password reset email" , {id: toastId})
        }
    
    
      }



  return (
   <Card>
        <CardHeader>
            <CardTitle>Security</CardTitle>
        </CardHeader>
    
        <CardContent>
            <div className='space-y-2'>
                <h3 className='font-medium'>Password</h3>
                <p className='text-sm text-muted-foreground'>Change your password to keep your account secure.</p>
                <Button variant={'outline'} onClick={handleChangePassword}>Change Password</Button>
            </div>
        </CardContent>


    </Card>  )
}

export default SecuritySetting