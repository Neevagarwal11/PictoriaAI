import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";


const replicate = new Replicate({
    auth : process.env.REPLICATE_API_TOKEN!,
})

const WEBHOOK_URL = process.env.SITE_URL

export async function POST(request: NextRequest){
    try{
        if(!process.env.REPLICATE_API_TOKEN){
            throw new Error("REPLICATE_API_TOKEN is not set");
        }

        const supabase = await createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!
        );
        const {data : {user}}  = await supabase.auth.getUser();
        if(!user){
            return NextResponse.json({
                error: "Unauthorized"
            }, {status:401});
        }


        const formData = await request.formData()

        const input = {
            fileKey: formData.get("fileKey") as string,
            modelName : formData.get("modelName") as string,
            gender : formData.get("gender") as string,
        }

        console.log("Input Data: ", input);

        if(!input.fileKey  || !input.modelName){
            return NextResponse.json({error : "Missing required fields: fileKey or modelName"}, {status:400});
        }

        const fileName = input.fileKey.replace('training-data/' ,  "")
        const {data: fileUrl} = await supabaseAdmin.storage.from("training-data").createSignedUrl(fileName , 3600)

        if(!fileUrl?.signedUrl){
            return NextResponse.json({error: "Failed to get file URL"}, {status:500});
        }
        console.log("File URL: ", fileUrl.signedUrl);


        //Create Model

        // const hardware = await replicate.hardware.list()
        // console.log("Available Hardware: ", hardware);  

        const modelId = `${user.id}_${Date.now()}_${input.modelName.toLowerCase().replaceAll(" " , "_")}`

        
        await replicate.models.create("neevagarwal11" , modelId , { 
            visibility:"private",
            hardware: "gpu-a100-large",
        })

        //start training
   const training = await replicate.trainings.create(
  "ostris",
  "flux-dev-lora-trainer",
  "26dce37af90b9d997eeb970d92e47de3064d46c300504ae376c75bef6a9022d2",
  {
    // You need to create a model on Replicate that will be the destination for the trained version.
    destination: `neevagarwal11/${modelId}`,
    input: {
      steps: 1200,
      resolution: "1024",
      input_images: fileUrl.signedUrl,
      trigger_word: "ohwx",
    },
     webhook: `${WEBHOOK_URL}/api/webhooks/training`,
     webhook_events_filter: ["completed"], 
  }
);


//add model values in supabase
 await supabaseAdmin.from("models").insert({
    model_id:modelId,
    user_id:user.id,
    model_name: input.modelName,
    gender : input.gender,
    training_status: training.status,
    trigger_word: "ohwx",
    training_steps:1200,
    training_id: training.id
 })




// console.log(training)




        return NextResponse.json({
            success: true,
        }, {status: 201});



    }catch(error){
        console.log("Error in Model Training Route: ", error);

        const errorMessage = error instanceof Error ? error.message : "Failed to start model training";

        return NextResponse.json({
            error: errorMessage
        } , {status:500})
    }
}