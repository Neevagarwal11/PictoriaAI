'use server'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageGenerationFormSchema } from "@/components/Image Generation/Configuration";
import Replicate from "replicate";


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

interface ImageResponse {
    error:string |null;
    success:boolean;
    data:unknown | null
}

export async function generateImageAction(values: z.infer<typeof ImageGenerationFormSchema>){

} 