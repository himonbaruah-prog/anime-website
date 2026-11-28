import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = Number(process.env.PORT || 3000);
const supabaseReady = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const cloudflareReady = Boolean(process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN && process.env.CF_CUSTOMER_SUBDOMAIN);
const adminReady = Boolean(process.env.ADMIN_UPLOAD_KEY);
const supabase = supabaseReady
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || "https://himonbaruah-prog.github.io").split(",").map(value => value.trim()),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Admin-Key"]
}));
app.use(express.json({ limit: "30kb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 120 }));
app.use("/api/admin", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }));

function requireSupabase(_req, res, next) {
  if (!supabaseReady) return res.status(503).json({ error: "Database connection is not configured yet." });
  next();
}
function requireStreamingSetup(_req, res, next) {
  if (!supabaseReady || !cloudflareReady || !adminReady) {
    return res.status(503).json({ error: "Video upload is not configured yet. The database, Cloudflare Stream and admin key must all be configured." });
  }
  next();
}
function requireAdmin(req, res, next) {
  const expected = Buffer.from(process.env.ADMIN_UPLOAD_KEY || "");
  const supplied = Buffer.from(req.get("X-Admin-Key") || "");
  if (!expected.length || expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
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
  res.json({
    ok: true,
    service: "AniVerse streaming API",
    databaseConfigured: supabaseReady,
    cloudStreamingConfigured: cloudflareReady && adminReady
  });
});

app.get("/api/videos", requireSupabase, async (_req, res) => {
  const { data, error } = await supabase.from("videos")
    .select("id,title,description,playback_url,thumbnail_url,duration_seconds,created_at")
    .eq("status", "ready").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: "Could not load video catalogue" });
  res.json({ videos: data || [] });
});

app.post("/api/admin/upload-url", requireStreamingSetup, requireAdmin, async (req, res) => {
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

app.post("/api/admin/publish", requireStreamingSetup, requireAdmin, async (req, res) => {
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
  if (!supabaseReady) console.warn("Database environment variables are not configured.");
  if (!cloudflareReady) console.warn("Cloudflare Stream environment variables are not configured.");
  if (!adminReady) console.warn("Admin upload key is not configured.");
});
