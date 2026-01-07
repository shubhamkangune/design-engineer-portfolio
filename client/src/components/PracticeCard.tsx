import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PracticeModel {
  id: string;
  name: string;
  image: string; // public path: /projects/practice/model-name.png
  viewer: string; // Autodesk Viewer short link e.g. https://autode.sk/xxxx
  download?: string; // public path: /cad-files/model-name.sldprt
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
            <DialogDescription className="mb-4">Practice CAD Model — SolidWorks</DialogDescription>

            <div className="mb-4">
              {/* Larger preview inside dialog (keeps site lightweight, no 3D embed) */}
              <img src={model.image} alt={model.name} className="w-full h-64 object-contain bg-muted-foreground/5" />
            </div>

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
      </div>

      <CardHeader>
        <CardTitle className="font-heading font-bold text-xl line-clamp-2">{model.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">Tool: SolidWorks</p>
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
