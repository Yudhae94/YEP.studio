const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const scrollProgress = document.querySelector(".scroll-progress");
const pageBackdrop = document.querySelector(".page-backdrop");
const whatsappNumber = "6281283973788";
const whatsappMessage =
  "Halo YEP.studio, saya ingin berdiskusi tentang proyek digital.";
const whatsappUrl = new URL(`https://wa.me/${whatsappNumber}`);
whatsappUrl.searchParams.set("text", whatsappMessage);

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.setAttribute("href", whatsappUrl.href);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (scrollProgress || pageBackdrop) {
  let scrollFrame = 0;

  const updateScrollProgress = () => {
    scrollFrame = 0;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    if (scrollProgress) {
      scrollProgress.style.transform = `scaleX(${progress})`;
    }

    if (pageBackdrop) {
      const backgroundShift = prefersReducedMotion.matches
        ? 0
        : Math.min(window.scrollY * 0.12, window.innerHeight * 0.2);
      pageBackdrop.style.setProperty("--scroll-shift", `${backgroundShift}px`);
    }
  };

  const requestScrollProgressUpdate = () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    }
  };

  window.addEventListener("scroll", requestScrollProgressUpdate, {
    passive: true,
  });
  window.addEventListener("resize", requestScrollProgressUpdate);
  updateScrollProgress();
}

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -32px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Buka navigasi" : "Tutup navigasi");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka navigasi");
      siteNav.classList.remove("is-open");
    }
  });
}
