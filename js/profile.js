document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((user) => {
        localStorage.setItem("userEmail", user.email);
        window.location.href = "dashboard.html";
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
      });
  }
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn, .tab-content")
      .forEach((el) => el.classList.remove("active"));

    btn.classList.add("active");
    const tabId = btn.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
    document.getElementById("errorMessage").textContent = "";
  });
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const email = document.getElementById("registerEmail").value.trim();

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

    localStorage.setItem("username", username);
    alert("Регистрация успешна! Теперь войди.");
    document.querySelector('[data-tab="login"]').click();
  } catch (err) {
    document.getElementById("errorMessage").textContent = err.message;
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Ошибка входа");
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.user.email);

    alert(`Добро пожаловать, ${data.user.email}`);
    window.location.href = "dashboard.html";
  } catch (err) {
    document.getElementById("errorMessage").textContent = err.message;
  }
});
