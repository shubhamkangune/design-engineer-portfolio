"use client";

import * as React from "react";
import Image from "next/image";
import { Box } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PracticeModel {
  id: string;
  name: string;
  images: string[]; // Array of image URLs or base64 strings
  viewer?: string;
  download?: string;
  tools?: string[];
  order?: number;
  description?: string;
}

// Blur placeholder for loading state
const shimmer = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="224" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="224" fill="#e5e7eb"/></svg>`
).toString("base64")}`;

export default function PracticeCard({
  model,
  priority = false,
}: {
  model: PracticeModel;
  priority?: boolean;
}) {
  // Use first image for card thumbnail
  const firstImage = model.images && model.images.length > 0 ? model.images[0] : "/projects/practice/placeholder.png";
  const isBase64 = firstImage?.startsWith("data:");
  const hasMultipleImages = model.images && model.images.length > 1;

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50 relative">
      {/* Image (click opens preview dialog) */}
      <div className="h-56 overflow-hidden relative bg-secondary">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full h-full relative">
              {isBase64 ? (
                <img
                  src={firstImage}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading={priority ? "eager" : "lazy"}
                />
              ) : (
                <Image
                  src={firstImage}
                  alt={model.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  placeholder="blur"
                  blurDataURL={shimmer}
                  priority={priority}
                />
              )}
              
              {/* Image count indicator */}
              {hasMultipleImages && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {model.images.length} images
                </div>
              )}
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl">
            <DialogTitle>{model.name}</DialogTitle>
            <DialogDescription className="mb-4">
              Practice CAD Model
              {model.tools && model.tools.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {model.tools.map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              )}
            </DialogDescription>

            {/* Image carousel or single image */}
            {hasMultipleImages ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {model.images.map((img, index) => {
                    const imgIsBase64 = img?.startsWith("data:");
                    return (
                      <CarouselItem key={index}>
                        <div className="relative h-96">
                          {imgIsBase64 ? (
                            <img
                              src={img}
                              alt={`${model.name} - ${index + 1}`}
                              className="w-full h-full object-contain bg-muted-foreground/5"
                            />
                          ) : (
                            <Image
                              src={img}
                              alt={`${model.name} - ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 800px"
                              className="object-contain bg-muted-foreground/5"
                            />
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="mb-4 relative h-96">
                {isBase64 ? (
                  <img
                    src={firstImage}
                    alt={model.name}
                    className="w-full h-full object-contain bg-muted-foreground/5"
                  />
                ) : (
                  <Image
                    src={firstImage}
                    alt={model.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain bg-muted-foreground/5"
                  />
                )}
              </div>
            )}

            <div className="flex gap-3 flex-col sm:flex-row">
              {model.viewer && (
                <a
                  href={model.viewer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="default" className="w-full">
                    View 3D Model
                  </Button>
                </a>
              )}
            </div>

            <DialogFooter>
              <p className="text-xs text-muted-foreground mt-4">
                Opens Autodesk Viewer in a new tab.
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="font-medium">
            Practice CAD Model
          </Badge>
        </div>

        {model.viewer && (
          <a
            href={model.viewer}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 right-4 bg-primary/90 hover:bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            title="View 3D Model"
          >
            <Box className="h-5 w-5" />
          </a>
        )}
      </div>

      <CardHeader>
        <CardTitle className="font-heading font-bold text-xl line-clamp-2">
          {model.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        {model.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {model.description}
          </p>
        )}
      </CardContent>

      {/* Tools at bottom right */}
      {model.tools && model.tools.length > 0 && (
        <div className="absolute bottom-4 right-4 flex flex-wrap gap-1.5 justify-end max-w-[60%]">
          {model.tools.map((tool) => (
            <Badge key={tool} variant="secondary" className="text-xs font-medium shadow-sm">
              {tool}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
