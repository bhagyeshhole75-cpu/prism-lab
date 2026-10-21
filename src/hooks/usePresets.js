import { useEffect, useState } from "react";
import { PRESETS as FALLBACK } from "../../api/_presets.js";

// Loads presets from our Node.js API. If the API can't be reached, the
// built-in copy is used so the Lab still works.
export default function usePresets() {
  const [presets, setPresets] = useState(FALLBACK);
  const [source, setSource] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/presets")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        setPresets(data.presets);
        setSource("api");
      })
      .catch(() => !cancelled && setSource("fallback"));
    return () => {
      cancelled = true;
    };
  }, []);

  return { presets, source };
}
