// ІМПОРТУЄМО ХУК useState ДЛЯ РОБОТИ ЗІ СТАНОМ (пошук)
import { useState } from 'react';

// КОМПОНЕНТ ТАБЛИЦІ ІНВЕНТАРЮ
// Приймає 4 параметри (props):
// - items   : масив товарів для відображення
// - onView  : функція, яка викликається при натисканні "Переглянути"
// - onEdit  : функція, яка викликається при натисканні "Редагувати"
// - onDelete: функція, яка викликається при натисканні "Видалити"
function InventoryTable({ items, onView, onEdit, onDelete }) {
  
  // СТАН ДЛЯ ТЕКСТУ ПОШУКУ
  const [searchTerm, setSearchTerm] = useState('');

  // ФІЛЬТРАЦІЯ ТОВАРІВ ЗА НАЗВОЮ
  // Перетворюємо назву товару та пошуковий запит в нижній регістр (для регістронезалежного пошуку)
  // Залишаємо тільки ті товари, назва яких містить пошуковий запит
  const filteredItems = items.filter(item =>
    item.inventory_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== EMPTY STATE (КОЛИ НЕМАЄ ТОВАРІВ) ==========
  // Якщо масив items порожній → показуємо повідомлення
  if (items.length === 0) {
    return <div className="empty-state">📦 Немає інвентарю. Додайте першу позицію!</div>;
  }

  // ========== ВІДОБРАЖЕННЯ ТАБЛИЦІ ==========
  return (
    <div className="inventory-table-container">
      
      {/* ===== ВЕРХНЯ ПАНЕЛЬ З ПОШУКОМ ===== */}
      <div className="table-header">
        <input
          type="text"
          placeholder="🔍 Пошук за назвою..."
          value={searchTerm}                                    // значення прив'язане до стану
          onChange={(e) => setSearchTerm(e.target.value)}      // при зміні → оновлюємо стан
          className="search-input"
        />
      </div>

      {/* ===== ОСНОВНА ТАБЛИЦЯ ===== */}
      <div className="inventory-table">
        
        {/* ЗАГОЛОВКИ КОЛОНОК */}
        <div className="table-row header">
          <div className="col-name">Назва</div>          {/* колонка: назва */}
          <div className="col-description">Опис</div>    {/* колонка: опис */}
          <div className="col-photo">Фото</div>          {/* колонка: фото */}
          <div className="col-actions">Дії</div>         {/* колонка: дії (кнопки) */}
        </div>

        {/* ВІДОБРАЖЕННЯ КОЖНОГО ТОВАРУ (ПРОХОДИМО ПО МАСИВУ) */}
        {filteredItems.map((item) => (
          <div className="table-row" key={item.id}>   {/* key - унікальний ідентифікатор для React */}
            
            {/* НАЗВА ТОВАРУ */}
            <div className="col-name">{item.inventory_name}</div>
            
            {/* ОПИС ТОВАРУ (обрізаємо до 50 символів) */}
            {/* ?. - опціональний ланцюжок (безпечний доступ до властивості) */}
            <div className="col-description">
              {item.description?.substring(0, 50)}...
            </div>
            
            {/* ФОТО ТОВАРУ (ПРЕВ'Ю) */}
            <div className="col-photo">
              <img 
                src={item.photo_url}                      // джерело фото
                alt={item.inventory_name}                 // альтернативний текст
                className="table-photo"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}  // розмір 50×50px
                onError={(e) => {
                  // ЯКЩО ФОТО НЕ ЗАВАНТАЖИЛОСЬ → ПОКАЗУЄМО ЗАГЛУШКУ
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            
            {/* КНОПКИ ДІЙ */}
            <div className="col-actions">
              {/* КНОПКА "ПЕРЕГЛЯНУТИ" - викликає onView з цим товаром */}
              <button className="btn-view" onClick={() => onView(item)}>👁️</button>
              
              {/* КНОПКА "РЕДАГУВАТИ" - викликає onEdit з цим товаром */}
              <button className="btn-edit" onClick={() => onEdit(item)}>✏️</button>
              
              {/* КНОПКА "ВИДАЛИТИ" - викликає onDelete з цим товаром */}
              <button className="btn-delete" onClick={() => onDelete(item)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ЕКСПОРТУЄМО КОМПОНЕНТ
export default InventoryTable;