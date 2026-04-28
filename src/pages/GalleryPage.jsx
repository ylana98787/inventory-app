import { useState, useEffect } from 'react';
import { getInventory } from '../services/api';

function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Не вдалося завантажити інвентар');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const isFavorite = (id) => favorites.includes(id);

  if (loading) {
    return <div className="loading-spinner">⏳ Завантаження...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="gallery-page">
      <h2>🎨 Галерея інвентарю</h2>
      
      <div className="gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="gallery-card">
            <div className="card-image">
              <img 
                src={item.photo_url} 
                alt={item.inventory_name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
              <button 
                className={`favorite-btn ${isFavorite(item.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(item.id)}
              >
                {isFavorite(item.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <div className="card-info">
              <h3>{item.inventory_name}</h3>
              <button className="view-btn" onClick={() => openModal(item)}>
                👁️ Переглянути
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img 
              src={selectedItem.photo_url} 
              alt={selectedItem.inventory_name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400';
              }}
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