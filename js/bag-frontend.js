document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const bagItemsContainer = document.getElementById("bagItems");
  const emptyMessage = document.getElementById("emptyMessage");

  if (!token) {
    emptyMessage.textContent = "Пожалуйста, авторизуйтесь.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/bag", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) throw new Error("Ошибка загрузки");

    const items = await res.json();

    if (items.length === 0) {
      emptyMessage.textContent = "Ваша корзина пуста.";
      return;
    }

    emptyMessage.style.display = "none";

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("bag-item");
      div.innerHTML = `
        <p><strong>${item.Name}</strong></p>
        <p>Размер: ${item.Size}</p>
        <p>Цена: ${item.Price}₽</p>
        <p>Кол-во: ${item.Quantity}</p>
      `;
      bagItemsContainer.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    emptyMessage.textContent = "Ошибка загрузки корзины.";
  }
});
