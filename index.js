import { fetchJSON, animateCounters } from "./global.js";

function cardHTML(p, i) {
  const tags  = (p.tags  || []).map(t => `<span class="tag">${t}</span>`).join("");
  const links = (p.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} →</a>`).join("");
  return `
    <article class="card reveal">
      <div class="card-num">${String(i + 1).padStart(2, "0")}</div>
      <h3>${p.title}</h3>
      <div class="meta">${p.year}</div>
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      <p>${p.description}</p>
      ${links ? `<div class="links">${links}</div>` : ""}
    </article>`;
}

async function init() {
  /* counters */
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); metricsObserver.disconnect(); } });
  }, { threshold: 0.3 });
  const strip = document.querySelector(".metrics-strip");
  if (strip) metricsObserver.observe(strip);

  /* projects */
  const container = document.getElementById("latest-projects");
  try {
    const projects = await fetchJSON("./lib/projects.json");
    if (container && projects.length > 0) {
      container.innerHTML = projects.slice(0, 3).map((p, i) => cardHTML(p, i)).join("");
      container.querySelectorAll(".card.reveal").forEach(el => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
        }, { threshold: 0.06 });
        obs.observe(el);
      });
    } else if (container) {
      container.innerHTML = `<p class="empty-state">No projects found.</p>`;
    }
  } catch {
    if (container) container.innerHTML = `<p class="empty-state">Error loading projects.</p>`;
  }
}

init();
