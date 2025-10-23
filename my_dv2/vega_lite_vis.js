


const SPECS = [
  { id: "map",  url: "graphs/map.json"  },
  { id: "bar",  url: "graphs/bar.json"  },
  { id: "line", url: "graphs/line.json" }
];


async function renderSpec(targetId, url) {
  const msgEl = document.getElementById(`${targetId}-msg`);

  try {
    
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${url}  HTTP ${res.status}`);

    await vegaEmbed(`#${targetId}`, url, { actions: false });
  } catch (err) {
    console.error(`Failed to render ${targetId}:`, err);
    if (msgEl) {
      msgEl.textContent =
        `Failed to render ${targetId}:\n${String(err)}\n\nFix tips:\n` +
        ` 404  check the file path/name (expected: ${url}).\n` +
        ` JSON parse error  fix commas/quotes in that spec file.\n` +
        ` Map only  ensure TopoJSON "feature" matches the key under "objects" in states_no.json.\n` +
        `If loading TopoJSON locally from map.json, use "../states_no.json" (from inside graph/).`;
    }
  }
}


window.addEventListener("DOMContentLoaded", () => {

  if (typeof vegaEmbed !== "function") {
    console.error("vegaEmbed not found. Make sure the CDN scripts load BEFORE vega_lite_vis.js");
    alert("Vega libraries not loaded. Check <script> order in index.html.");
    return;
  }

  SPECS.forEach(s => renderSpec(s.id, s.url));
});
