import { useEffect, useState } from "react";

export function Nav() {
  return (
    <nav className="nav">
      <a className="brand" href="#top">
        Prism Lab
      </a>
      <div className="nav-links">
        <a href="#lab">Lab</a>
        <a href="#stack">Stack</a>
        <a href="#cloud">Cloud</a>
      </div>
      <a className="btn btn-light btn-sm" href="#lab">
        Try it
      </a>
    </nav>
  );
}

const STACK = [
  {
    name: "React",
    role: "User interface",
    text: "Components for every section and control. When you move a slider, React updates state and the 3D scene re-renders with the new value.",
  },
  {
    name: "three.js",
    role: "3D rendering",
    text: "Draws the glass with WebGL on your GPU. A transmission material simulates light bending through the object (refraction), and bloom adds the glow.",
  },
  {
    name: "Node.js",
    role: "Backend API",
    text: "Two small API routes, /api/presets and /api/health, run as Node.js serverless functions. The Lab loads its light presets from them.",
  },
  {
    name: "Vercel",
    role: "Cloud hosting",
    text: "Builds the site with Vite, serves the static files from a global CDN, and runs the Node.js functions on demand, scaling to zero when idle.",
  },
];

export function Stack() {
  return (
    <section className="section" id="stack">
      <header className="section-head">
        <p className="label">§03 / Under the hood</p>
        <h2>
          Four tools.
          <br />
          One small app.
        </h2>
      </header>
      <div className="cards">
        {STACK.map((item, i) => (
          <article className="card" key={item.name}>
            <span className="card-index">0{i + 1}</span>
            <h3>{item.name}</h3>
            <p className="card-role">{item.role}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="flow" aria-label="Request flow">
        <span>Your browser</span>
        <i />
        <span>Vercel CDN</span>
        <i />
        <span>React + three.js</span>
        <i />
        <span>Node.js function</span>
      </div>
    </section>
  );
}

export function CloudStatus() {
  const [state, setState] = useState({ status: "idle" });

  async function ping() {
    setState({ status: "loading" });
    const start = performance.now();
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setState({ status: "ok", data, ms: Math.round(performance.now() - start) });
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  }

  useEffect(() => {
    ping();
  }, []);

  const { status, data, ms } = state;

  return (
    <section className="section" id="cloud">
      <header className="section-head">
        <p className="label">§04 / Live from the cloud</p>
        <h2>
          A real server
          <br />
          answered you.
        </h2>
        <p className="section-sub">
          This box calls <code>/api/health</code>, a Node.js function running in a Vercel data centre, and
          shows what came back.
        </p>
      </header>

      <div className="status">
        <div className="status-head">
          <span className={`dot dot-${status}`} />
          <strong>
            {status === "ok" ? "Online" : status === "loading" ? "Pinging…" : status === "error" ? "Unreachable" : "Idle"}
          </strong>
          <button className="btn btn-ghost btn-sm" onClick={ping} disabled={status === "loading"}>
            Ping again
          </button>
        </div>
        <dl>
          <div>
            <dt>Endpoint</dt>
            <dd>GET /api/health</dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>{data?.runtime ?? "—"}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>{data?.region ?? "—"}</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{data?.platform ?? "—"}</dd>
          </div>
          <div>
            <dt>Round trip</dt>
            <dd>{ms != null ? `${ms} ms` : "—"}</dd>
          </div>
        </dl>
        {status === "error" && <p className="status-error">Could not reach the API ({state.message}).</p>}
      </div>
    </section>
  );
}

export function FloatingBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`floating-bar ${show ? "show" : ""}`} aria-hidden={!show}>
      <span>Prism Lab</span>
      <a className="btn btn-light btn-sm" href="#lab" tabIndex={show ? 0 : -1}>
        Play →
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-big">Prism Lab</p>
      <p>
        Built by Bhagyesh Hole · First-year Computer Science, VIT Pune
        <br />
        React · three.js · Node.js · Vercel
      </p>
    </footer>
  );
}
