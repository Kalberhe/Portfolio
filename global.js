const pages = [
  { url: "",          title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/",   title: "Resume" },
  { url: "contact/",  title: "Contact" },
  { url: "https://github.com/Kalberhe", title: "GitHub", external: true },
];

const IS_LOCAL  = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const REPO_NAME = "Portfolio";
const BASE_PATH = IS_LOCAL ? "/" : `/${REPO_NAME}/`;

/* ── Nav ── */
const nav = document.createElement("nav");

const brand = document.createElement("span");
brand.className = "nav-brand";
brand.textContent = "KBG.";
nav.appendChild(brand);

const ul = document.createElement("ul");
for (const p of pages) {
  const li = document.createElement("li");
  const a  = document.createElement("a");
  if (p.external) {
    a.href = p.url; a.target = "_blank"; a.rel = "noopener";
  } else {
    a.href = new URL(p.url === "" ? "" : p.url, new URL(BASE_PATH, location.origin)).href;
  }
  a.textContent = p.title;
  const cp = location.pathname.replace(/\/$/, "") || "/";
  const lp = new URL(a.href).pathname.replace(/\/$/, "") || "/";
  if (cp === lp) a.classList.add("current");
  li.appendChild(a); ul.appendChild(li);
}
nav.appendChild(ul);

const navActions = document.createElement("div");
navActions.className = "nav-actions";

const navToggle = document.createElement("button");
navToggle.id = "nav-toggle";
navToggle.setAttribute("aria-label", "Toggle menu");
navToggle.setAttribute("aria-expanded", "false");
navToggle.textContent = "☰";
navActions.appendChild(navToggle);

const themeBtn = document.createElement("button");
themeBtn.id = "theme-btn";
themeBtn.setAttribute("aria-label", "Toggle theme");
themeBtn.textContent = "☀️";
navActions.appendChild(themeBtn);

nav.appendChild(navActions);

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.textContent = open ? "✕" : "☰";
});

ul.addEventListener("click", () => {
  nav.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.textContent = "☰";
});

const existingNav = document.querySelector("nav");
if (existingNav) existingNav.remove();
document.body.prepend(nav);

/* ── Scroll progress ── */
const bar = document.createElement("div");
bar.id = "progress-bar";
document.body.prepend(bar);
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
}, { passive: true });

/* ── Theme (dark default) ── */
let isDark = localStorage.getItem("theme") !== "light";
function applyTheme() {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}
applyTheme();
themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem("theme", isDark ? "dark" : "light");
  applyTheme();
});

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } });
}, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });

function initReveal() {
  document.querySelectorAll(".reveal, .reveal-left").forEach(el => revealObserver.observe(el));
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReveal);
} else { initReveal(); }

/* ── Counter animation ── */
export function animateCounters() {
  document.querySelectorAll(".metric-num[data-target]").forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const isDecimal = el.dataset.decimal === "true";
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = isDecimal ? (eased * target).toFixed(1) : Math.round(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ── Footer ── */
const footer = document.createElement("footer");
footer.innerHTML = `© ${new Date().getFullYear()} Kalkidan Berhe Gebrekirstos · <a href="mailto:gebkalkidan@gmail.com">gebkalkidan@gmail.com</a> · <a href="https://github.com/Kalberhe" target="_blank" rel="noopener">GitHub</a>`;
document.body.appendChild(footer);

export async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) { console.warn("Fetch failed", e); return []; }
}
