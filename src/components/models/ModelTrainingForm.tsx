"use client";
import React, { useId } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getPresignedStorageUrl } from "@/app/actions/model-actions";

const ACCEPTED_FILE_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-zip",
  "application/octet-stream",
];
const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45 MB

const formSchema = z.object({
  modelName: z.string({
    required_error: "Model name is required",
  }),
  gender: z.enum(["man", "women"]),
  zipFile: z
    .any()
    .refine((files) => files?.[0] instanceof File, "Please select a valid file")
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only zip files are allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max File Allowed is 45MB"
    ),
});

function ModelTrainingForm() {


    const toastId = useId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      zipFile: undefined,
      gender: "man",
    },
  });
  const fileRef = form.register("zipFile")

  async function onSubmit(values: z.infer<typeof formSchema>) {

    toast.loading("Uploading File..." , {id: toastId})

    try{
        const data = await getPresignedStorageUrl(values.zipFile[0].name)
        console.log(data , "Data from Presigned URL: ");
        if(data.error){
            toast.error(data.error || "Failed to upload the file.")
        }else{
            
            
            const urlResponse = await fetch(data.signedUrl, {
                method:"PUT",
                headers:{
                    "Content-Type":values.zipFile[0].type
                },
                body: values.zipFile[0]
            })

            if(!urlResponse.ok){
                throw new Error('Upload Failed')
            }

            const res = await urlResponse.json()
            toast.success("File uploaded successfully!", {id: toastId}) 


            const formData = new FormData();
            formData.append('fileKey' , res.Key)
            formData.append('modelName' , values.modelName)
            formData.append('gender' , values.gender)

            toast.loading("Initiating model training....", {id:toastId})

            const response = await fetch('/api/train' , {
                method:"POST",
                body: formData,
            })
            const results = await response.json()

            if(!response.ok || results?.error){
                throw new Error(results?.error || "Failed to train the model.")
            }

            toast.success("Model training started successfully! You'll receive a notification once it's completed", {id: toastId})


            
        }

    }catch(error){
        const errorMessage = error instanceof Error? error.message: "Failed to start training."
        toast.error(errorMessage, {id: toastId , duration:5000})
    }


    console.log("Form Values: ", values);
  }

  return (
    <Form {...form}>
      <fieldset className="grid max-w-5xl bg-background p-8 rounded-lg gap-6 border">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* model name */}
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Model Name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the name of your trained model.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Please select the Gender of the images.</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col"
                  >
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="man" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="women" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Training Data (Zip File) |{" "}
                  <span className="text-destructive">
                    Read the requirements below
                  </span>{" "}
                </FormLabel>

                <div className="mb-4 rounded-lg shadow-sm pb-4 text-card-foreground">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Provide 10, 12 or 15 images in total</li>
                    <li>• Ideal breakdown for 12 images:</li>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>- 6 face closeups</li>
                      <li>- 3/4 half body closeups (till stomach)</li>
                      <li>- 2/3 full body shots</li>
                    </ul>
                    <li>• No accessories on face/head ideally</li>
                    <li>• No other people in images</li>
                    <li>• Different expressions, clothing, backgrounds with good lighting</li>
                    <li>• Images to be in 1:1 resolution (1048x1048 or higher)</li>
                    <li>• Use images of similar age group (ideally within past few months)</li>
                    <li>• Provide only zip file (under 45MB size)</li>
                  </ul>
                </div>

                <FormControl>
                  <Input type="file" accept=".zip" {...fileRef} onChange= { e => field.onChange(e.target.files)} />
                </FormControl>
                <FormDescription>
                  Upload a zip file containing the training images. Ensure the file size is under 45MB and the file type is zip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-fit">Submit</Button>
        </form>
      </fieldset>
    </Form>
  );
}

export default ModelTrainingForm;
