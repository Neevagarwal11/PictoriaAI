'use server'
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";
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