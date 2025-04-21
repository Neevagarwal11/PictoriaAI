"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Slider } from "@/components/ui/slider";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { generateImageAction } from "@/app/actions/image-action";

/*
  prompt: "black forest gateau cake spelling out the words \"FLUX DEV\", tasty, food photography, dynamic shot",
  go_fast: true,
  guidance: 3.5,
  megapixels: "1",
  num_outputs: 1,
  aspect_ratio: "1:1",
  output_format: "webp",
  output_quality: 80,
  prompt_strength: 0.8,
  num_inference_steps: 28
*/

export const  ImageGenerationFormSchema = z.object({
  model: z.string({
    required_error: "Model is required",
  }),
  prompt: z.string({
    required_error: "Prompt is required",
  }),
  guidance: z.number({
    required_error: "Guidance is required",
  }),
  num_outputs: z
    .number()
    .min(1, { message: "At least 1 output is required" })
    .max(4, { message: "Maximum 4 outputs are allowed" }),
  aspect_ratio: z.string({
    required_error: "Aspect ratio is required",
  }),
  output_format: z.string({
    required_error: "Output format is required",
  }),
  output_quality: z
    .number()
    .min(1, { message: "Minimum quality is 1" })
    .max(100, { message: "Maximum quality is 100" }),
  num_inference_steps: z
    .number()
    .min(1, { message: "Minimum inference steps is 1" })
    .max(50, { message: "Maximum inference steps is 50" }),
});

function Configuration() {

  const form = useForm<z.infer<typeof ImageGenerationFormSchema>>({
    resolver: zodResolver(ImageGenerationFormSchema),
    defaultValues: {
      model: "black-forest-labs/flux-dev",
      prompt: "",
      guidance: 3.5,
      num_outputs: 1,
      output_format: "jpg",
      aspect_ratio: "1:1",
      output_quality: 80,
      num_inference_steps: 28,
    },
  });


  useEffect(()=>{
    const subscription = form.watch((value,{name})=>{
      if(name === "model"){
        let newSteps;

        if(value.model === "black-forest-labs/flux-schnell"){
          newSteps = 4;
      }else{
        newSteps = 28;
      }

      if(newSteps !== undefined){
        form.setValue("num_inference_steps", newSteps);
      }
    }

    })

    return ()=>subscription.unsubscribe();
  }, [form])



  async function onSubmit(values: z.infer<typeof ImageGenerationFormSchema>) {
  const {error , success, data } =   await generateImageAction(values);
    console.log(error, success, data);
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8  w-2/5 px-10"
        >
          <fieldset className=" grid gap-6 border-2 border-gray-200 p-4 rounded-lg">
            <legend className="text-sm -ml-1 px-1 font-medium">Settings</legend>

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Model
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You can select from the dropdown menu</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-dev">
                        Flux Dev
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        Flux Schnell
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspect Ratio
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Aspect Ratio for the Image to be Generated</p>
                      </TooltipContent>
                    </Tooltip>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="21:9">21:9</SelectItem>
                        <SelectItem value="9:21">9:21</SelectItem>
                        <SelectItem value="4:5">4:5</SelectItem>
                        <SelectItem value="5:4">5:4</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="2:3">2:3</SelectItem>
                        <SelectItem value="3:2">3:2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Outputs
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of Output Images to Generate</p>
                      </TooltipContent>
                    </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={1}
                        max={4}
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guidance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center  gap-2">Guidance
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Prompt Guidance for Generated Image</p>
                      </TooltipContent>
                    </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={10}
                      min={0}
                      step={0.5}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="num_inference_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">Number Of Inference Steps
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of Denoising Steps. Recommended range is 28-50 for dev model and 1-4 for Schnell model</p>
                      </TooltipContent>
                    </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={form.getValues('model')=== "black-forest-labs/flux-schnell" ? 4: 50 }
                      min={1}
                      
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="output_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">Output Quality
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quality when saving the ouput image from 0 to 100. 0 been the lowest and 100 been the best quality.</p>
                      </TooltipContent>
                    </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={100}
                      min={50}
                      step={2}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output Format
                  <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Format of the Output images.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the Output Format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-dev">
                        Webp
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        PNG
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        JPG
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propmt
                  <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-3"></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Prompt for the images.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <Textarea
                        placeholder="Enter your prompt"
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="font-medium">
              Generate
            </Button>
          </fieldset>
        </form>
      </Form>
    </TooltipProvider>
  );
}

export default Configuration;
