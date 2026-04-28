// ІМПОРТ ХУКІВ REACT
// useState - для зберігання даних, що змінюються (стан компонента)
// useEffect - для виконання дій при завантаженні або зміні даних
import { useState, useEffect } from 'react';

// ========== КОМПОНЕНТ СКЕЛЕТОНУ (ЗАГЛУШКА ПІД ЧАС ЗАВАНТАЖЕННЯ) ==========
// Skeleton - це "кістяк", який показується замість реального контенту
// Поки дані завантажуються, користувач бачить пульсуючі блоки
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>   {/* заглушка для фото */}
    <div className="skeleton-title"></div>   {/* заглушка для назви */}
    <div className="skeleton-button"></div>  {/* заглушка для кнопки */}
  </div>
);

// ========== ГОЛОВНИЙ КОМПОНЕНТ ГАЛЕРЕЇ ==========
function GalleryPage() {
  
  // ========== ВСІ СТАНИ (STATE) КОМПОНЕНТА ==========
  
  // items - масив товарів, отриманих з API
  const [items, setItems] = useState([]);
  
  // loading - чи йде завантаження даних (true/false)
  const [loading, setLoading] = useState(true);
  
  // error - текст помилки (якщо сталася)
  const [error, setError] = useState(null);
  
  // selectedItem - товар, який вибрано для перегляду в модальному вікні
  const [selectedItem, setSelectedItem] = useState(null);
  
  // favorites - масив ID товарів, які користувач додав в улюблені
  // Зчитуємо збережені улюблені з localStorage при завантаженні
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];  // якщо є - завантажуємо, ні - пустий масив
  });

  // ========== ЕФЕКТ 1: ЗАВАНТАЖЕННЯ ДАНИХ З API ==========
  // useEffect з порожнім масивом залежностей [] виконується ОДИН РАЗ при завантаженні
  useEffect(() => {
    // fetch - функція для HTTP-запитів (отримання даних з сервера)
    fetch('http://localhost:3001/inventory')
      .then(res => res.json())              // перетворюємо відповідь у JSON
      .then(data => {                       // отримуємо дані
        setItems(data);                     // зберігаємо в стан
        setLoading(false);                  // вимикаємо завантаження
      })
      .catch(() => {                        // якщо сталася помилка
        setError('Не вдалося завантажити інвентар');
        setLoading(false);
      });
  }, []);  // [] - означає "виконати тільки один раз"

  // ========== ЕФЕКТ 2: ЗБЕРЕЖЕННЯ УЛЮБЛЕНИХ В LOCALSTORAGE ==========
  // Кожного разу, коли змінюється favorites, зберігаємо його в localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);  // [favorites] - виконується при КОЖНІЙ зміні favorites

  // ========== ФУНКЦІЯ ДЛЯ ДОДАВАННЯ/ВИДАЛЕННЯ З УЛЮБЛЕНИХ ==========
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id)                    // ЯКЩО товар вже в улюблених
        ? prev.filter(favId => favId !== id)  // ТО видаляємо
        : [...prev, id]                    // ІНАКШЕ додаємо
    );
  };

  // Відкриття модального вікна з деталями
  const openDetails = (item) => {
    setSelectedItem(item);
  };

  // Закриття модального вікна
  const closeDetails = () => {
    setSelectedItem(null);
  };

  // ========== СТАН ЗАВАНТАЖЕННЯ (ПОКАЗУЄМО SKELETON) ==========
  if (loading) {
    return (
      <div className="gallery-page">
        <h2>🎨 Галерея інвентарю</h2>
        <div className="gallery-grid">
          {/* [...Array(6)] - створює масив з 6 елементів для 6 карток-заглушок */}
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // ========== СТАН ПОМИЛКИ ==========
  if (error) {
    return (
      <div className="error-state">
        ❌ {error}
        <button onClick={() => window.location.reload()}>Спробувати знову</button>
      </div>
    );
  }

  // ========== ВІДОБРАЖЕННЯ ГАЛЕРЕЇ (КОЛИ ДАНІ ЗАВАНТАЖЕНО) ==========
  return (
    <div className="gallery-page">
      <h2>🎨 Галерея інвентарю</h2>
      
      {/* АДАПТИВНА GRID-ГАЛЕРЕЯ */}
      <div className="gallery-grid">
        {/* map - перетворюємо масив товарів у картки */}
        {items.map((item) => (
          <div key={item.id} className="gallery-card">
            
            {/* БЛОК З ФОТО ТА КНОПКОЮ УЛЮБЛЕНИХ */}
            <div className="card-image">
              <img 
                src={item.photo_url} 
                alt={item.inventory_name}
                onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
              />
              {/* КНОПКА УЛЮБЛЕНИХ */}
              <button 
                className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(item.id)}
              >
                {favorites.includes(item.id) ? '❤️' : '🤍'}
              </button>
            </div>
            
            {/* БЛОК З НАЗВОЮ ТА КНОПКОЮ ПЕРЕГЛЯДУ */}
            <div className="card-info">
              <h3>{item.inventory_name}</h3>
              <button className="view-btn" onClick={() => openDetails(item)}>
                Детальніше
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========== МОДАЛЬНЕ ВІКНО З ДЕТАЛЬНОЮ ІНФОРМАЦІЄЮ ========== */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetails}>×</button>
            <img 
              src={selectedItem.photo_url} 
              alt={selectedItem.inventory_name}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
            />
            <h2>{selectedItem.inventory_name}</h2>
            <p>{selectedItem.description || 'Немає опису'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;