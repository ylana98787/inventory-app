import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <h1>🏭 Система управління складом</h1>
        <nav>
          <Link to="/">🎨 Галерея</Link>
          <Link to="/favorites">❤️ Улюблені</Link>
          <Link to="/admin">⚙️ Адмін-панель</Link>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;