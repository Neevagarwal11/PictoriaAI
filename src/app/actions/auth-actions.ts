'use server'

import { createClient } from "@supabase/supabase-js";

interface Authresponse {
    error: null | string,
    success: boolean,
    data: unknown |null;
}

export async function signup(formData: FormData): Promise<Authresponse>{
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options:{
            data:{
                full_name: formData.get('full_name') as string,
            }
        }
    }

        const {data : signupdata, error } = await supabase.auth.signUp(data)

        return{
            error: error?.message || "Error Sigining Up",
            success: !error,
            data: signupdata || null
        }


}


export async function login(formData: FormData): Promise<Authresponse>{
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

        const {data : signindata, error } = await supabase.auth.signInWithPassword(data)

        return{
            error: error?.message || "Error Loggin In",
            success: !error,
            data: signindata || null
        }


}