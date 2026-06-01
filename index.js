import { fetchJSON, animateCounters, assetUrl } from "./global.js";

function cardHTML(p, i) {
  const tags = (p.tags || []).map((t) => `<span class="project-tag">${t}</span>`).join("");
  const links = (p.links || [])
    .map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} →</a>`)
    .join("");
  return `
    <article class="project-card reveal">
      <span class="project-index">${String(i + 1).padStart(2, "0")}</span>
      <div class="project-body">
        <h3>${p.title}</h3>
        <div class="project-year">${p.year}</div>
        <p>${p.description}</p>
        ${tags ? `<div class="project-tags">${tags}</div>` : ""}
      </div>
      ${links ? `<div class="project-links">${links}</div>` : ""}
    </article>`;
}

function observeCards(root) {
  root.querySelectorAll(".project-card.reveal").forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
  });
}

async function init() {
  const strip = document.querySelector(".stats-bar");
  if (strip) {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounters();
            metricsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    metricsObserver.observe(strip);
  }

  const container = document.getElementById("latest-projects");
  try {
    const projects = await fetchJSON(assetUrl("lib/projects.json"));
    if (container && projects.length > 0) {
      container.innerHTML = projects.slice(0, 4).map((p, i) => cardHTML(p, i)).join("");
      observeCards(container);
    } else if (container) {
      container.innerHTML = `<p class="empty-state">No projects found.</p>`;
    }
  } catch {
    if (container) container.innerHTML = `<p class="empty-state">Could not load projects.</p>`;
  }
}

init();
