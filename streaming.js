// Phase 4: Cloudflare Stream + backend catalogue integration.
// Set this to the deployed Node API URL before enabling cloud streaming.
const API_BASE = "https://aniverse-api-jnyh.onrender.com";
const streamSection = document.querySelector("#watch");
const localLayout = streamSection?.querySelector(".watch-layout");

if (localLayout) {
  const panel = document.createElement("section");
  panel.className = "cloud-stream-panel";
  panel.innerHTML = `
    <div class="cloud-stream-heading">
      <div><p class="eyebrow">ANIVERSE CLOUD STREAMING</p><h3>Online <span>episodes</span></h3><p>Stream published episodes from the AniVerse video library.</p></div>
      <button type="button" id="refresh-cloud-videos" class="stream-refresh">Refresh library</button>
    </div>
    <div class="cloud-player-wrap">
      <video id="cloud-player" controls playsinline preload="metadata"></video>
      <div class="cloud-player-info"><strong id="cloud-player-title">Select an online episode</strong><p id="cloud-player-status">Cloud streaming becomes active after the API is deployed and configured.</p></div>
    </div>
    <div id="cloud-video-list" class="cloud-video-list"><p class="library-empty">Loading online library...</p></div>
    <details class="admin-upload-details">
      <summary>Admin: upload a licensed episode</summary>
      <div class="admin-upload-form">
        <label>Admin upload key<input id="stream-admin-key" type="password" autocomplete="current-password" placeholder="Enter the private admin key"></label>
        <label>Episode title<input id="stream-title" type="text" maxlength="120" placeholder="e.g. Episode 01 — The Beginning"></label>
        <label>Description<textarea id="stream-description" rows="2" maxlength="1000" placeholder="Optional episode description"></textarea></label>
        <label>Video file<input id="stream-file" type="file" accept="video/*"></label>
        <button id="stream-upload-button" type="button" class="primary-button">Upload episode</button>
        <p id="stream-upload-status" class="stream-upload-status" role="status">Only upload videos you own or are licensed to distribute.</p>
        <button id="stream-publish-button" type="button" class="stream-publish-button" hidden>Publish after processing</button>
      </div>
    </details>
  `;
  localLayout.before(panel);
}

const cloudPlayer = document.querySelector("#cloud-player");
let cloudHls = null;
let pendingStream = null;

function apiReady() {
  return API_BASE && !API_BASE.includes("YOUR-ANIVERSE-API-URL");
}
function streamStatus(message, isError = false) {
  const el = document.querySelector("#stream-upload-status");
  if (el) {
    el.textContent = message;
    el.classList.toggle("error", isError);
  }
}
async function apiRequest(path, options = {}) {
  const response = await fetch(API_BASE + path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Streaming API request failed");
  return data;
}
function playCloudVideo(video) {
  if (!cloudPlayer) return;
  if (cloudHls) {
    cloudHls.destroy();
    cloudHls = null;
  }
  const url = video.playback_url;
  if (cloudPlayer.canPlayType("application/vnd.apple.mpegurl")) {
    cloudPlayer.src = url;
  } else if (window.Hls && Hls.isSupported()) {
    cloudHls = new Hls();
    cloudHls.loadSource(url);
    cloudHls.attachMedia(cloudPlayer);
  } else {
    document.querySelector("#cloud-player-status").textContent = "This browser does not support HLS playback.";
    return;
  }
  document.querySelector("#cloud-player-title").textContent = video.title;
  document.querySelector("#cloud-player-status").textContent = video.description || "Now ready to stream.";
  cloudPlayer.load();
  cloudPlayer.play().catch(() => {});
  cloudPlayer.scrollIntoView({ behavior: "smooth", block: "center" });
}
async function loadCloudVideos() {
  const list = document.querySelector("#cloud-video-list");
  if (!list) return;
  if (!apiReady()) {
    list.innerHTML = '<p class="library-empty">API not connected yet. Deploy the backend and set API_BASE in streaming.js to activate online streaming.</p>';
    document.querySelector("#cloud-player-status").textContent = "Waiting for backend configuration.";
    return;
  }
  list.innerHTML = '<p class="library-empty">Loading online episodes...</p>';
  try {
    const data = await apiRequest("/api/videos");
    const videos = data.videos || [];
    if (!videos.length) {
      list.innerHTML = '<p class="library-empty">No published online episodes yet.</p>';
      return;
    }
    list.innerHTML = videos.map(video => `
      <article class="cloud-video-item">
        <div class="cloud-video-thumb">${video.thumbnail_url ? `<img src="${video.thumbnail_url}" alt="" loading="lazy">` : "▶"}</div>
        <div class="cloud-video-copy"><strong>${escapeHTML(video.title)}</strong><small>${escapeHTML(video.description || "AniVerse episode")}</small></div>
        <button type="button" class="play-cloud-video" data-cloud-video="${escapeHTML(video.id)}">Play</button>
      </article>
    `).join("");
    list.querySelectorAll("[data-cloud-video]").forEach(button => {
      button.addEventListener("click", () => {
        const selected = videos.find(video => video.id === button.dataset.cloudVideo);
        if (selected) playCloudVideo(selected);
      });
    });
  } catch (error) {
    list.innerHTML = '<p class="library-empty">Could not connect to the streaming API. Check the API URL and backend deployment.</p>';
    console.error(error);
  }
}

async function uploadCloudEpisode() {
  if (!apiReady()) return streamStatus("Deploy the backend and configure API_BASE first.", true);
  const key = document.querySelector("#stream-admin-key").value;
  const title = document.querySelector("#stream-title").value.trim();
  const description = document.querySelector("#stream-description").value.trim();
  const fileInput = document.querySelector("#stream-file");
  const file = fileInput.files?.[0];
  if (!key || !title || !file) return streamStatus("Enter the admin key, episode title and video file.", true);
  if (!file.type.startsWith("video/")) return streamStatus("Choose a valid video file.", true);

  const button = document.querySelector("#stream-upload-button");
  button.disabled = true;
  button.textContent = "Preparing upload...";
  streamStatus("Requesting a secure one-time upload URL...");
  try {
    const upload = await apiRequest("/api/admin/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": key },
      body: JSON.stringify({ title, description })
    });
    streamStatus("Uploading video to Cloudflare Stream...");
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", upload.uploadURL);
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) streamStatus("Uploading: " + Math.round(event.loaded / event.total * 100) + "%");
      };
      xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Video upload failed (" + xhr.status + ")"));
      xhr.onerror = () => reject(new Error("Network error during upload"));
      const form = new FormData();
      form.append("file", file);
      xhr.send(form);
    });
    pendingStream = { uid: upload.uid, title, description, key };
    document.querySelector("#stream-publish-button").hidden = false;
    streamStatus("Upload complete. Cloudflare must process the video before it can be published. Press Publish after processing.");
  } catch (error) {
    streamStatus(error.message, true);
  } finally {
    button.disabled = false;
    button.textContent = "Upload episode";
  }
}
async function publishCloudEpisode() {
  if (!pendingStream) return;
  const button = document.querySelector("#stream-publish-button");
  button.disabled = true;
  streamStatus("Checking processing status and publishing...");
  try {
    await apiRequest("/api/admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": pendingStream.key },
      body: JSON.stringify({ uid: pendingStream.uid, title: pendingStream.title, description: pendingStream.description })
    });
    streamStatus("Episode published successfully. It is now in the online library.");
    pendingStream = null;
    button.hidden = true;
    document.querySelector("#stream-file").value = "";
    await loadCloudVideos();
  } catch (error) {
    streamStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
}

document.querySelector("#refresh-cloud-videos")?.addEventListener("click", loadCloudVideos);
document.querySelector("#stream-upload-button")?.addEventListener("click", uploadCloudEpisode);
document.querySelector("#stream-publish-button")?.addEventListener("click", publishCloudEpisode);
loadCloudVideos();

// Show the real backend configuration state without exposing any secrets.
const cloudHealthStatus = document.createElement("p");
cloudHealthStatus.className = "cloud-health-status";
cloudHealthStatus.setAttribute("role", "status");
cloudHealthStatus.setAttribute("aria-live", "polite");
document.querySelector(".cloud-stream-heading")?.append(cloudHealthStatus);

async function checkCloudHealth() {
  if (!cloudHealthStatus || !apiReady()) return;
  cloudHealthStatus.textContent = "Checking streaming service...";
  cloudHealthStatus.dataset.state = "loading";
  try {
    const response = await fetch(API_BASE + "/api/health", { cache: "no-store" });
    if (!response.ok) throw new Error("Health check failed");
    const health = await response.json();
    if (!health.ok) throw new Error("API is not ready");
    const database = health.databaseConfigured
      ? "Database connected"
      : "Database setup required";
    const streaming = health.cloudStreamingConfigured
      ? "Cloud upload ready"
      : "Cloud upload setup required";
    cloudHealthStatus.textContent = database + " · " + streaming;
    cloudHealthStatus.dataset.state =
      health.databaseConfigured && health.cloudStreamingConfigured ? "ready" : "warning";
  } catch (error) {
    cloudHealthStatus.textContent = "Streaming service is temporarily unreachable. Please refresh in a moment.";
    cloudHealthStatus.dataset.state = "error";
  }
}

checkCloudHealth();
