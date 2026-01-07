CAD files for public projects

Place any CAD files or exported drawings you want publicly available in this folder. Guidelines:

- Accepted formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), DXF (.dxf). Include source native files if appropriate.
- Organization: create a subfolder per project (e.g., `project-name/`) when multiple files are needed.
- Naming convention:
  - project-name.step or project-name.stp (assembled STEP file)
  - project-name-part-1.step, project-name-part-2.step (individual parts)
  - drawings.pdf (manufacturing drawings or datasheets)
- Versioning: include a clear revision suffix or date in filenames (e.g., `project-v1.step`, `project-v1.1.step`).
- Export recommendations:
  - For 3D exchange use STEP for assemblies and IGES for legacy systems.
  - Use STL for 3D printing exports (specify units and tolerances).
  - For 2D manufacturing use DXF exported with the correct units and layer structure.
- File size & privacy: compress where possible and avoid including proprietary information. If files are large, consider zipping them.

If your frontend expects specific filenames or folders, match those conventions here so the site can load or link them automatically.
