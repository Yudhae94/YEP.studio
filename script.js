const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const scrollProgress = document.querySelector(".scroll-progress");
const pageBackdrop = document.querySelector(".page-backdrop");

/* Nomor WhatsApp dinonaktifkan (privasi). Tombol WhatsApp dialihkan ke
   halaman 404 hingga nomor siap ditampilkan kembali. */
document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.setAttribute("href", "/404.html");
  link.removeAttribute("target");
  link.removeAttribute("rel");
});

/* Template pesan otomatis untuk CTA "Konsultasi Proyek via WhatsApp".
   Isi WHATSAPP_NUMBER dengan format internasional (mis. "6281234567890")
   untuk mengaktifkan tautan wa.me. Selama kosong, CTA tetap memakai
   tautan internal (#contact) yang ada di HTML. */
const WHATSAPP_NUMBER = "";
const WHATSAPP_MESSAGE =
  "Halo Kenz Studio, saya tertarik untuk berkonsultasi mengenai pembuatan [Branding / UI/UX / Web / Mobile App] untuk startup saya. Boleh bantu berikan informasi lebih lanjut?";

if (WHATSAPP_NUMBER) {
  document.querySelectorAll("[data-whatsapp-cta]").forEach((link) => {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

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


const collabForm = document.querySelector("[data-collab-form]");
const collabError = collabForm
  ? collabForm.querySelector("[data-collab-error]")
  : null;
const collabTargetEmail = "kenz.studio23@gmail.com";
const collabStatus = collabForm
  ? collabForm.querySelector("[data-collab-status]")
  : null;
const collabAccessKey = collabForm
  ? collabForm.getAttribute("data-access-key") || ""
  : "";

const markCollabField = (field, isValid) => {
  if (field) {
    field.setAttribute("aria-invalid", String(!isValid));
  }
  return isValid;
};

const showCollabError = (message) => {
  if (!collabError) {
    return;
  }

  if (!message) {
    collabError.textContent = "";
    collabError.hidden = true;
    return;
  }

  collabError.textContent = message;
  collabError.hidden = false;
};

if (collabForm) {
  collabForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showCollabError("");

    const nameField = collabForm.elements.namedItem("name");
    const emailField = collabForm.elements.namedItem("email");
    const topicField = collabForm.elements.namedItem("topic");
    const messageField = collabForm.elements.namedItem("message");

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const topic = topicField ? topicField.value : "";
    const message = messageField ? messageField.value.trim() : "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let firstInvalid = null;
    let errorMessage = "";

    const nameValid = name.length >= 2;
    markCollabField(nameField, nameValid);
    if (!nameValid && !firstInvalid) {
      firstInvalid = nameField;
      errorMessage = "Mohon isi nama Anda (minimal 2 huruf).";
    }

    const emailValid = emailPattern.test(email);
    markCollabField(emailField, emailValid);
    if (!emailValid && !firstInvalid) {
      firstInvalid = emailField;
      errorMessage = "Mohon isi alamat email yang valid.";
    }

    const topicValid = Boolean(topic);
    markCollabField(topicField, topicValid);
    if (!topicValid && !firstInvalid) {
      firstInvalid = topicField;
      errorMessage = "Mohon pilih jenis kebutuhan Anda.";
    }

    const messageValid = message.length >= 10;
    markCollabField(messageField, messageValid);
    if (!messageValid && !firstInvalid) {
      firstInvalid = messageField;
      errorMessage = "Mohon ceritakan kebutuhan Anda (minimal 10 huruf).";
    }

    if (firstInvalid) {
      showCollabError(errorMessage);
      firstInvalid.focus();
      return;
    }

    if (!collabAccessKey || collabAccessKey.indexOf("GANTI_DENGAN") === 0) {
      showCollabError(
        "Formulir belum siap (access key belum diisi). Hubungi kami via email.",
      );
      return;
    }

    const submitButton = collabForm.querySelector(".collab-submit");
    const subject = `[Kolaborasi - ${topic}] ${name}`;

    if (collabStatus) {
      collabStatus.hidden = true;
      collabStatus.textContent = "";
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.label = submitButton.innerHTML;
      submitButton.textContent = "Mengirim…";
    }

    const payload = {
      access_key: collabAccessKey,
      subject,
      from_name: "KENZ.STUDIO — Formulir Kolaborasi",
      name,
      email,
      topic,
      message,
      replyto: email,
    };

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message || "Pengiriman gagal.");
        }
        collabForm.reset();
        [nameField, emailField, topicField, messageField].forEach((field) => {
          if (field) {
            field.removeAttribute("aria-invalid");
          }
        });
        if (collabStatus) {
          collabStatus.textContent =
            "Terima kasih! Pesan Anda sudah terkirim ke email kami.";
          collabStatus.hidden = false;
        }
      })
      .catch(() => {
        showCollabError(
          "Maaf, pesan gagal terkirim. Silakan coba lagi atau kirim ke " +
            collabTargetEmail +
            ".",
        );
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          if (submitButton.dataset.label) {
            submitButton.innerHTML = submitButton.dataset.label;
          }
        }
      });
  });

  collabForm.addEventListener("input", (event) => {
    if (event.target instanceof Element && event.target.matches("input, select, textarea")) {
      markCollabField(event.target, true);
      showCollabError("");
    }
  });
}

const themeToggle = document.querySelector("[data-theme-toggle]");
const documentRoot = document.documentElement;
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const getActiveTheme = () =>
  documentRoot.dataset.theme === "light" ? "light" : "dark";

const syncThemeToggle = () => {
  const theme = getActiveTheme();

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap",
    );
    themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    themeToggle.setAttribute(
      "title",
      theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap",
    );
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? "#111210" : "#f3f2ec",
    );
  }
};

syncThemeToggle();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";

    if (!prefersReducedMotion.matches) {
      documentRoot.classList.add("theme-transition");
      window.setTimeout(() => {
        documentRoot.classList.remove("theme-transition");
      }, 550);
    }

    documentRoot.dataset.theme = nextTheme;

    try {
      window.localStorage.setItem("kenz-theme", nextTheme);
    } catch (error) {
      /* Penyimpanan tidak tersedia (mode privat), tema tetap diterapkan sesi ini. */
    }

    syncThemeToggle();
  });
}

