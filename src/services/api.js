// АДРЕСА НАШОГО API (куди будуть надсилатися запити)
// http://localhost:3001 - це сервер json-server, який запущений локально
const API_URL = 'http://localhost:3001';

// ФУНКЦІЯ ДЛЯ ЗМЕНШЕННЯ ФОТО ТА КОНВЕРТАЦІЇ В BASE64
// Приймає файл (photo) і повертає текстовий рядок base64
const resizeAndConvertToBase64 = (file) => {
  // Promise - це об'єкт, який "обіцяє" виконати асинхронну операцію
  // resolve - якщо все добре, reject - якщо помилка
  return new Promise((resolve, reject) => {
    
    // FileReader - це вбудований об'єкт для читання файлів
    const reader = new FileReader();
    
    // Читаємо файл як URL (перетворюємо в base64)
    reader.readAsDataURL(file);
    
    // Коли файл прочитаний успішно
    reader.onload = (event) => {
      
      // Створюємо нове зображення в пам'яті
      const img = new Image();
      
      // Встановлюємо джерело зображення (те, що прочитали)
      img.src = event.target.result;
      
      // Коли зображення завантажилося
      img.onload = () => {
        
        // Створюємо canvas (невидиме полотно для малювання)
        const canvas = document.createElement('canvas');
        
        // МАКСИМАЛЬНІ РОЗМІРИ (щоб фото не було занадто великим)
        const MAX_WIDTH = 150;   // максимальна ширина 150 пікселів
        const MAX_HEIGHT = 150;  // максимальна висота 150 пікселів
        
        // Отримуємо поточні розміри зображення
        let width = img.width;
        let height = img.height;
        
        // ЗМЕНШУЄМО ЗОБРАЖЕННЯ ПРОПОРЦІЙНО
        // Якщо ширина більша за висоту
        if (width > height) {
          // Якщо ширина більша за максимальну
          if (width > MAX_WIDTH) {
            // Зменшуємо висоту пропорційно ширині
            height *= MAX_WIDTH / width;
            // Встановлюємо ширину на максимум
            width = MAX_WIDTH;
          }
        } else {
          // Якщо висота більша за ширину або рівна
          if (height > MAX_HEIGHT) {
            // Зменшуємо ширину пропорційно висоті
            width *= MAX_HEIGHT / height;
            // Встановлюємо висоту на максимум
            height = MAX_HEIGHT;
          }
        }
        
        // Встановлюємо нові розміри canvas
        canvas.width = width;
        canvas.height = height;
        
        // Отримуємо контекст для малювання на canvas
        const ctx = canvas.getContext('2d');
        
        // Малюємо зображення на canvas з новими розмірами
        ctx.drawImage(img, 0, 0, width, height);
        
        // Конвертуємо canvas в base64 рядок
        // 'image/jpeg' - формат, 0.7 - якість (70%)
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        
        // Повертаємо результат (base64 рядок)
        resolve(base64);
      };
      
      // Якщо зображення не завантажилось
      img.onerror = reject;
    };
    
    // Якщо файл не прочитався
    reader.onerror = reject;
  });
};

// ========== GET ЗАПИТИ (отримання даних) ==========

// ОТРИМАТИ ВСІ ПОЗИЦІЇ ІНВЕНТАРЮ
// GET /inventory
export const getInventory = async () => {
  // Робимо GET-запит до API
  const response = await fetch(`${API_URL}/inventory`);
  
  // Якщо відповідь не успішна (не 200) → викидаємо помилку
  if (!response.ok) throw new Error('Помилка завантаження');
  
  // Перетворюємо відповідь у JSON і повертаємо
  return response.json();
};

// ОТРИМАТИ ОДНУ ПОЗИЦІЮ ЗА ID
// GET /inventory/:id
export const getInventoryById = async (id) => {
  // Робимо GET-запит до API з конкретним ID
  const response = await fetch(`${API_URL}/inventory/${id}`);
  
  // Якщо відповідь не успішна → викидаємо помилку
  if (!response.ok) throw new Error('Помилка завантаження');
  
  // Перетворюємо відповідь у JSON і повертаємо
  return response.json();
};

// ========== POST ЗАПИТ (створення нових даних) ==========

// ДОДАТИ НОВУ ПОЗИЦІЮ
// POST /register
export const createInventory = async (formData) => {
  // За замовчуванням фото буде заглушка
  let photoBase64 = 'https://via.placeholder.com/150';
  
  // Отримуємо файл фото з formData
  const file = formData.get('photo');
  
  // Якщо файл існує і не пустий
  if (file && file.size > 0) {
    try {
      // Конвертуємо фото в base64 (зменшене)
      photoBase64 = await resizeAndConvertToBase64(file);
    } catch (err) {
      // Якщо помилка конвертації, виводимо в консоль
      console.error('Помилка конвертації фото:', err);
    }
  }
  
  // Формуємо об'єкт з даними для відправки
  const data = {
    inventory_name: formData.get('inventory_name'), // назва
    description: formData.get('description'),       // опис
    photo_url: photoBase64                          // фото (base64 або заглушка)
  };
  
  // Робимо POST-запит до API
  const response = await fetch(`${API_URL}/inventory`, {
    method: 'POST',                                // тип запиту
    headers: { 'Content-Type': 'application/json' }, // формат даних (JSON)
    body: JSON.stringify(data),                    // перетворюємо дані в JSON
  });
  
  // Якщо помилка → викидаємо
  if (!response.ok) throw new Error('Помилка створення');
  
  // Повертаємо відповідь
  return response.json();
};

// ========== PUT ЗАПИТ (оновлення даних) ==========

// ОНОВИТИ ТЕКСТОВІ ДАНІ ПОЗИЦІЇ
// PUT /inventory/:id
export const updateInventory = async (id, data) => {
  // Робимо PUT-запит до API з конкретним ID
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'PUT',                                 // тип запиту
    headers: { 'Content-Type': 'application/json' }, // формат даних (JSON)
    body: JSON.stringify(data),                    // перетворюємо дані в JSON
  });
  
  // Якщо помилка → викидаємо
  if (!response.ok) throw new Error('Помилка оновлення');
  
  // Повертаємо відповідь
  return response.json();
};

// ========== PATCH ЗАПИТ (часткове оновлення) ==========

// ОНОВИТИ ФОТО ПОЗИЦІЇ
// PUT /inventory/:id/photo
export const updateInventoryPhoto = async (id, formData) => {
  // Спочатку photoBase64 = null (не змінюємо фото)
  let photoBase64 = null;
  
  // Отримуємо файл фото з formData
  const file = formData.get('photo');
  
  // Якщо файл існує і не пустий
  if (file && file.size > 0) {
    try {
      // Конвертуємо фото в base64 (зменшене)
      photoBase64 = await resizeAndConvertToBase64(file);
    } catch (err) {
      // Якщо помилка, виводимо в консоль
      console.error('Помилка конвертації фото:', err);
    }
  }
  
  // Якщо фото отримали
  if (photoBase64) {
    // Робимо PATCH-запит (часткове оновлення) до API
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PATCH',                              // часткове оновлення
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_url: photoBase64 }), // оновлюємо тільки фото
    });
    return response.json();
  }
  
  // Якщо фото не було, просто повертаємо успіх
  return { success: true };
};

// ========== DELETE ЗАПИТ (видалення даних) ==========

// ВИДАЛИТИ ПОЗИЦІЮ
// DELETE /inventory/:id
export const deleteInventory = async (id) => {
  // Робимо DELETE-запит до API
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'DELETE',                              // тип запиту
  });
  
  // Якщо помилка → викидаємо
  if (!response.ok) throw new Error('Помилка видалення');
  
  // Повертаємо відповідь
  return response.json();
};