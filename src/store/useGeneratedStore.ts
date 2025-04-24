import { create } from 'zustand'
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageGenerationFormSchema } from "@/components/Image Generation/Configuration";
import { z } from "zod";
import { generateImageAction } from '@/app/actions/image-action';


interface GeneratedState {
    loading: boolean,
    images: Array<{url:string}>,
    error: string | null,
    generateImage: (values:z.infer<typeof ImageGenerationFormSchema>)=>Promise<void>
    // generateImage: () => void;

}

const useGeneratedStore = create<GeneratedState>((set) => ({
    loading: false,
    images:[],
    error: null,

    generateImage: async (values:z.infer<typeof ImageGenerationFormSchema>)=> {
        set({ loading: true, error: null });

        try{
            const {error , success , data} =await generateImageAction(values)
            if(!success){
                set({error:error , loading:false})
                return
            }

            set({images:data , loading:false})
        }catch(error){
            console.error(error)
            set({error:"Failed to generate image" , loading:false})
        }
    }

}))


export default useGeneratedStore