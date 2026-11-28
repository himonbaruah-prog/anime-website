import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = Number(process.env.PORT || 3000);
const required = [
  "ADMIN_UPLOAD_KEY", "CF_ACCOUNT_ID", "CF_API_TOKEN",
  "CF_CUSTOMER_SUBDOMAIN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"
];
const missing = required.filter(key => !process.env[key]);
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || "https://himonbaruah-prog.github.io").split(","),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Admin-Key"]
}));
app.use(express.json({ limit: "30kb" }));
app.use("/api/admin", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));

function configCheck(_req, res, next) {
  if (missing.length) return res.status(503).json({ error: "Server setup is incomplete", missing });
  next();
}
function requireAdmin(req, res, next) {
  const supplied = req.get("X-Admin-Key") || "";
  if (!process.env.ADMIN_UPLOAD_KEY || supplied.length !== process.env.ADMIN_UPLOAD_KEY.length ||
      supplied !== process.env.ADMIN_UPLOAD_KEY) {
    return res.status(401).json({ error: "Admin key is invalid" });
  }
  next();
}
async function cloudflare(path, options = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/stream${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.errors?.[0]?.message || "Cloudflare Stream request failed");
  }
  return data.result;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "AniVerse streaming API", configured: missing.length === 0 });
});

app.get("/api/videos", configCheck, async (_req, res) => {
  const { data, error } = await supabase.from("videos")
    .select("id,title,description,playback_url,thumbnail_url,duration_seconds,created_at")
    .eq("status", "ready").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: "Could not load video catalogue" });
  res.json({ videos: data || [] });
});

app.post("/api/admin/upload-url", configCheck, requireAdmin, async (req, res) => {
  const title = String(req.body.title || "").trim().slice(0, 120);
  const description = String(req.body.description || "").trim().slice(0, 1000);
  if (!title) return res.status(400).json({ error: "Episode title is required" });
  try {
    const result = await cloudflare("/direct_upload", {
      method: "POST",
      body: JSON.stringify({
        maxDurationSeconds: 7200,
        expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        meta: { name: title, description }
      })
    });
    res.json({ uploadURL: result.uploadURL, uid: result.uid, title, description });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.post("/api/admin/publish", configCheck, requireAdmin, async (req, res) => {
  const uid = String(req.body.uid || "").trim();
  const title = String(req.body.title || "").trim().slice(0, 120);
  const description = String(req.body.description || "").trim().slice(0, 1000);
  if (!/^[a-f0-9]{32}$/i.test(uid) || !title) {
    return res.status(400).json({ error: "A valid video ID and title are required" });
  }
  try {
    const video = await cloudflare(`/${uid}`);
    if (!video.readyToStream) {
      return res.status(409).json({ error: "Video is still processing. Try publishing again in a moment." });
    }
    const playbackUrl = `https://customer-${process.env.CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
    const thumbnailUrl = `https://customer-${process.env.CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg`;
    const { error } = await supabase.from("videos").upsert({
      id: uid, title, description, playback_url: playbackUrl,
      thumbnail_url: thumbnailUrl, duration_seconds: Math.round(video.duration || 0),
      status: "ready"
    });
    if (error) throw new Error("Could not save episode to database");
    res.json({ ok: true, message: "Episode published", id: uid });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`AniVerse API listening on port ${port}`);
  if (missing.length) console.warn("Missing environment variables:", missing.join(", "));
});
