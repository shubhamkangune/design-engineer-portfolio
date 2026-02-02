import * as React from "react";
import { Cube } from "lucide-react";
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
  tools?: string[]; // Design tools/software used
  description?: string; // Brief description
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

        {model.viewer && (
          <a
            href={model.viewer}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 right-4 bg-primary/90 hover:bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            title="View 3D Model"
          >
            <Cube className="h-5 w-5" />
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
