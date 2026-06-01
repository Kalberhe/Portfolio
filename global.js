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
brand.textContent = "KBG";
nav.appendChild(brand);

const ul = document.createElement("ul");

for (const p of pages) {
  const li = document.createElement("li");
  const a  = document.createElement("a");

  if (p.external) {
    a.href   = p.url;
    a.target = "_blank";
    a.rel    = "noopener";
  } else {
    a.href = new URL(p.url === "" ? "" : p.url, new URL(BASE_PATH, location.origin)).href;
  }

  a.textContent = p.title;

  const currentPath = location.pathname.replace(/\/$/, "") || "/";
  const linkPath    = new URL(a.href).pathname.replace(/\/$/, "") || "/";
  if (currentPath === linkPath) a.classList.add("current");

  li.appendChild(a);
  ul.appendChild(li);
}

nav.appendChild(ul);

/* Theme button */
const themeBtn = document.createElement("button");
themeBtn.id = "theme-btn";
themeBtn.setAttribute("aria-label", "Toggle theme");
nav.appendChild(themeBtn);

const existingNav = document.querySelector("nav");
if (existingNav) existingNav.remove();
document.body.prepend(nav);

/* ── Theme ── */
const savedTheme = localStorage.getItem("theme") || "auto";
let currentTheme = savedTheme;

function applyTheme(t) {
  const root  = document.documentElement;
  const isDark = t === "auto"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : t === "dark";
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
}

applyTheme(currentTheme);

themeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  currentTheme = isDark ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (currentTheme === "auto") applyTheme("auto");
});

/* ── Progress Bar ── */
const bar = document.createElement("div");
bar.id = "progress-bar";
document.body.prepend(bar);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
}, { passive: true });

/* ── Scroll Reveal ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

function initReveal() {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReveal);
} else {
  initReveal();
}

/* ── Footer ── */
const footer = document.createElement("footer");
footer.innerHTML = `© ${new Date().getFullYear()} Kalkidan Berhe Gebrekirstos · Built with ♥ · <a href="https://github.com/Kalberhe" target="_blank" rel="noopener">GitHub</a>`;
document.body.appendChild(footer);

/* ── fetchJSON utility ── */
export async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) {
    console.warn("Fetch failed", e);
    return [];
  }
}
