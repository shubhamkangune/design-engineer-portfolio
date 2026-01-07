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
    // Image should be uploaded to: client/public/projects/practice/v-block-assembly.png
    image: "/projects/practice/v-block-assembly.png",
    // Autodesk Viewer short link (provided)
    viewer: "https://autode.sk/4qfPYu8",
    // Replace with the actual CAD filename you will upload to client/public/cad-files/
    download: "/cad-files/v-block-assembly.sldasm",
  },
  {
    id: "flat-sprocket",
    name: "Flat Sprocket (Practice)",
    // Upload image to: client/public/projects/practice/flat-sprocket.png
    image: "/projects/practice/flat-sprocket.png",
    // Autodesk Viewer short link (provided by user)
    viewer: "https://autode.sk/3MPor4i",
    // Optional: add download path after uploading CAD file to client/public/cad-files/
    // download: "/cad-files/flat-sprocket.sldprt",
  },
];

export default practiceModels;
