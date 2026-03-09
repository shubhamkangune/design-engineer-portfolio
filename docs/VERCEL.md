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

Environment Variables
--------------------
Add these environment variables in Vercel Dashboard > Settings > Environment Variables:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `QUICKMAIL_API_KEY` - Your Quick Mail API key (e.g., qm_3957e84071f9675af64331e652e2c74971820cde807e6b723186dda40c55467b)
- `CONTACT_EMAIL` - Email address to receive contact form submissions (e.g., shubhamcsc4656@gmail.com)

**Optional:**
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (production/development)

To add environment variables:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its value
4. Redeploy your application for changes to take effect

Troubleshooting
---------------
- If you see `vite: command not found`, ensure Vercel is running the root build (above) or that `client/package.json` contains `vite` in devDependencies and the Install Command is set so devDependencies are installed.
- If emails are not sending, verify that `QUICKMAIL_API_KEY` and `CONTACT_EMAIL` are properly set in Vercel environment variables.
- If resume uploads fail, ensure `MONGODB_URI` is configured correctly (resume files are stored in MongoDB for Vercel compatibility).
