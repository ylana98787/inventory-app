// ІМПОРТУЄМО НЕОБХІДНІ ХУКИ ТА КОМПОНЕНТИ
import { useState, useEffect } from 'react';              // хуки React
import InventoryTable from '../components/InventoryTable/InventoryTable';  // таблиця
import InventoryForm from '../components/InventoryForm/InventoryForm';      // форма додавання/редагування
import InventoryModal from '../components/InventoryModal/InventoryModal';    // модальне вікно перегляду
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';          // модальне вікно підтвердження
import { getInventory, createInventory, updateInventory, updateInventoryPhoto, deleteInventory } from '../services/api';  // API-функції

// ГОЛОВНИЙ КОМПОНЕНТ АДМІН-ПАНЕЛІ
// Відповідає за всю логіку CRUD операцій
function AdminPage() {
  
  // ========== ВСІ СТАНИ (STATE) КОМПОНЕНТА ==========
  
  // Список товарів (отримуємо з API)
  const [inventory, setInventory] = useState([]);
  
  // Стан завантаження (показуємо спінер, поки йдуть запити)
  const [loading, setLoading] = useState(true);
  
  // Стан помилки (якщо щось пішло не так)
  const [error, setError] = useState(null);
  
  // Чи показувати форму додавання/редагування
  const [showForm, setShowForm] = useState(false);
  
  // Чи показувати модальне вікно перегляду
  const [showModal, setShowModal] = useState(false);
  
  // Чи показувати модальне вікно підтвердження видалення
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Вибраний товар (для перегляду, редагування, видалення)
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Чи в режимі редагування (true - редагування, false - додавання)
  const [isEditing, setIsEditing] = useState(false);

  // ========== ФУНКЦІЯ ЗАВАНТАЖЕННЯ ТОВАРІВ З API ==========
  const loadInventory = async () => {
    try {
      setLoading(true);                    // вмикаємо завантаження
      const data = await getInventory();   // GET /inventory
      setInventory(data);                  // зберігаємо список
      setError(null);                      // скидаємо помилку
    } catch (err) {
      setError('Не вдалося завантажити інвентар');  // показуємо помилку
    } finally {
      setLoading(false);                   // вимикаємо завантаження
    }
  };

  // ========== ЕФЕКТ: ЗАВАНТАЖУЄМО ДАНІ ПРИ ПЕРШОМУ ВІДКРИТТІ ==========
  useEffect(() => {
    loadInventory();   // викликаємо завантаження один раз при монтуванні компонента
  }, []);              // [] - порожній масив залежностей → виконується тільки один раз

  // ========== CREATE (ДОДАВАННЯ) ==========
  const handleCreate = async (formData) => {
    try {
      await createInventory(formData);   // POST /register
      setShowForm(false);                // закриваємо форму
      loadInventory();                   // оновлюємо список
    } catch (err) {
      alert('Помилка створення');        // показуємо помилку
    }
  };

  // ========== ВІДКРИТТЯ ФОРМИ РЕДАГУВАННЯ ==========
  const handleEdit = (item) => {
    setSelectedItem(item);    // запам'ятовуємо товар
    setIsEditing(true);       // вмикаємо режим редагування
    setShowForm(true);        // відкриваємо форму
  };

  // ========== UPDATE (РЕДАГУВАННЯ) ==========
  const handleUpdate = async (formData) => {
    try {
      // 1. ОНОВЛЮЄМО ТЕКСТОВІ ДАНІ (PUT /inventory/:id)
      await updateInventory(selectedItem.id, {
        inventory_name: formData.get('inventory_name'),
        description: formData.get('description'),
      });
      
      // 2. ЯКЩО Є НОВЕ ФОТО — ОНОВЛЮЄМО ЙОГО (PUT /inventory/:id/photo)
      if (formData.get('photo') && formData.get('photo').size > 0) {
        const photoData = new FormData();
        photoData.append('photo', formData.get('photo'));
        await updateInventoryPhoto(selectedItem.id, photoData);
      }
      
      setShowForm(false);       // закриваємо форму
      setSelectedItem(null);    // скидаємо вибраний товар
      setIsEditing(false);      // вимикаємо режим редагування
      loadInventory();          // оновлюємо список
    } catch (err) {
      alert('Помилка оновлення');
    }
  };

  // ========== DELETE (ВИДАЛЕННЯ) ==========
  const handleDelete = async () => {
    try {
      await deleteInventory(selectedItem.id);   // DELETE /inventory/:id
      setShowConfirm(false);                    // закриваємо confirm-модалку
      setSelectedItem(null);                    // скидаємо вибраний товар
      loadInventory();                          // оновлюємо список
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  // ========== READ (ПЕРЕГЛЯД) ==========
  const handleView = (item) => {
    setSelectedItem(item);   // запам'ятовуємо товар
    setShowModal(true);      // відкриваємо модальне вікно
  };

  // ========== СТАН ЗАВАНТАЖЕННЯ (LOADING) ==========
  if (loading) {
    return <div className="loading-spinner">Завантаження...</div>;
  }

  // ========== СТАН ПОМИЛКИ (ERROR) ==========
  if (error) {
    return <div className="error-state">{error}</div>;
  }

  // ========== ВІДОБРАЖЕННЯ ІНТЕРФЕЙСУ (JSX) ==========
  return (
    <div className="admin-page">
      
      {/* ===== ВЕРХНЯ ПАНЕЛЬ: ЗАГОЛОВОК + КНОПКА "ДОДАТИ" ===== */}
      <div className="page-header">
        <h2>📋 Управління інвентарем</h2>
        <button 
          className="btn-add" 
          onClick={() => { 
            setSelectedItem(null);   // скидаємо вибраний товар
            setIsEditing(false);     // режим додавання (не редагування)
            setShowForm(true);       // відкриваємо форму
          }}
        >
          + Додати позицію
        </button>
      </div>

      {/* ===== ТАБЛИЦЯ З ТОВАРАМИ ===== */}
      <InventoryTable
        items={inventory}                                    // список товарів
        onView={handleView}                                  // перегляд
        onEdit={handleEdit}                                  // редагування
        onDelete={(item) => { setSelectedItem(item); setShowConfirm(true); }}  // видалення
      />

      {/* ===== ФОРМА ДОДАВАННЯ/РЕДАГУВАННЯ (МОДАЛЬНЕ ВІКНО) ===== */}
      {showForm && (
        <InventoryForm
          onSubmit={isEditing ? handleUpdate : handleCreate}  // різна функція залежно від режиму
          onClose={() => { 
            setShowForm(false); 
            setSelectedItem(null); 
            setIsEditing(false); 
          }}
          initialData={isEditing ? selectedItem : null}      // дані для редагування
        />
      )}

      {/* ===== МОДАЛЬНЕ ВІКНО ДЛЯ ПЕРЕГЛЯДУ ===== */}
      {showModal && (
        <InventoryModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedItem(null); }}
          item={selectedItem}
        />
      )}

      {/* ===== МОДАЛЬНЕ ВІКНО ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ ===== */}
      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => { setShowConfirm(false); setSelectedItem(null); }}
          onConfirm={handleDelete}
          title="Підтвердження видалення"
          message={`Ви впевнені, що хочете видалити "${selectedItem?.inventory_name}"?`}
        />
      )}
    </div>
  );
}

// ЕКСПОРТУЄМО КОМПОНЕНТ
export default AdminPage;