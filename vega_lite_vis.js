// === Vega-Lite Visualizations Loader ===
// Works with this exact structure:
// 3179/index.html
// 3179/alcohol/{area.json, bar.json, line.json, map.json, map2.json}
// 3179/vega_lite_vis.js

const SPECS = [
  
  { id: "map",        url: "map.json" },    // Australia map
  { id: "bar",        url: "bar.json" },    //  Scatter plot
  { id: "line",       url: "line.json" },   //  Bar-line combo

];

// Helper: Render one visualization
async function renderSpec(targetId, url) {
  const msgEl = document.getElementById(`${targetId}-msg`);

  try {
    // Show a loading message while fetching
    if (msgEl) msgEl.textContent = " Loading visualization...";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Cannot load ${url} (HTTP ${res.status})`);

    // Render with Vega Embed
    await vegaEmbed(`#${targetId}`, url, { actions: false });

    if (msgEl) msgEl.textContent = ""; // Clear message when done
    console.log(` Rendered ${targetId} successfully from ${url}`);
  } catch (err) {
    console.error(` Failed to render ${targetId}:`, err);
    if (msgEl) {
      msgEl.textContent =
        ` Failed to render ${targetId}\n${String(err)}\n\n` +
        ` Fix Tips:\n` +
        ` 404 Not Found Check that the file exists at ${url}\n` +
        ` JSON Parse Error  Validate JSON at https://jsonlint.com\n` +
        ` TopoJSON Error  Ensure the "feature" name matches inside your TopoJSON file\n` +
        ` Data Path  Use full GitHub/raw URLs if referencing external CSVs`;
    }
  }
}

// Load all specs sequentially
async function renderAll() {
  for (const { id, url } of SPECS) {
    await renderSpec(id, url);
  }
}

// Start rendering once page & libraries are loaded
window.addEventListener("DOMContentLoaded", () => {
  if (typeof vegaEmbed !== "function") {
    alert(" Vega libraries not loaded. Check <script> order in index.html.");
    console.error(" Vega libraries missing  check your <script> imports.");
    return;
  }
  renderAll();
});
