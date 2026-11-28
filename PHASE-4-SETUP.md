# AniVerse — Phase 4 streaming setup

The API code is prepared, and the Supabase database schema is separate from Cloudflare Stream. The public GitHub Pages site is a static frontend; the Node API must be deployed separately.

## Current setup status

- Supabase project and `videos` table: configure/verify in your Supabase dashboard.
- Node API: ready to deploy from this repository.
- Cloudflare Stream: not active until Stream is enabled on your Cloudflare account and its API credentials are added.
- GitHub Pages frontend: remains available for discovery and local-device video playback.

## 1. Supabase

The project URL is:

`https://schxgambhcvriorhslpw.supabase.co`

In Supabase, open **SQL Editor** and run `supabase-schema.sql` once if the `videos` table has not already been created. In **Table Editor**, confirm that `public.videos` exists.

Copy the project's **service role / secret key** from the API keys area. Never put it in frontend code, GitHub, screenshots, or chat. It belongs only in the API host's private environment variables.

## 2. Deploy the API on Render

1. Sign in to Render and choose **New → Web Service**.
2. Connect the GitHub repository `himonbaruah-prog/anime-website`.
3. Use the repository root as the root directory.
4. Build command: `npm install`
5. Start command: `npm start`
6. Select a plan that suits your budget. A free instance, if currently offered to your account, may sleep when idle; the first request can take longer.
7. Add these environment variables in Render's **Environment** section:
   - `SUPABASE_URL` = `https://schxgambhcvriorhslpw.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = your private Supabase service-role/secret key
   - `CORS_ORIGIN` = `https://himonbaruah-prog.github.io`
   - `ADMIN_UPLOAD_KEY` = a long, unique password generated for AniVerse
   - `CF_ACCOUNT_ID`, `CF_API_TOKEN`, `CF_CUSTOMER_SUBDOMAIN` only after Cloudflare Stream is enabled.
8. Deploy. Copy the service URL Render gives you.

The API can serve the online video catalogue with Supabase configured, even while Cloudflare Stream is not configured. Upload endpoints stay disabled until all Cloudflare and admin settings are present.

## 3. Connect the frontend

After Render deploys successfully, open `streaming.js` in GitHub and replace:

`https://YOUR-ANIVERSE-API-URL`

with your real Render service URL (no trailing slash). Save the change. The site can then request the online catalogue.

## 4. Enable Cloudflare Stream later

Only continue if you choose to pay for Cloudflare Stream. Create a Cloudflare API token with the minimum Stream permissions needed to create and read videos. Add the account ID, token, and customer subdomain as private Render environment variables. Never add the token to GitHub or the browser.

## 5. Upload and publish

Once Cloudflare Stream is configured, open AniVerse → Watch → Admin: upload a licensed episode. Enter the private admin upload key, title, and video file. After processing finishes, press **Publish after processing**.

Upload only videos you own or have explicit permission to distribute. Before opening uploads to the public, add proper admin accounts, signed/private playback where needed, audit logs, abuse controls, backups, and legal content licensing.

## Important

- GitHub Pages cannot run the Node API.
- Do not send passwords, service-role keys, or Cloudflare API tokens in this chat.
- The API's single admin key is an MVP gate, not a complete account system.
- Check provider pricing before enabling paid video storage and delivery.
- The local-device video library is separate and does not upload files to a public server.
