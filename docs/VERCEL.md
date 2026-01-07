Vercel deployment notes
=======================

This repository builds both a client and a server into `dist/` using the root `package.json` build script (`npm run build`). To deploy on Vercel use the root build instead of building `client/` directly.

Recommended Vercel settings (UI or during import):

- Root Directory: leave blank (use repository root)
- Install Command: `npm ci` (or `npm install`)
- Build Command: `npm run build`
- Output Directory: `dist`

We included `vercel.json` which configures Vercel to run the root `package.json` build and publish `dist/`.

If you prefer to build only the `client/` folder on Vercel, create a `client/package.json` that includes all client dependencies and a `build` script (`vite build`) and set the project Root Directory to `client`.

Troubleshooting
---------------
- If you see `vite: command not found`, ensure Vercel is running the root build (above) or that `client/package.json` contains `vite` in devDependencies and the Install Command is set so devDependencies are installed.
