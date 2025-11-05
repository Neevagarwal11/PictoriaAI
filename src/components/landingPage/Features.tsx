import React from "react";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { ChevronRight, ImageIcon, Package2, Palette } from "lucide-react";
import dashboardImage from '@/public/dashboard-img.png'
import Image from "next/image";

function Features() {

    const featureList = [
        {
            title:"AI-Powered Photos",
            description:"Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.",
            icon: <ImageIcon className="w-6 h-6" strokeWidth={1.5}/>
        },
        {
            title:"Diverse Photo Packs at Your Fingertips",
            description:"Say goodbye to spending hours setting up shots. With over 60 percent photo packs, from classic corporate headshots to trendy street-style looks, you can capture any vibe with a single click.",
            icon: <Package2 className="w-6 h-6" strokeWidth={1.5}/>
        },
        {
            title:"Customizable Photo Generation",
            description:"Tailor each image to reflect your personal or brand style. By creating your own AI model, you can effortlessly fine-tune poses, expressions, and even background settings for a perfect visual representation that fits your unique aesthetic.",
            icon: <Palette className="w-6 h-6" strokeWidth={1.5}/>
        },
    ]


  return (
    <section
      id="features"
      className="w-full bg-muted py-32 flex flex-col items-center justify-center"
    >
      <div className="container px-6 xs:px-8 sm:px-0 sm:mx-8 grid-cols-1 lg:grid-cols-2 mx-auto grid gap-8 relative bg-muted">

        <div className="col-span-full space-y-8">
          {/* Animated Text */}
          <div className="group absolute mx-auto ml-0 bg-background backdrop-blur-0 flex items-center justify-center rounded-full px-4 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
              className={cn(
                "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <AnimatedGradientText className="text-sm font-medium">
              Features
            </AnimatedGradientText>
          </div>

          <h2 className="font-bold text-2xl xs:text-3xl sm:text-4xl">
            Unlock Unlimited Possibilities with Pictoria AI
          </h2>
          <p className="text-base text-muted-foreground lg:max-w-[75%]">
            Our platform offers a wide range of features designed to enhance
            your image creation experience. From easy-to-use editing tools to
            powerful AI-powered image generation, we have everything you need to
            bring your ideas to life.
          </p>
        </div>

{/* Features Lsit */}
        <div className="flex flex-col justify-start items-start order-2 lg:order-2">
              
            {
                featureList.map(feature => {
                    return <div key={feature.title} className="flex  items-start gap-2 sm:gap-4 rounded-lg py-8  lg:p-12">
                        <span className="sm:p-2 p-0  rounded-md text-foreground sm:text-background  bg-muted sm:bg-foreground">
                            {feature.icon}
                        </span>
                        <div>
                            <h3 className="text-xl sm:text-2xl  font-medium">{feature.title}</h3>
                            <p className="sx:text-base text-sm  text-muted-foreground pt-2">{feature.description}</p>
                        </div>
                    </div>
                })
            }
              
        </div>

            <div className={cn('h-fit lg:sticky order-2 lg:order-2 top-32 pl-16 pt-16 rounded-lg border border-r-gray-300 border-b-gray-300 animate-gradient bg-gradient-to-r from-[#627FAB] via-[#B95480] to-[#627FAB] bg-[length:var(--bg-size)_100%] [--bg-size:300%] ')}>
                <Image src={dashboardImage} alt="Features Image" className="w-full h-auto rounded-tl-lg" /> 
            </div>





      </div>
    </section>
  );
}

export default Features;
