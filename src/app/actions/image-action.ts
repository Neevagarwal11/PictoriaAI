"use server";
import { z } from "zod";
import { ImageGenerationFormSchema } from "@/components/Image Generation/Configuration";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@datatypes.types";
import { imageMeta } from "image-meta";
import { randomUUID } from "crypto";
import { getCredits } from "./credit-actions";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput:false,
});

interface ImageResponse<T = unknown> {
  error: string | null;
  success: boolean;
  data: T | null;
}

// Ok Tested
export async function generateImageAction(
  input: z.infer<typeof ImageGenerationFormSchema>
): Promise<ImageResponse> {


    if(!process.env.REPLICATE_API_TOKEN){
      return{
        error:"The replicate api token is not set",
        success: false,
        data:null
      }
    }

    const {data: credits} = await getCredits();
    if(!credits?.image_generation_count || credits.image_generation_count <=0){
      return{
        error:"No credits available for image generation.",
        success: false,
        data:null
      }
    }


  const modelInput = input.model.startsWith("neevagarwal11/")?
  {
    model:'dev',
    lora_scale:1,
    extra_lora_scale:0,
    prompt: input.prompt,
    guidance: input.guidance,
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,
  }:
   {
    prompt: input.prompt,
    go_fast: true,
    guidance: input.guidance,
    megapixels: "1",
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,
  };

  try {
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input:modelInput,
    });
    console.log("Replicate output:", output); // Log the output for debugging OOOOKKKK

    return {
      error: null,
      success: true,
      data: output,
    };


  } catch (err: any) {
    return {
      error: err.message || "Failed to generate image",
      success: false,
      data: null,
    };
  }
}



type storeImageInput = {
  url: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"];

export async function imgUrlToBlob(url: string) {
  const response = fetch(url);
  const blob = (await response).blob();
  return (await blob).arrayBuffer();
}



    // Ok Tested - Bucket and Db tables getting the img dets.
export async function storeImages(data: storeImageInput[]) {
  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }

  const uploadResult = [];

  for(const img of data){

    const arrayBuffer = await imgUrlToBlob(img.url);
    const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer));
    
    const fileName = `image_${randomUUID()}.${type}`; //Used to name the image file that is to be saved in the storage bucket
    const filePath = `${user.id}/${fileName}`; //Path to save the image file
    

    //Storage in Bucket
    const { error: storageError } = await supabase.storage  //Stored in the storage bucket
    .from("generated-images")
    .upload(filePath, arrayBuffer, {
      contentType: `image/${type}`,
      cacheControl: "3600",
      upsert: true, //Not to upload duplicate file with same file name
    });
    
    if(storageError){
      uploadResult.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      });
      continue
    }
    

  //Storage in DB Table
  const { data: dbData, error: dbError } = await supabase.from("generated_images").insert([
      {
        user_id: user.id,
        model: img.model,
        prompt: img.prompt,
        aspect_ratio: img.aspect_ratio,
        guidance: img.guidance,
        num_inference_steps: img.num_inference_steps,
        output_format: img.output_format,
        image_name: fileName,
        width: width,
        height: height,
      },
    ]).select();  
    
    if(dbError){
      uploadResult.push({
        fileName,
        error: dbError.message,
        success: !dbError,
        data: dbData || null,
      });
    }
    
    uploadResult.push({
    fileName,
    error: null,
    success: true,
    data: dbData,
  });
  }

  
  console.log("(storeImageAction) Upload Result:", uploadResult);
  return {
    error: null,
    success: true,
    data: { results: uploadResult },
  };
}

export async function getImages(limit?: number) {
  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }

  let query = supabase
    .from("generated_images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return {
      error: error.message || "Failed to fetch images",
      success: false,
      data: null,
    };
  }

  const imagesWithUrls = await Promise.all(
    data.map(
      async (
        image: Database["public"]["Tables"]["generated_images"]["Row"]
      ) => {
        const { data } = await supabase.storage
          .from("generated-images")
          .createSignedUrl(`${user.id}/${image.image_name}`, 3600); //Used when the image is clicked to view in detail n 

        return {
          ...image,
          url: data?.signedUrl,
        };
      }
    )
  );

  return {
    error: null,
    success: true,
    data: { results: imagesWithUrls || null },
  };
}


export async function deleteImage(id : string , imageName:string) {
  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }
  const {data, error}  = await supabase.from("generated_images").delete().eq('id', id)
  if(error){
    return{
      error: error.message || "Failed to delete image",
      success: false,
      data: null,
    }
  }

  await supabase.storage.from('bucket').remove([`${user.id}/${imageName}`]);


return{
  error:null,
  success: true,
  data: data || null
}


}