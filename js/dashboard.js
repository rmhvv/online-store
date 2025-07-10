document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("userEmail");
  if (!email) {
    window.location.href = "profile.html";
  } else {
    const userEl = document.getElementById("userUsername") || document.getElementById("userEmail");
    if (userEl) userEl.textContent = email;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      window.location.href = "profile.html";
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', () => {
      const isVisible = dropdownMenu.style.display === 'flex';

      dropdownMenu.style.display = isVisible ? 'none' : 'flex';

      menuToggle.classList.toggle('rotated');
    });
  } else {
    console.error('menuToggle или dropdownMenu не найдены');
  }
});