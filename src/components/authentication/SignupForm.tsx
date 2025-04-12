"use client";
import React, { useId, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signup } from "@/app/actions/auth-actions";
import { redirect } from "next/navigation";



const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_!#$%^&*?])[A-Za-z\d@_!#$%^&*?]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
const formSchema = z
  .object({
    full_name: z.string().min(3, {
      message: "Full name must be at least 3 characters long",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(passwordValidationRegex, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and a special character",
      }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  
  function SignupForm({ className }: { className?: string }) {


    const toastId = useId();



  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading('Siging Up...', {id:toastId})
    setLoading(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const formData = new FormData()
    formData.append('full_name' , values.full_name)
    formData.append('email' , values.email)
    formData.append('password' , values.password)

    const {success , error}  =await signup(formData)
    if(!success){
      toast.error(String(error) , {id:toastId})
      setLoading(false)
    }else{
      toast.success('Sign Up Success' , {id:toastId})
      setLoading(false)
      redirect('/login')
    }

    setLoading(false)
    console.log(values);
  }

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Full Name" {...field} />
                </FormControl>

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
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Your password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Your password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit" className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SignupForm;
