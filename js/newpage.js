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

document.addEventListener("DOMContentLoaded", () => {
  const profileLink = document.getElementById('profileLink');
  const bagLink = document.getElementById('bagLink');
  const token = localStorage.getItem('token');

  if (profileLink) {
    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = token ? 'dashboard.html' : 'profile.html';
    });
  }

  if (bagLink) {
    bagLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = token ? 'bag.html' : 'profile.html';
    });
  }
});