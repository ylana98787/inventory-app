const API_URL = 'http://localhost:5173/'; // Змініть на ваш API URL

// Отримати всі позиції інвентарю
export const getInventory = async () => {
  const response = await fetch(`${API_URL}/inventory`);
  if (!response.ok) throw new Error('Помилка завантаження');
  return response.json();
};

// Отримати одну позицію за ID
export const getInventoryById = async (id) => {
  const response = await fetch(`${API_URL}/inventory/${id}`);
  if (!response.ok) throw new Error('Помилка завантаження');
  return response.json();
};

// Додати нову позицію
export const createInventory = async (formData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Помилка створення');
  return response.json();
};

// Оновити текстові дані
export const updateInventory = async (id, data) => {
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Помилка оновлення');
  return response.json();
};

// Оновити фото
export const updateInventoryPhoto = async (id, formData) => {
  const response = await fetch(`${API_URL}/inventory/${id}/photo`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) throw new Error('Помилка оновлення фото');
  return response.json();
};

// Видалити позицію
export const deleteInventory = async (id) => {
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Помилка видалення');
  return response.json();
};