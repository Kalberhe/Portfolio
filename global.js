const pages = [
  { url: "",          title: "Home",     icon: "01" },
  { url: "projects/", title: "Projects", icon: "02" },
  { url: "resume/",   title: "Resume",   icon: "03" },
  { url: "contact/",  title: "Contact",  icon: "04" },
];

const IS_LOCAL  = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const REPO_NAME = "Portfolio";
export const BASE_PATH = IS_LOCAL ? "/" : `/${REPO_NAME}/`;

export function assetUrl(path) {
  return new URL(path, new URL(BASE_PATH, location.origin)).href;
}

export const PROFILE_IMAGE = assetUrl("assets/profile.jpg");
export const PROFILE_FALLBACK = assetUrl("assets/profile.svg");

/* ── Sidebar navigation ── */
const sidebar = document.createElement("aside");
sidebar.className = "site-sidebar";
sidebar.setAttribute("aria-label", "Site navigation");

const brandLink = document.createElement("a");
brandLink.className = "sidebar-brand";
brandLink.href = assetUrl("");
brandLink.innerHTML = `
  <span class="sidebar-brand-name">Kalkidan Berhe<br>Gebrekirstos</span>
  <span class="sidebar-brand-role">Data Analyst</span>
`;
sidebar.appendChild(brandLink);

const navList = document.createElement("ul");
navList.className = "sidebar-nav";

for (const p of pages) {
  const li = document.createElement("li");
  const a  = document.createElement("a");
  a.href = assetUrl(p.url === "" ? "" : p.url);
  a.innerHTML = `<span class="nav-icon">${p.icon}</span>${p.title}`;
  const cp = location.pathname.replace(/\/$/, "") || "/";
  const lp = new URL(a.href).pathname.replace(/\/$/, "") || "/";
  if (cp === lp) a.classList.add("current");
  li.appendChild(a);
  navList.appendChild(li);
}
sidebar.appendChild(navList);

const sidebarFooter = document.createElement("div");
sidebarFooter.className = "sidebar-footer";

const social = document.createElement("div");
social.className = "sidebar-social";
social.innerHTML = `
  <a href="https://github.com/Kalberhe" target="_blank" rel="noopener">GitHub</a>
  <a href="https://www.linkedin.com/in/kalkidangebrekirstos" target="_blank" rel="noopener">LinkedIn</a>
  <a href="mailto:gebkalkidan@gmail.com">Email</a>
`;
sidebarFooter.appendChild(social);

const themeBtn = document.createElement("button");
themeBtn.id = "theme-btn";
themeBtn.type = "button";
themeBtn.textContent = "Light mode";
sidebarFooter.appendChild(themeBtn);
sidebar.appendChild(sidebarFooter);

const sidebarToggle = document.createElement("button");
sidebarToggle.id = "sidebar-toggle";
sidebarToggle.type = "button";
sidebarToggle.setAttribute("aria-label", "Open menu");
sidebarToggle.textContent = "☰";

document.querySelector(".site-sidebar")?.remove();
document.body.prepend(sidebar);
document.body.appendChild(sidebarToggle);

function closeSidebar() {
  sidebar.classList.remove("open");
  document.body.classList.remove("sidebar-open");
  sidebarToggle.setAttribute("aria-label", "Open menu");
}

sidebarToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  document.body.classList.toggle("sidebar-open", open);
  sidebarToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

document.body.addEventListener("click", (e) => {
  if (document.body.classList.contains("sidebar-open") &&
      !sidebar.contains(e.target) && e.target !== sidebarToggle) {
    closeSidebar();
  }
});

navList.addEventListener("click", closeSidebar);

/* ── Main wrapper ── */
if (!document.querySelector(".site-main")) {
  const main = document.createElement("div");
  main.className = "site-main";
  const toMove = [...document.body.children].filter(
    (el) => el !== sidebar && el !== sidebarToggle && el.id !== "progress-bar"
  );
  toMove.forEach((el) => main.appendChild(el));
  document.body.insertBefore(main, sidebarToggle);
}

/* ── Scroll progress ── */
const bar = document.createElement("div");
bar.id = "progress-bar";
document.body.prepend(bar);
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
}, { passive: true });

/* ── Theme ── */
let isDark = localStorage.getItem("theme") !== "light";

function applyTheme() {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "Light mode" : "Dark mode";
  themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

applyTheme();
themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem("theme", isDark ? "dark" : "light");
  applyTheme();
});

/* ── Profile images (auto fallback) ── */
export function bindProfileImages() {
  document.querySelectorAll("[data-profile]").forEach((img) => {
    if (img.dataset.bound) return;
    img.dataset.bound = "1";
    const primary = assetUrl(img.dataset.profile);
    const fallback = assetUrl(img.dataset.profileFallback || "assets/profile.svg");
    img.addEventListener("error", () => {
      if (img.src !== fallback) img.src = fallback;
    });
    img.src = primary;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindProfileImages);
} else {
  bindProfileImages();
}

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

function initReveal() {
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReveal);
} else {
  initReveal();
}

/* ── Counters ── */
export function animateCounters() {
  document.querySelectorAll(".stat-value[data-target]").forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ── Footer ── */
const footer = document.createElement("footer");
footer.className = "site-footer";
footer.innerHTML = `© ${new Date().getFullYear()} Kalkidan Berhe Gebrekirstos · <a href="mailto:gebkalkidan@gmail.com">gebkalkidan@gmail.com</a>`;

const siteMain = document.querySelector(".site-main");
if (siteMain && !siteMain.querySelector(".site-footer")) {
  siteMain.appendChild(footer);
}

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
