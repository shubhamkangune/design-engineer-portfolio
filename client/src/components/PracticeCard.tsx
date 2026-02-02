import * as React from "react";
import { Box } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface PracticeModel {
  id: string;
  name: string;
  images: string[]; // Array of image URLs or base64 strings
  viewer: string; // Autodesk Viewer short link e.g. https://autode.sk/xxxx
  download?: string; // public path: /cad-files/model-name.sldprt
  tools?: string[]; // Design tools/software used
  description?: string; // Brief description
}

export default function PracticeCard({ model }: { model: PracticeModel }) {
  const firstImage = model.images && model.images.length > 0 ? model.images[0] : "/projects/practice/placeholder.png";
  const hasMultipleImages = model.images && model.images.length > 1;

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      {/* Image (click opens preview dialog) */}
      <div className="h-56 overflow-hidden relative bg-secondary">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full h-full relative">
              <img
                src={firstImage}
                alt={model.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {hasMultipleImages && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {model.images.length} images
                </div>
              )}
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl">
            <DialogTitle>{model.name}</DialogTitle>
            <DialogDescription className="mb-4">Practice CAD Model — SolidWorks</DialogDescription>

            {/* Image carousel or single image */}
            {hasMultipleImages ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {model.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="mb-4">
                        <img src={img} alt={`${model.name} - ${index + 1}`} className="w-full h-96 object-contain bg-muted-foreground/5" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="mb-4">
                <img src={firstImage} alt={model.name} className="w-full h-96 object-contain bg-muted-foreground/5" />
              </div>
            )}

            <div className="flex gap-3 flex-col sm:flex-row">
              <a href={model.viewer} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="default" className="w-full">View 3D Model</Button>
              </a>

              {model.download ? (
                <a href={model.download} className="w-full" download>
                  <Button variant="outline" className="w-full">Download CAD</Button>
                </a>
              ) : null}
            </div>

            <DialogFooter>
              {/* Small note for reviewers */}
              <p className="text-xs text-muted-foreground mt-4">Opens Autodesk Viewer in a new tab. Download links point to public/cad-files/</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="font-medium">Practice CAD Model</Badge>
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
        <CardTitle className="font-heading font-bold text-xl line-clamp-2">{model.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        {model.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{model.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {model.tools && model.tools.length > 0 
            ? `Tools: ${model.tools.join(", ")}` 
            : "Tool: SolidWorks"}
        </p>
      </CardContent>
    </Card>
  );
}

/*
Inline usage notes:
- To add a new practice model, add an image to `public/projects/practice/` (e.g. model-name.png),
  add an optional CAD file to `public/cad-files/` (e.g. model-name.sldprt), and
  add an entry to `src/data/practiceModels.ts` with `image`, `viewer`, and optional `download`.
*/
