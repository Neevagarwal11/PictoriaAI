import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";


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
        const {data: fileUrl } = await supabaseAdmin.storage.from("training-data").createSignedUrl(fileName , 3600)

        if(!fileUrl?.signedUrl){
            return NextResponse.json({error: "Failed to get file URL"}, {status:500});
        }
        console.log("File URL: ", fileUrl.signedUrl);




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