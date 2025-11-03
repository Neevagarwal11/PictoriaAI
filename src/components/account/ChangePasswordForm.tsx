"use client";
import React, { useId, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { changePassword } from "@/app/actions/auth-actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter


const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_!#$%^&*?])[A-Za-z\d@_!#$%^&*?]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character

const formSchema = z.object({
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
  
});

function ChangePasswordForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const toastId = useId();
  const router = useRouter(); // Initialize useRouter

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Changing Password...", { id: toastId });
    setLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values.password + " New Password");
    try{
        const { success, error } = await changePassword(values.password);
        if (!success) {
        toast.error('error Sending Reset Password Email', { id: toastId });
        setLoading(false);
        } else {
        toast.success("Password Changed Successfully!", { id: toastId });
        setLoading(false);
        router.push('/login');
        }
    } catch (error :any) {
      toast.error(error?.message + "catch Block" || "An unexpected error occurred.", { id: toastId });
    }
    setLoading(false);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        password: "",
        confirmPassword: "",
    },
  });

  return (
    <div className={cn("grid gap-6", className)}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Change Password
        </h1>

        <p className="text-sm text-muted-foreground">
          Enter Your New Password Below to Change Your Password
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                    Enter a strong password which meets the requirements above. 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                    Re-enter the password to confirm.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full pt-4">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Changing Password..." : "Change Password"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Make sure to remember your new password!
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ChangePasswordForm;
