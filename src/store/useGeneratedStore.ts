import { create } from 'zustand'
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageGenerationFormSchema } from "@/components/Image Generation/Configuration";
import { z } from "zod";
import { generateImageAction, storeImages } from '@/app/actions/image-action';
import { toast } from 'sonner';


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

        const toastId = toast.loading("Generating Image...")

        try{
            const {error , success , data} =await generateImageAction(values)
            if(!success){
                set({error:error , loading:false})
                return
            }
            console.log(data , "useGeneratedStore.ts")

            const datawithUrl = data.map((url:string) => {
                return{
                    url,
                }
            })

            set({images:datawithUrl , loading:false})

            toast.success("Image Generated Successfully" , {id:toastId})
            
            await storeImages(datawithUrl)
            toast.success("Image Stored Successfully" , {id:toastId})

        }catch(error){
            console.error(error)
            set({error:"Failed to generate image" , loading:false})
        }
    }

}))


export default useGeneratedStore