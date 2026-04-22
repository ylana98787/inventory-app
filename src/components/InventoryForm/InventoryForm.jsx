// ІМПОРТУЄМО ХУК useState ДЛЯ РОБОТИ ЗІ СТАНОМ
import { useState } from 'react';

// КОМПОНЕНТ ФОРМИ ДЛЯ ДОДАВАННЯ/РЕДАГУВАННЯ ІНВЕНТАРЮ
// Приймає 3 параметри (props):
// - onSubmit    : функція, яка викликається при відправці форми (create або update)
// - onClose     : функція, яка закриває форму (при натисканні "Скасувати" або хрестик)
// - initialData : дані для редагування (якщо є - це режим редагування, якщо немає - додавання)
function InventoryForm({ onSubmit, onClose, initialData }) {
  
  // СТАН ДЛЯ ДАНИХ ФОРМИ
  // Якщо initialData є (режим редагування) → беремо звідти, інакше → пусті значення
  const [formData, setFormData] = useState({
    inventory_name: initialData?.inventory_name || '',  // назва (обов'язкове)
    description: initialData?.description || '',        // опис (необов'язкове)
    photo: null,                                        // фото (файл)
  });
  
  // СТАН ДЛЯ ПОМИЛОК ВАЛІДАЦІЇ
  const [errors, setErrors] = useState({});
  
  // СТАН ДЛЯ ВІДПРАВКИ (щоб не можна було натиснути кнопку двічі)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== ФУНКЦІЯ ВАЛІДАЦІЇ (перевірка обов'язкових полів) ==========
  const validate = () => {
    const newErrors = {};  // пустий об'єкт для помилок
    
    // ПЕРЕВІРКА НАЗВИ (обов'язкове поле)
    if (!formData.inventory_name.trim()) {
      newErrors.inventory_name = 'Назва обов\'язкова';  // додаємо помилку
    }
    
    // ПЕРЕВІРКА ФОТО (тільки при ДОДАВАННІ, не при редагуванні)
    // Якщо це НЕ редагування (!initialData) І фото не вибране → помилка
    if (!initialData && !formData.photo) {
      newErrors.photo = 'Фото обов\'язкове';
    }
    
    // ЗБЕРІГАЄМО ПОМИЛКИ В СТАН
    setErrors(newErrors);
    
    // ПОВЕРТАЄМО true, ЯКЩО ПОМИЛОК НЕМАЄ (довжина об'єкта = 0)
    return Object.keys(newErrors).length === 0;
  };

  // ========== ФУНКЦІЯ ВІДПРАВКИ ФОРМИ ==========
  const handleSubmit = async (e) => {
    // ЗАБОРОНЯЄМО ПЕРЕЗАВАНТАЖЕННЯ СТОРІНКИ
    e.preventDefault();
    
    // ПЕРЕВІРЯЄМО ВАЛІДАЦІЮ. Якщо не пройшла → виходимо
    if (!validate()) return;

    // ВМИКАЄМО РЕЖИМ ВІДПРАВКИ (кнопка стає неактивною)
    setIsSubmitting(true);
    
    // СТВОРЮЄМО ОБ'ЄКТ FormData ДЛЯ ВІДПРАВКИ ДАНИХ (включно з файлом)
    const submitData = new FormData();
    submitData.append('inventory_name', formData.inventory_name);  // додаємо назву
    submitData.append('description', formData.description);        // додаємо опис
    if (formData.photo) submitData.append('photo', formData.photo); // додаємо фото (якщо є)

    // ВИКЛИКАЄМО ФУНКЦІЮ onSubmit (передану з AdminPage)
    // Вона може бути handleCreate (додавання) або handleUpdate (редагування)
    await onSubmit(submitData);
    
    // ВИМИКАЄМО РЕЖИМ ВІДПРАВКИ
    setIsSubmitting(false);
  };

  // ========== ФУНКЦІЯ ДЛЯ ОБРОБКИ ЗМІНИ ПОЛІВ ==========
  const handleChange = (e) => {
    const { name, value, files } = e.target;  // отримуємо дані з поля
    
    // ЯКЩО ЦЕ ПОЛЕ "ФОТО" (type="file")
    if (name === 'photo') {
      const file = files[0];  // беремо перший (і єдиний) файл
      if (file) {
        // ПЕРЕВІРКА РОЗМІРУ ФАЙЛУ (не більше 2MB = 2 * 1024 * 1024 байт)
        if (file.size > 2 * 1024 * 1024) {
          alert('Файл занадто великий. Максимум 2MB');
          return;  // виходимо, не зберігаємо файл
        }
        // ПЕРЕВІРКА ТИПУ ФАЙЛУ (повинно бути зображення)
        if (!file.type.startsWith('image/')) {
          alert('Будь ласка, виберіть зображення');
          return;  // виходимо, не зберігаємо файл
        }
        // ЗБЕРІГАЄМО ФАЙЛ В СТАН
        setFormData({ ...formData, photo: file });
      }
    } 
    // ЯКЩО ЦЕ ЗВИЧАЙНЕ ПОЛЕ (назва або опис)
    else {
      // ОНОВЛЮЄМО ВІДПОВІДНЕ ПОЛЕ В СТАНІ
      setFormData({ ...formData, [name]: value });
    }
  };

  // ========== ВІДОБРАЖЕННЯ ФОРМИ (JSX) ==========
  return (
    // ПІДЛОЖКА (темний фон) - при кліку закриває форму
    <div className="modal-overlay" onClick={onClose}>
      
      {/* ОСНОВНА ФОРМА */}
      {/* e.stopPropagation() - клік на форму не закриває її */}
      <form className="inventory-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        
        {/* КНОПКА ЗАКРИТТЯ (хрестик) */}
        <button className="modal-close" type="button" onClick={onClose}>×</button>
        
        {/* ЗАГОЛОВОК: "Додати інвентар" або "Редагувати" */}
        <h2>{initialData ? 'Редагувати' : 'Додати інвентар'}</h2>
        
        {/* ===== ПОЛЕ "НАЗВА" (обов'язкове) ===== */}
        <div className="form-group">
          <label>Назва *</label>
          <input
            type="text"
            name="inventory_name"
            value={formData.inventory_name}
            onChange={handleChange}
            className={errors.inventory_name ? 'error' : ''}  // червона рамка, якщо помилка
          />
          {/* ПОКАЗУЄМО ПОВІДОМЛЕННЯ ПРО ПОМИЛКУ, ЯКЩО ВОНА Є */}
          {errors.inventory_name && <span className="error-text">{errors.inventory_name}</span>}
        </div>

        {/* ===== ПОЛЕ "ОПИС" (необов'язкове) ===== */}
        <div className="form-group">
          <label>Опис</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* ===== ПОЛЕ "ФОТО" (файл) ===== */}
        <div className="form-group">
          <label>Фото</label>
          <input 
            type="file" 
            name="photo" 
            onChange={handleChange} 
            accept="image/*"  // дозволяємо вибирати тільки зображення
          />
          {errors.photo && <span className="error-text">{errors.photo}</span>}
        </div>

        {/* ===== КНОПКИ ФОРМИ ===== */}
        <div className="form-buttons">
          {/* КНОПКА "СКАСУВАТИ" - закриває форму */}
          <button type="button" className="btn-cancel" onClick={onClose}>
            Скасувати
          </button>
          
          {/* КНОПКА "ДОДАТИ" АБО "ЗБЕРЕГТИ" */}
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isSubmitting}  // блокуємо під час відправки
          >
            {isSubmitting 
              ? 'Збереження...'                    // текст під час відправки
              : (initialData ? 'Зберегти' : 'Додати')  // текст залежно від режиму
            }
          </button>
        </div>
      </form>
    </div>
  );
}

// ЕКСПОРТУЄМО КОМПОНЕНТ
export default InventoryForm;