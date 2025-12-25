/**
 * practiceModels.ts
 * Add new practice models here. For each model:
 * - Place an isometric preview image at: public/projects/practice/<model-name>.png
 * - (Optional) Place the CAD file at: public/cad-files/<model-name>.sldprt
 * - Add the Autodesk Viewer short link in `viewer` (e.g. https://autode.sk/xxxx)
 */

const practiceModels = [
  {
    id: "v-block-assembly",
    name: "V-Block Assembly (Practice)",
    image: "/projects/practice/v-block-assembly.png",
    viewer: "https://autode.sk/4qfPYu8",
    download: "/cad-files/v-block-assembly.sldasm",
  },
  {
    id: "flat-sprocket",
    name: "Flat Sprocket (Practice)",
    image: "/projects/practice/flat-sprocket.png",
    viewer: "https://autode.sk/3MPor4i",
  },
]

export default practiceModels
