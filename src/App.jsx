import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<Navigate to="/admin" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;