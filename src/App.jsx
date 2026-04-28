import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AdminPage from './pages/AdminPage';
import GalleryPage from './pages/GalleryPage';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<GalleryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;