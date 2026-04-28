import { useState, useEffect } from 'react';

function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Завантаження даних з API (GET /inventory)
  useEffect(() => {
    fetch('http://localhost:3001/inventory')
      .then(res => {
        if (!res.ok) throw new Error('Помилка завантаження');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Не вдалося завантажити інвентар');
        setLoading(false);
      });
  }, []);

  // Збереження улюблених в localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Додати/видалити з улюблених
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Відкрити деталі (модальне вікно)
  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  // Стан завантаження
  if (loading) {
    return <div className="loading-spinner">Завантаження...</div>;
  }

  // Стан помилки
  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="gallery-page">
      <h2>🎨 Галерея інвентарю</h2>
      
      {/* Адаптивна grid-галерея */}
      <div className="gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="gallery-card">
            {/* Фото товару */}
            <div className="card-image">
              <img 
                src={item.photo_url} 
                alt={item.inventory_name}
                onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
              />
              {/* Кнопка "Улюблені" */}
              <button 
                className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(item.id)}
              >
                {favorites.includes(item.id) ? '❤️' : '🤍'}
              </button>
            </div>
            {/* Назва товару та кнопка перегляду */}
            <div className="card-info">
              <h3>{item.inventory_name}</h3>
              <button className="view-btn" onClick={() => openDetails(item)}>
                Детальніше
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальне вікно з детальною інформацією */}
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
            <p className="description">{selectedItem.description || 'Немає опису'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;