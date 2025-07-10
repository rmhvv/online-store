document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  function getProductLink(productId) {
    const productMap = {
      'ro-ponyhair-001': 'roponyhair.html',
      'runner-001' : 'runner.html'
      // добавь сюда другие соответствия id → html-страница
    };

    return productMap[productId] || '#'; // если неизвестно — ведёт в никуда
  }


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

  const bagContainer = document.getElementById('bagItems');
  const totalContainer = document.getElementById('total');
  const emptyMessage = document.getElementById('emptyMessage');
  const token = localStorage.getItem('token');

  fetch('http://localhost:5000/api/bag', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => res.json())
    .then((items) => {
      bagContainer.innerHTML = '';
      let total = 0;

      if (items.length === 0) {
        emptyMessage.textContent = 'Корзина пуста';
        return;
      }

      emptyMessage.style.display = 'none';

      items.forEach((item) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
          <div class="info">
            <h3><a href="${getProductLink(item.ProductId)}">${item.Name}</a></h3>
            <p>Размер: ${item.Size || '—'}</p>
            <p>Цена: ${item.Price}₽</p>
            <button class="remove-btn" data-id="${item.Id}">Удалить</button>
          </div>
        `;

        bagContainer.appendChild(productCard);
        total += item.Price * item.Quantity;
      });

      totalContainer.textContent = `Итого: ${total}₽`;

      document.querySelectorAll('.remove-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const itemId = e.target.dataset.id;

          fetch(`http://localhost:5000/api/bag/${itemId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then((res) => {
              if (!res.ok) throw new Error('Ошибка при удалении');
              e.target.closest('.product-card').remove();

              const removedItem = items.find(i => i.Id == itemId);
              if (removedItem) {
                total -= removedItem.Price * removedItem.Quantity;
                totalContainer.textContent = total > 0 ? `Итого: ${total}₽` : '';
              }

              if (bagContainer.children.length === 0) {
                emptyMessage.textContent = 'Корзина пуста';
                emptyMessage.style.display = 'block';
              }
            })
            .catch(err => {
              console.error(err);
              alert('❌ Не удалось удалить товар');
            });
        });
      });
    })
    .catch((err) => {
      console.error('Ошибка загрузки корзины:', err);
      emptyMessage.textContent = 'Ошибка загрузки корзины';
    });
});
