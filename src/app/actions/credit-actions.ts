'use server'
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@datatypes.types";
import { create } from "domain";


interface CreditResponse{
    error:null | string,
    success : boolean,
    data: Tables<'credits'> | null,
}

// We need a Presigned URL to upload the file to Supabase Storage as client-side uploads are not allowed in Supabase Storage
// This function generates a signed URL for uploading files to the 'training-data' bucket in Supabase Storage.
export async function getCredits():Promise<CreditResponse>{

const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!);
    const {  data: { user }} = await supabase.auth.getUser();    
    
    
    const{data:creditsData , error} = await supabase.from('credits').select('*').eq('user_id' , user?.id).single();

    if(error){
        return{
            error: error?.message || null,
            success :false,
            data:null
        }
    }
    

    return {
        error: null,
        success :true,
        data: creditsData
    }

}

