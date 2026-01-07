"use client";

import * as React from "react";
import Image from "next/image";
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

interface PracticeModel {
  id: string;
  name: string;
  image: string;
  viewer?: string;
  download?: string;
  tools?: string[];
  order?: number;
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
  // Check if image is base64 or URL
  const isBase64 = model.image?.startsWith("data:");

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50 relative">
      {/* Image (click opens preview dialog) */}
      <div className="h-56 overflow-hidden relative bg-secondary">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full h-full relative">
              {isBase64 ? (
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading={priority ? "eager" : "lazy"}
                />
              ) : (
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  placeholder="blur"
                  blurDataURL={shimmer}
                  priority={priority}
                />
              )}
            </button>
          </DialogTrigger>

          <DialogContent>
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

            <div className="mb-4 relative h-64">
              {isBase64 ? (
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-contain bg-muted-foreground/5"
                />
              ) : (
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain bg-muted-foreground/5"
                />
              )}
            </div>

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
      </div>

      <CardHeader>
        <CardTitle className="font-heading font-bold text-xl line-clamp-2">
          {model.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow" />

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
