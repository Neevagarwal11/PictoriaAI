"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import useGeneratedStore from "@/store/useGeneratedStore";

const images = [
  {
    src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
    alt: "alt image",
  },
  {
    src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
    alt: "alt image",
  },
  {
    src: "/hero-images/Confident Woman in Red Outfit.jpeg",
    alt: "alt image",
  },
  {
    src: "/hero-images/Professional Business Portrait.jpeg",
    alt: "alt image",
  },
  {
    src: "/hero-images/Sophisticated Businessman Portrait.jpeg",
    alt: "alt image",
  },
];

function generatedImages() {
  const images = useGeneratedStore((state) => state.images);
  const loading = useGeneratedStore((state) => state.loading);

  if (images.length === 0) {
    return (
      <Card className="w-full max-w-2xl bg-muted">
        <CardContent className="flex aspect-square items-center jsutify-center p-6">
          <span className="text-2xl">No Images Generated</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative overflow-hidden rounded-lg flex items-center justify-center aspect-square">
              <Image
                src={image.url}
                alt={"Generated images using AI"}
                className="w-full h-full object-cover"
                fill
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default generatedImages;
