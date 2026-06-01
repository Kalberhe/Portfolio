import { fetchJSON } from "../global.js";

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
  const projects  = await fetchJSON("../lib/projects.json");
  const container = document.getElementById("projects-list");
  const input     = document.querySelector(".search-bar");

  let query = "";

  function render(data) {
    if (!container) return;
    if (data.length === 0) {
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted)">No matching projects found.</p>`;
      return;
    }
    container.innerHTML = data.map(cardHTML).join("");
    container.querySelectorAll(".card.reveal").forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }

  function filter() {
    const q = query.toLowerCase();
    render(projects.filter(p => JSON.stringify(p).toLowerCase().includes(q)));
  }

  if (input) {
    input.addEventListener("input", e => { query = e.target.value; filter(); });
  }

  render(projects);
}

init();
