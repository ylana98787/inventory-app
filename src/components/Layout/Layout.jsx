import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <h1>🏭 Адмін-панель складу</h1>
        <nav>
          <Link to="/admin">📦 Інвентар</Link>
          <Link to="/">🎨 Галерея</Link>
          <Link to="/favorites">❤️ Улюблені</Link>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;