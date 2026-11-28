# AniVerse — Phase 4 streaming setup

This repository now contains the Phase 4 streaming integration code. The public GitHub Pages site is still a static frontend; the API must be deployed separately before cloud uploads and the online catalogue work.

## Services required

1. Cloudflare Stream account and API token with Stream read/write permission.
2. Supabase project.
3. Node.js hosting for this API (for example Render, Railway, or another Node host).

## Supabase

Open the Supabase SQL Editor and run the contents of `supabase-schema.sql`. Keep the service-role key private; it belongs only in the backend environment variables.

## Cloudflare Stream

Create an API token with permission to manage Stream for the correct account. Find the account ID and Stream customer subdomain in the Cloudflare Stream dashboard.

## Deploy the API

1. Create a new Node web service from this GitHub repository.
2. Set the root directory to the repository root and the start command to `npm start`.
3. Add every variable from `.env.example` in the hosting dashboard. Set `CORS_ORIGIN` to `https://himonbaruah-prog.github.io`.
4. Do not commit a real `.env` file or expose the Supabase service-role key / Cloudflare API token in browser code.
5. Copy the deployed API base URL (for example `https://your-api-host.example`) into `streaming.js` as `API_BASE`.

## Admin upload

Open AniVerse, go to Watch, enter the admin upload key, choose an episode title and video file, and upload. The browser sends the file directly to Cloudflare using a one-time upload URL. When Cloudflare finishes processing, press Publish (or retry Publish after processing). Published episodes appear in the online library.

The admin key is a simple first-stage gate, not a complete user-account system. For a public commercial service, replace it with proper admin authentication, signed playback URLs, audit logs, abuse protection, backups, and legal content licensing.

## Important

- Upload only videos you own or are explicitly licensed to distribute.
- Cloudflare Stream usage is billed according to its current storage/delivery pricing. Check the provider's pricing before inviting viewers.
- GitHub Pages cannot run the Node API. The frontend and API are deployed separately.
- The local-device video library remains available as a separate feature.
