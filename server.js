require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;
const PIXABAY_MUSIC_ENDPOINT = "https://pixabay.com/api/music/";
const PIXABAY_KEY = process.env.PIXABAY_KEY;

if (!PIXABAY_KEY) {
  console.error("[NovaTok Proxy] Missing PIXABAY_KEY. Set it in the environment or .env file.");
  process.exit(1);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || "*",
  })
);

app.get("/api/pixabay-music", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  if (!query) {
    return res.status(400).json({ error: "Missing required query parameter 'q'." });
  }

  const params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: query,
    per_page: req.query.per_page || "8",
    order: req.query.order || "popular",
    safesearch: "true",
  });

  if (req.query.min_duration) params.set("min_duration", req.query.min_duration);
  if (req.query.max_duration) params.set("max_duration", req.query.max_duration);
  if (req.query.page) params.set("page", req.query.page);

  const targetUrl = `${PIXABAY_MUSIC_ENDPOINT}?${params.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const body = await response.text();
      console.error("[NovaTok Proxy] Pixabay error", response.status, body);
      return res.status(response.status).json({ error: "Pixabay API error", status: response.status });
    }
    const data = await response.json();
    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch (error) {
    console.error("[NovaTok Proxy] Failed to reach Pixabay", error);
    res.status(502).json({ error: "Unable to reach Pixabay API" });
  }
});

app.get("/", (_req, res) => {
  res.type("text").send("NovaTok Pixabay proxy is running.");
});

app.listen(PORT, () => {
  console.log(`[NovaTok Proxy] Listening on port ${PORT}`);
});

