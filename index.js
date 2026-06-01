import { fetchJSON } from "./global.js";

function cardHTML(p) {
  const tags  = (p.tags  || []).map(t => `<span class="tag">${t}</span>`).join("");
  const links = (p.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} →</a>`).join("");
  return `
    <article class="card reveal">
      <h3>${p.title}</h3>
      <div class="meta">${p.year}</div>
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      <p>${p.description}</p>
      ${links ? `<div class="links">${links}</div>` : ""}
    </article>
  `;
}

async function init() {
  const container = document.getElementById("latest-projects");
  const statsBox  = document.getElementById("stats");

  try {
    const projects = await fetchJSON("./lib/projects.json");
    if (container && Array.isArray(projects) && projects.length > 0) {
      container.innerHTML = projects.slice(0, 3).map(cardHTML).join("");
      /* trigger observer for newly added .reveal nodes */
      document.querySelectorAll(".card.reveal").forEach(el => {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
        }, { threshold: 0.08 });
        obs.observe(el);
      });
    } else if (container) {
      container.innerHTML = `<p style="color:var(--text-muted)">No projects found.</p>`;
    }
  } catch (err) {
    if (container) container.innerHTML = `<p style="color:var(--text-muted)">Error loading projects.</p>`;
  }

  try {
    const stats = await fetchJSON("https://api.github.com/users/Kalberhe");
    if (statsBox && stats.public_repos !== undefined) {
      statsBox.innerHTML = `
        <div class="stat-box"><dl><dt>Repos</dt><dd>${stats.public_repos}</dd></dl></div>
        <div class="stat-box"><dl><dt>Followers</dt><dd>${stats.followers}</dd></dl></div>
        <div class="stat-box"><dl><dt>Gists</dt><dd>${stats.public_gists}</dd></dl></div>
        <div class="stat-box"><dl><dt>Following</dt><dd>${stats.following}</dd></dl></div>
      `;
    }
  } catch (e) {
    console.warn("GitHub stats failed", e);
  }
}

init();
