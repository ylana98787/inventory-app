// ІМПОРТ КОМПОНЕНТІВ ДЛЯ МАРШРУТИЗАЦІЇ З REACT ROUTER
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ІМПОРТ КОМПОНЕНТІВ, ЯКІ БУДУТЬ ВІДОБРАЖАТИСЯ НА РІЗНИХ СТОРІНКАХ
import Layout from './components/Layout/Layout';     // шапка + обгортка
import AdminPage from './pages/AdminPage';          // адмін-панель (Лаб 7)
import GalleryPage from './pages/GalleryPage';      // галерея (Лаб 8)
import FavoritesPage from './pages/FavoritesPage';  // улюблені (Лаб 8)

// ІМПОРТ ГЛОБАЛЬНИХ СТИЛІВ
import './App.css';

// ГОЛОВНИЙ КОМПОНЕНТ ДОДАТКУ
// Він відповідає за те, яка сторінка буде показана залежно від URL
function App() {
  return (
    // ОБГОРТКА ДЛЯ МАРШРУТИЗАЦІЇ
    // Без BrowserRouter маршрути НЕ ПРАЦЮВАТИМУТЬ
    // Він синхронізує URL з інтерфейсом
    <BrowserRouter>
      
      {/* LAYOUT - ОБГОРТКА З ШАПКОЮ ТА НАВІГАЦІЄЮ */}
      {/* Він буде спільним для ВСІХ сторінок */}
      <Layout>
        
        {/* КОНТЕЙНЕР ДЛЯ ВСІХ МАРШРУТІВ */}
        {/* Всередині можуть бути тільки <Route> */}
        <Routes>
          
          {/* МАРШРУТ ДЛЯ АДМІН-ПАНЕЛІ */}
          {/* path="/admin" - коли URL закінчується на /admin */}
          {/* element={<AdminPage />} - показуємо компонент AdminPage */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* МАРШРУТ ДЛЯ ГОЛОВНОЇ СТОРІНКИ (ГАЛЕРЕЯ) */}
          {/* path="/" - кореневий URL (наприклад, http://localhost:5173/) */}
          <Route path="/" element={<GalleryPage />} />
          
          {/* МАРШРУТ ДЛЯ СТОРІНКИ УЛЮБЛЕНИХ */}
          <Route path="/favorites" element={<FavoritesPage />} />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// ЕКСПОРТУЄМО КОМПОНЕНТ ДЛЯ ВИКОРИСТАННЯ В main.jsx
export default App;