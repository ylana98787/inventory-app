import { useState } from 'react';

function InventoryTable({ items, onView, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.inventory_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (items.length === 0) {
    return <div className="empty-state">📦 Немає інвентарю. Додайте першу позицію!</div>;
  }

  return (
    <div className="inventory-table-container">
      <div className="table-header">
        <input
          type="text"
          placeholder="🔍 Пошук за назвою..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="inventory-table">
        <div className="table-row header">
          <div className="col-name">Назва</div>
          <div className="col-description">Опис</div>
          <div className="col-photo">Фото</div>
          <div className="col-actions">Дії</div>
        </div>

        {filteredItems.map((item) => (
          <div className="table-row" key={item.id}>
            <div className="col-name">{item.inventory_name}</div>
            <div className="col-description">
              {item.description?.substring(0, 50)}...
            </div>
            <div className="col-photo">
              <img src={item.photo_url} alt={item.inventory_name} className="table-photo" />
            </div>
            <div className="col-actions">
              <button className="btn-view" onClick={() => onView(item)}>👁️</button>
              <button className="btn-edit" onClick={() => onEdit(item)}>✏️</button>
              <button className="btn-delete" onClick={() => onDelete(item)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryTable;