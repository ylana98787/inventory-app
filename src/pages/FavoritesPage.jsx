import { useState, useEffect } from 'react';

function FavoritesPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Завантаження всіх товарів
  useEffect(() => {
    fetch('http://localhost:3001/inventory')
      .then(res => res.json())
      .then(data => {
        setAllItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Не вдалося завантажити');
        setLoading(false);
      });
  }, []);

  // Фільтруємо тільки улюблені товари
  const favoriteItems = allItems.filter(item => favorites.includes(item.id));

  // Видалити з улюблених
  const removeFavorite = (id) => {
    setFavorites(favorites.filter(favId => favId !== id));
  };

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  if (loading) return <div className="loading-spinner">Завантаження...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="gallery-page">
      <h2>❤️ Улюблені товари</h2>
      
      {favoriteItems.length === 0 ? (
        <div className="empty-state">
          📦 Немає улюблених товарів. Додайте їх з головної сторінки!
        </div>
      ) : (
        <div className="gallery-grid">
          {favoriteItems.map((item) => (
            <div key={item.id} className="gallery-card">
              <div className="card-image">
                <img 
                  src={item.photo_url} 
                  alt={item.inventory_name}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                />
                <button 
                  className="favorite-btn active"
                  onClick={() => removeFavorite(item.id)}
                >
                  ❤️
                </button>
              </div>
              <div className="card-info">
                <h3>{item.inventory_name}</h3>
                <button className="view-btn" onClick={() => openDetails(item)}>
                  Детальніше
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default FavoritesPage;