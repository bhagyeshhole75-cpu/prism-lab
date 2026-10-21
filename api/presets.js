import { PRESETS } from "./_presets.js";

// GET /api/presets  ->  the list of lighting/material presets for the Lab.
export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  // Let Vercel's CDN cache the response for an hour.
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(JSON.stringify({ presets: PRESETS }));
}
