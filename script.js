/* =========================================================
   GOLDARANI ELEVATOR — INTERACTION ENGINE
   ---------------------------------------------------------
   01. Page loader + elevator arrival
   02. Sticky header
   03. Mobile menu
   04. Scroll progress
   05. Cursor glow
   06. Interactive service issue selector
   07. Cinematic reveal-on-scroll
   08. Process timeline activation
   09. Service card 3D tilt
   10. Mouse parallax on hero
   11. Animated counters
   12. Active section navigation
   13. Service card pulse
========================================================= */

/* =========================================================
   01. PAGE LOADER + ELEVATOR ARRIVAL
========================================================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  const heroElevator = document.getElementById("heroElevator");

  setTimeout(() => {
    loader?.classList.add("hide");
    heroElevator?.classList.add("arrived");
  }, 450);
});

/* =========================================================
   02. STICKY HEADER
========================================================= */
const header = document.getElementById("siteHeader");

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* =========================================================
   03. MOBILE MENU
========================================================= */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* =========================================================
   04. SCROLL PROGRESS BAR
========================================================= */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.appendChild(progressBar);

const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

/* =========================================================
   05. DESKTOP CURSOR GLOW
========================================================= */
if (window.matchMedia("(pointer: fine)").matches) {
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  cursorGlow.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursorGlow);

  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    document.body.classList.add("pointer-active");
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("pointer-active");
  });
}

/* =========================================================
   06. INTERACTIVE SERVICE ISSUE SELECTOR
========================================================= */
const issueButtons = document.querySelectorAll(".issue-item");
const issueTitle = document.getElementById("issueTitle");
const issueDetail = document.getElementById("issueDetail");
const issueResult = document.getElementById("issueResult");

issueButtons.forEach((button) => {
  button.addEventListener("click", () => {
    issueButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (issueTitle) issueTitle.textContent = button.dataset.issue || "درخواست خدمات";
    if (issueDetail) issueDetail.textContent = button.dataset.detail || "برای هماهنگی با گلدرانی تماس بگیرید.";

    issueResult?.classList.remove("flash");
    void issueResult?.offsetWidth;
    issueResult?.classList.add("flash");
  });
});

/* =========================================================
   07. CINEMATIC REVEAL-ON-SCROLL
   ---------------------------------------------------------
   Elements enter with depth, scale and blur instead of a
   simple fade. Each group receives a small stagger.
========================================================= */
const revealItems = document.querySelectorAll(
  ".service-card, .reason-row, .process-line article, .section-heading, " +
  ".intro-grid > div, .dashboard-copy, .issue-panel, .contact-layout > *, " +
  ".hero-copy, .hero-visual"
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal-on-scroll");
  item.style.transitionDelay = `${(index % 5) * 90}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* =========================================================
   08. PROCESS TIMELINE ACTIVATION
========================================================= */
const processLine = document.querySelector(".process-line");
const processItems = document.querySelectorAll(".process-line article");

if (processLine && "IntersectionObserver" in window) {
  const processObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;

      processLine.classList.add("process-live");

      processItems.forEach((item, index) => {
        setTimeout(() => item.classList.add("is-process-active"), index * 350 + 300);
      });

      processObserver.disconnect();
    },
    { threshold: 0.35 }
  );

  processObserver.observe(processLine);
}

/* =========================================================
   09. SERVICE CARD 3D TILT
========================================================= */
const tiltCards = document.querySelectorAll(".service-card");

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 900) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform =
      `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-8px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* =========================================================
   10. HERO MOUSE PARALLAX
========================================================= */
const heroVisual = document.querySelector(".hero-visual");
const heroGrid = document.querySelector(".hero-grid");

if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroVisual.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0)`;
    if (heroGrid) heroGrid.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0)`;
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.transform = "";
    if (heroGrid) heroGrid.style.transform = "";
  });
}

/* =========================================================
   11. ANIMATED COUNTERS
   ---------------------------------------------------------
   Counters are injected into the reasons list so the design
   gains a measurable, live-dashboard feel without hardcoding
   extra HTML into the page.
========================================================= */
const counterTargets = [
  { selector: ".reason-row:nth-child(1) > span", value: 1 },
  { selector: ".reason-row:nth-child(2) > span", value: 2 },
  { selector: ".reason-row:nth-child(3) > span", value: 3 },
  { selector: ".reason-row:nth-child(4) > span", value: 4 }
];

const animateCounter = (element, target) => {
  if (!element || element.dataset.counterDone === "true") return;
  element.dataset.counterDone = "true";

  const start = performance.now();
  const duration = 900;

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased)).padStart(2, "0");

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      counterTargets.forEach(({ selector, value }) => {
        animateCounter(document.querySelector(selector), value);
      });
      counterObserver.disconnect();
    },
    { threshold: 0.4 }
  );

  const reasonList = document.querySelector(".reason-list");
  if (reasonList) counterObserver.observe(reasonList);
}

/* =========================================================
   12. ACTIVE SECTION NAVIGATION
========================================================= */
const navLinks = [...document.querySelectorAll(".main-nav a")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("active"));
        const active = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        active?.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -45% 0px" }
  );

  navSections.forEach((section) => sectionObserver.observe(section));
}

/* =========================================================
   13. SERVICE CARD MICRO-PULSE
========================================================= */
setInterval(() => {
  const cards = [...document.querySelectorAll(".service-card")];
  if (!cards.length || document.hidden) return;

  cards.forEach((card) => card.classList.remove("is-hot"));
  const next = cards[Math.floor(Date.now() / 3200) % cards.length];
  next.classList.add("is-hot");
}, 3200);
