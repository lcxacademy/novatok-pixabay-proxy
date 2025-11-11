require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;
const JAMENDO_ENDPOINT = "https://api.jamendo.com/v3.0/tracks/";
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

if (!JAMENDO_CLIENT_ID) {
  console.error("[NovaTok Proxy] Missing JAMENDO_CLIENT_ID. Set it in the environment.");
  process.exit(1);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || "*",
  })
);

app.get("/api/jamendo-tracks", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  if (!query) {
    return res.status(400).json({ error: "Missing required query parameter 'q'." });
  }

  const params = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    limit: req.query.limit || "8",
    search: query,
    order: req.query.order || "popularity_total",
    include: "musicinfo+licenses",
    audioformat: "mp31",
    fuzziness: "1",
  });

  if (req.query.tags) params.set("tags", req.query.tags);
  if (req.query.page) params.set("page", req.query.page);

  const targetUrl = `${JAMENDO_ENDPOINT}?${params.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const body = await response.text();
      console.error("[NovaTok Proxy] Jamendo error", response.status, body);
      return res.status(response.status).json({ error: "Jamendo API error", status: response.status });
    }
    const data = await response.json();
    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch (error) {
    console.error("[NovaTok Proxy] Failed to reach Jamendo", error);
    res.status(502).json({ error: "Unable to reach Jamendo API" });
  }
});

app.get("/", (_req, res) => {
  res.type("text").send("NovaTok Pixabay proxy is running.");
});

app.listen(PORT, () => {
  console.log(`[NovaTok Proxy] Listening on port ${PORT}`);
});

