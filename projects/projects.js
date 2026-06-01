import { fetchJSON, assetUrl } from "../global.js";

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
      { threshold: 0.05 }
    );
    obs.observe(el);
  });
}

async function init() {
  const projects = await fetchJSON(assetUrl("lib/projects.json"));
  const container = document.getElementById("projects-list");
  const input = document.querySelector(".search-bar");
  let query = "";

  function render(data) {
    if (!container) return;
    if (!data.length) {
      container.innerHTML = `<p class="empty-state">No matching projects.</p>`;
      return;
    }
    container.innerHTML = data.map((p, i) => cardHTML(p, i)).join("");
    observeCards(container);
  }

  if (input) {
    input.addEventListener("input", (e) => {
      query = e.target.value;
      render(
        projects.filter((p) =>
          JSON.stringify(p).toLowerCase().includes(query.toLowerCase())
        )
      );
    });
  }

  render(projects);
}

init();
