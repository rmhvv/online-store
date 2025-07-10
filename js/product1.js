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


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.querySelector(".add-to-cart");

  addToCartBtn?.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Пожалуйста, авторизуйтесь.");
      window.location.href = "profile.html";
      return;
    }

    const selectedSizeBtn = document.querySelector(".size-btn.selected");
    if (!selectedSizeBtn) {
      alert("Пожалуйста, выберите размер.");
      return;
    }

    const product = {
      ProductId: document.querySelector(".product-card")?.dataset.productId || "unknown-id",
      Name: document.querySelector(".product-name")?.textContent.trim() || "Unknown Product",
      Price: parseFloat(document.querySelector(".product-price")?.dataset.price || 0),
      Size: selectedSizeBtn.textContent.trim(),
      Quantity: 1,
    };

    try {
      const res = await fetch("http://localhost:5000/api/bag/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Ошибка при добавлении");

      alert("✅ Товар добавлен в корзину!");
    } catch (err) {
      console.error("Ошибка:", err);
      alert("❌ Не удалось добавить товар");
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', () => {
      const isVisible = dropdownMenu.style.display === 'flex';
      dropdownMenu.style.display = isVisible ? 'none' : 'flex';
      menuToggle.classList.toggle('rotated');
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = width / 2;
  let mouseY = height / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const petals = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = random(0, width);
      this.y = random(-height, 0);
      this.size = random(8, 20);
      this.speedY = random(1, 2);
      this.speedX = random(-0.5, 0.5);
      this.rotation = random(0, Math.PI * 2);
      this.spin = random(-0.01, 0.01);
      this.opacity = random(0.6, 1);
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.spin;
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      this.x += dx * 0.0005;
      this.y += dy * 0.0005;

      if (this.y > height + this.size) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(this.size / 2, -this.size / 2, 0, -this.size);
      ctx.quadraticCurveTo(-this.size / 2, -this.size / 2, 0, 0);

      ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`;
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < 80; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(petal => {
      petal.update();
      petal.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
});


document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slider-track");
  const images = document.querySelectorAll(".slider-image");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");

  let currentIndex = 0;

  function updateSlider() {
    const firstImage = images[0];
    if (!firstImage) return;

    const width = firstImage.getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * width}px)`;
  }

  nextBtn?.addEventListener("click", () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  window.addEventListener("resize", updateSlider);
  window.addEventListener("load", updateSlider);
});