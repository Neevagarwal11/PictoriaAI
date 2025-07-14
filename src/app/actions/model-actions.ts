'use server'
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { create } from "domain";

// We need a Presigned URL to upload the file to Supabase Storage as client-side uploads are not allowed in Supabase Storage
// This function generates a signed URL for uploading files to the 'training-data' bucket in Supabase Storage.
export async function getPresignedStorageUrl(filePath: string){

const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!);
    const {  data: { user }} = await supabase.auth.getUser();    
    
    
    const{data:urlData , error} = await supabaseAdmin.storage.from('training-data').createSignedUploadUrl(`$user.id/${new Date().getTime()}_${filePath}`)
    
    return{
        signedUrl: urlData?.signedUrl || "",
        error : error?.message || null,

    }
}

export async function fetchModels(){
    
    const supabase = await createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );
    const{data : {user}} = await supabase.auth.getUser()

    const {data , error, count} = await supabase.from('models').select('*' , {count:"exact"}).eq('user_id'  , user?.id).order('created_at' , {ascending:false})

    // console.log("Fetched Model Data" , data)  OK

    return{
        error:error?.message,
        success: !error,
        data: data,
        count: count || 0,
    }


}


export async function deleteModel(id: number , model_id:string , model_version:string){
    const supabase = await createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );
    const{data : {user}} = await supabase.auth.getUser()

    if(model_version){
        try{
            const res = await fetch(`https://api.replicate.com/v1/models/neevagarwal11/${model_id}/versions/${model_version}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`
                }
            })

            if(!res.ok){
                throw new Error('Failed to delete model version from Replicate NO MODEL VERSION')
            }


        }catch(error){
            console.error('Failed to delete model version from Replicate. NO MODEL VERSION')

            return{
                error: "Failed to delete model version from Replicate.",
                success:false
            }

        }
    }

    if(model_id){
        try{
            const res = await fetch(`https://api.replicate.com/v1/models/neevagarwal11/${model_id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`
                }
            })

            if(!res.ok){
                throw new Error('Failed to delete model from Replicate MODEL ID')
            }


        }catch(error){
            console.error('Failed to delete model  from Replicate. MODEL ID')

            return{
                error: "Failed to delete model from Replicate.",
                success:false
            }

        }
    }
    
    const {error} = await supabase.from('models').delete().eq("id", id)

    return{
        error: error?.message || "Failed to delete model from database",
        success: !error,
    }

}