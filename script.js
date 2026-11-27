const API = "https://kitsu.io/api/edge";

let anime = [];
let apiAnime = [];
let saved = JSON.parse(localStorage.getItem("aniverse-watchlist") || "[]");
let activeGenre = "All";
let query = "";
let sortMode = "popular";
let activeDetail = null;
let searchTimer;
let requestNumber = 0;

const $ = selector => document.querySelector(selector);
const statusElement = document.createElement("p");
statusElement.id = "api-status";
$("#results-count").after(statusElement);

const detailActions = document.createElement("div");
detailActions.className = "detail-actions";
detailActions.innerHTML = `
  <a id="trailer-link" target="_blank" rel="noopener">
    Watch Trailer
  </a>
  <a id="legal-link" target="_blank" rel="noopener">
    Find Legal Streaming
  </a>
`;
$("#detail-save").before(detailActions);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function saveList() {
  localStorage.setItem("aniverse-watchlist", JSON.stringify(saved));
  $("#list-count").textContent = `${saved.length} Saved`;
}

function mapAnime(item, included = []) {
  const a = item.attributes || {};
  const relationships = item.relationships || {};
  const genreIds = relationships.genres?.data || [];

  const genres = genreIds.map(g => {
    const found = included.find(x =>
      x.id === g.id && x.type === g.type
    );
    return found?.attributes?.name;
  }).filter(Boolean);

  const poster = a.posterImage || {};

  return {
    id: "kitsu-" + item.id,
    title: a.canonicalTitle || "Unknown Anime",
    year: a.startDate ? a.startDate.slice(0, 4) : "N/A",
    type: a.subtype || "Anime",
    episodes: a.episodeCount || "?",
    rating: a.averageRating
      ? (Number(a.averageRating) / 10).toFixed(1)
      : "N/A",
    status: a.status || "Unknown",
    description: a.synopsis || "No description available.",
    image: poster.original || poster.large || poster.medium || "",
    genres,
    trailer: a.youtubeVideoId || "",
    link: item.links?.self || ""
  };
}

async function loadAnime(term = "") {
  const currentRequest = ++requestNumber;
  const status = $("#api-status");

  status.textContent = term
    ? "Searching anime..."
    : "Loading anime collection...";

  try {
    const params = new URLSearchParams();
    params.set("page[limit]", "20");
    params.set("include", "genres");

    if (term) {
      params.set("filter[text]", term);
    } else {
      params.set("sort", "-userCount");
    }

    const response = await fetch(`${API}/anime?${params}`, {
      headers: {
        Accept: "application/vnd.api+json"
      }
    });

    if (!response.ok) {
      throw new Error("Anime server is not responding.");
    }

    const data = await response.json();

    if (currentRequest !== requestNumber) return;

    const included = data.included || [];

    apiAnime = (data.data || []).map(item =>
      mapAnime(item, included)
    );

    status.textContent = `${apiAnime.length} anime found`;
    render();

  } catch (error) {
    if (currentRequest !== requestNumber) return;

    status.textContent =
      "Anime load failed. Please check your internet and try again.";

    console.error(error);
    apiAnime = [];
    render();
  }
}

function getAllAnime() {
  return [...anime, ...apiAnime];
}

function filtered() {
  let list = getAllAnime().filter(a => {
    const matchesGenre =
      activeGenre === "All" || a.genres.includes(activeGenre);

    const matchesSearch =
      `${a.title} ${a.genres.join(" ")}`.toLowerCase()
        .includes(query.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  if (sortMode === "rating") {
    list.sort((a, b) => Number(b.rating) - Number(a.rating));
  } else if (sortMode === "az") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === "za") {
    list.sort((a, b) => b.title.localeCompare(a.title));
  }

  return list;
}

function card(a) {
  const image = a.image
    ? `<img src="${escapeHTML(a.image)}"
         alt="${escapeHTML(a.title)}"
         loading="lazy">`
    : `<div class="poster-fallback">ANIME</div>`;

  return `
    <article class="anime-card">
      <div class="anime-poster" data-open="${escapeHTML(a.id)}">
        ${image}
        <span class="poster-type">${escapeHTML(a.type)}</span>
        <button class="save-btn"
          data-save="${escapeHTML(a.id)}"
          aria-label="Save anime">
          ${saved.some(x => x.id === a.id) ? "♥" : "＋"}
        </button>
      </div>

      <div class="anime-card-content">
        <h3 data-open="${escapeHTML(a.id)}">
          ${escapeHTML(a.title)}
        </h3>
        <p>${escapeHTML(a.year)} · ${escapeHTML(a.episodes)} episodes</p>
        <p class="rating">★ ${escapeHTML(a.rating)}</p>
      </div>
    </article>
  `;
}

function renderGenres() {
  const allGenres = [...new Set(
    getAllAnime().flatMap(a => a.genres)
  )].sort();

  $("#filter-chips").innerHTML = ["All", ...allGenres].map(g => `
    <button class="chip ${activeGenre === g ? "active" : ""}"
      data-genre="${escapeHTML(g)}">
      ${escapeHTML(g)}
    </button>
  `).join("");
}

function render() {
  renderGenres();

  const list = filtered();

  $("#anime-grid").innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty-state">
         <h3>No anime found</h3>
         <p>Try another anime name.</p>
       </div>`;

  $("#results-count").textContent =
    `Showing ${list.length} anime`;

  renderWatchlist();
}

function renderWatchlist() {
  $("#watch-grid").innerHTML = saved.length
    ? saved.map(card).join("")
    : "";

  $("#watch-empty").hidden = saved.length > 0;
  $("#watch-grid").style.display = saved.length ? "grid" : "none";

  $("#list-count").textContent = `${saved.length} Saved`;
}

function toggleSave(id) {
  const animeItem = getAllAnime().find(a => a.id === id);

  if (!animeItem) return;

  const exists = saved.some(a => a.id === id);

  saved = exists
    ? saved.filter(a => a.id !== id)
    : [...saved, animeItem];

  saveList();
  render();
}

function openDetail(id) {
  const a = getAllAnime().find(x => x.id === id) ||
    saved.find(x => x.id === id);

  if (!a) return;

  activeDetail = id;

  $("#detail-cover").style.backgroundImage =
    a.image ? `url("${a.image}")` : "none";

  $("#detail-cover").textContent = a.image ? "" : "ANIME";

  $("#detail-title").textContent = a.title;

  $("#detail-meta").textContent =
    `${a.year} · ${a.type} · ${a.episodes} episodes · ★ ${a.rating} · ${a.status}`;

  $("#detail-description").textContent = a.description;

  $("#detail-genres").innerHTML = a.genres.map(g =>
    `<span class="mini-tag">${escapeHTML(g)}</span>`
  ).join("");

  $("#detail-save").textContent =
    saved.some(x => x.id === id)
      ? "♥ Remove from Watchlist"
      : "＋ Add to Watchlist";

  $("#detail-save").disabled = false;

  const trailer = $("#trailer-link");
  const legal = $("#legal-link");

  trailer.href = a.trailer
    ? `https://www.youtube.com/watch?v=${encodeURIComponent(a.trailer)}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(a.title + " official trailer")}`;

  legal.href =
    `https://www.justwatch.com/in/search?q=${encodeURIComponent(a.title)}`;

  $("#modal").classList.add("show");
}

$("#search").addEventListener("input", e => {
  const value = e.target.value.trim();

  query = value;
  render();

  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    loadAnime(value);
  }, 500);
});

$("#sort").addEventListener("change", e => {
  sortMode = e.target.value;
  render();
});

document.addEventListener("click", e => {
  const genre = e.target.closest("[data-genre]");

  if (genre) {
    activeGenre = genre.dataset.genre;
    render();
  }

  const save = e.target.closest("[data-save]");

  if (save) {
    e.stopPropagation();
    toggleSave(save.dataset.save);
  }

  const open = e.target.closest("[data-open]");

  if (open) {
    openDetail(open.dataset.open);
  }
});

const clearButton = $("#clear-filters");

if (clearButton) {
  clearButton.addEventListener("click", () => {
    activeGenre = "All";
    query = "";
    sortMode = "popular";
    $("#search").value = "";
    $("#sort").value = "default";
    loadAnime("");
  });
}

$("#modal-close").addEventListener("click", () => {
  $("#modal").classList.remove("show");
});

$("#modal").addEventListener("click", e => {
  if (e.target.id === "modal") {
    $("#modal").classList.remove("show");
  }
});

$("#detail-save").addEventListener("click", () => {
  if (activeDetail) toggleSave(activeDetail);
});

$("#mobile-menu").addEventListener("click", () => {
  $(".main-nav").classList.toggle("open");
});

$(".main-nav").addEventListener("click", () => {
  $(".main-nav").classList.remove("open");
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    $("#modal").classList.remove("show");
  }
});

saveList();

loadAnime("");