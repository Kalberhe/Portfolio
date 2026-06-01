import { fetchJSON } from "../global.js";

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
  const projects  = await fetchJSON("../lib/projects.json");
  const container = document.getElementById("projects-list");
  const input     = document.querySelector(".search-bar");
  let query = "";

  function render(data) {
    if (!container) return;
    if (!data.length) {
      container.innerHTML = `<p class="empty-state">No matching projects.</p>`;
      return;
    }
    container.innerHTML = data.map((p, i) => cardHTML(p, i)).join("");
    container.querySelectorAll(".card.reveal").forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }

  if (input) input.addEventListener("input", e => { query = e.target.value; render(projects.filter(p => JSON.stringify(p).toLowerCase().includes(query.toLowerCase()))); });

  render(projects);
}

init();
