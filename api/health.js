// GET /api/health  ->  shows which machine answered: Node.js version and cloud region.
export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(
    JSON.stringify({
      ok: true,
      runtime: `Node.js ${process.version}`,
      region: process.env.VERCEL_REGION || "local",
      platform: process.env.VERCEL ? "Vercel Functions" : "Vite dev server",
      time: new Date().toISOString(),
    })
  );
}
