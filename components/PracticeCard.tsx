"use client";

import * as React from "react";
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
}

export default function PracticeCard({ model }: { model: PracticeModel }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      {/* Image (click opens preview dialog) */}
      <div className="h-56 overflow-hidden relative bg-secondary">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full h-full">
              <img
                src={model.image}
                alt={model.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>{model.name}</DialogTitle>
            <DialogDescription className="mb-4">
              Practice CAD Model — SolidWorks
            </DialogDescription>

            <div className="mb-4">
              <img
                src={model.image}
                alt={model.name}
                className="w-full h-64 object-contain bg-muted-foreground/5"
              />
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

              {model.download ? (
                <a href={model.download} className="w-full" download>
                  <Button variant="outline" className="w-full">
                    Download CAD
                  </Button>
                </a>
              ) : null}
            </div>

            <DialogFooter>
              <p className="text-xs text-muted-foreground mt-4">
                Opens Autodesk Viewer in a new tab. Download links point to
                public/cad-files/
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

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">Tool: SolidWorks</p>
      </CardContent>
    </Card>
  );
}
