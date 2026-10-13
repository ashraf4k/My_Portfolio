const root = document.documentElement;
const navbar = document.getElementById("navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("site-menu");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Navbar ---------- */
function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
}

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Light / Dark theme ---------- */
const themeToggle = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeMeta?.setAttribute("content", theme === "light" ? "#f6f5f0" : "#0d0d0d");
  themeToggle?.setAttribute(
    "aria-label",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode"
  );
}
applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ---------- Hero portrait: shrinks as you scroll down ---------- */
const heroVisual = document.getElementById("heroVisual");
const hero = document.querySelector(".hero");
let ticking = false;

function updatePortrait() {
  ticking = false;
  if (!heroVisual || !hero || reduceMotion) return;
  const range = hero.offsetHeight * 0.85;
  const p = Math.min(Math.max(window.scrollY / range, 0), 1);
  heroVisual.style.setProperty("--p", p.toFixed(3));
}

function onScroll() {
  updateNavbar();
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updatePortrait);
  }
}
updateNavbar();
updatePortrait();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updatePortrait);

/* ---------- Scroll reveal ---------- */
const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

/* ---------- "Show more designs" ----------
   Every <article class="more-item"> inside #moreGrid is picked up
   automatically. They start hidden; each click reveals the next batch. */
const moreGrid = document.getElementById("moreGrid");
const moreBtn = document.getElementById("moreBtn");
const moreActions = document.getElementById("moreActions");
const moreStatus = document.getElementById("moreStatus");
const moreSection = document.getElementById("more-work");

if (moreGrid && moreBtn) {
  const items = Array.from(moreGrid.querySelectorAll(".more-item"));
  const batch = parseInt(moreGrid.dataset.batch, 10) || 6;
  let shown = 0;

  function updateMoreUI() {
    const left = items.length - shown;
    if (left <= 0) {
      moreActions.hidden = true;
      return;
    }
    moreBtn.firstChild.textContent = "Show more designs ";
    moreStatus.textContent = left + (left === 1 ? " more design" : " more designs");
  }

  function showNext() {
    const next = items.slice(shown, shown + batch);
    next.forEach((el, i) => {
      el.hidden = false;
      el.style.setProperty("--i", i);
      el.classList.add("just-revealed");
    });
    shown += next.length;
    updateMoreUI();
    next[0]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }

  if (items.length === 0) {
    moreSection.hidden = true;
  } else {
    items.forEach((el) => { el.hidden = true; });
    updateMoreUI();
    moreBtn.addEventListener("click", showNext);
  }
}
