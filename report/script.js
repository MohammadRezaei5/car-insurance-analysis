document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".toc-link");
  const sections = document.querySelectorAll("section[id]");

  let isClickScrolling = false;
  let clickTimeout = null;

  function setActiveLink(id) {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  // تشخیص سکشن فعال
  function updateActiveSection() {
    if (isClickScrolling) return;

    // اگر به انتهای صفحه رسیدیم
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10;

    if (isAtBottom) {
      setActiveLink(sections[sections.length - 1].id);
      return;
    }

    let currentSectionId = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      // خط فرضی 140px از بالای صفحه
      if (rect.top <= 140 && rect.bottom > 140) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId) {
      setActiveLink(currentSectionId);
    }
  }
  // کلیک روی فهرست
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").substring(1);

      setActiveLink(targetId);

      isClickScrolling = true;
      clearTimeout(clickTimeout);

      clickTimeout = setTimeout(() => {
        isClickScrolling = false;
        updateActiveSection();
      }, 800);
    });
  });
  // اسکرول
  window.addEventListener("scroll", updateActiveSection, { passive: true });

  // بارگذاری اولیه
  updateActiveSection();

  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const imgCards = document.querySelectorAll(".img-card");

  imgCards.forEach((card) => {
    card.addEventListener("click", () => {
      const fullSrc =
        card.getAttribute("data-fullsrc") || card.querySelector("img").src;
      const altText = card.querySelector("img")?.alt || "";

      modalImg.src = fullSrc;
      modalImg.alt = altText;

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});
