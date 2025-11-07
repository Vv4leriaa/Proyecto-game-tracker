import React, { useState } from "react";
import "./App.css";

/* App.js - GameTracker frontend
   - Sidebar always visible on desktop; collapsible on mobile via hamburger.
   - Sections: Inicio, Mis Juegos, Progreso, Agregar, Reseñas, Configuración.
   - Modal para agregar nuevo juego.
   - Modal para ver detalles de un juego.
   - Los assets (imágenes) se cargan desde /assets/... colocadas en public/assets.
*/

function Sidebar({ open, onNavigate, active, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-top">
        <h1>Game Tracker</h1>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={active === "inicio" ? "active" : ""} onClick={() => { onNavigate("inicio"); onClose && onClose(); }}>
            Inicio
          </li>
          <li className={active === "mis-juegos" ? "active" : ""} onClick={() => { onNavigate("mis-juegos"); onClose && onClose(); }}>
            Mis Juegos
          </li>
          <li className={active === "progreso" ? "active" : ""} onClick={() => { onNavigate("progreso"); onClose && onClose(); }}>
            Progreso
          </li>
          <li className={active === "agregar" ? "active" : ""} onClick={() => { onNavigate("agregar"); onClose && onClose(); }}>
            Agregar Juego
          </li>
          <li className={active === "reseñas" ? "active" : ""} onClick={() => { onNavigate("reseñas"); onClose && onClose(); }}>
            Reseñas
          </li>
          <li className={active === "config" ? "active" : ""} onClick={() => { onNavigate("config"); onClose && onClose(); }}>
            Configuración
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="stats-pill">
          <span>{/* icon placeholder */}🎮</span>
          <div>
            <div className="small">All</div>
            <div className="bold">10</div>
          </div>
        </div>

        <div className="credits">
          <small>Creado por</small>
          <div>Alina Ibarra & Valeria Jugacho</div>
          <small>Jóvenes Creativos 2025</small>
        </div>
      </div>
    </aside>
  );
}

function GameCard({ game, onClick }) {
  return (
    <div className="game-card" onClick={() => onClick(game)}>
      <div className="cover-wrap">
        <img className="game-cover" src={game.cover} alt={game.title} />
      </div>
      <div className="game-info">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-platform">{game.platform}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: game.progress }} />
        </div>
        <div className="game-meta">
          <div className="rating">⭐ {game.rating ?? "-"}/5</div>
          <div className="progress-text">{game.progress}</div>
        </div>
      </div>
    </div>
  );
}

function AddGameModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    platform: "",
    progress: "0%",
    cover: "",
    rating: 3,
    review: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    // normalize progress
    let progress = form.progress.toString();
    if (!progress.endsWith("%")) progress = progress + "%";
    const newGame = { ...form, progress };
    onAdd(newGame);
    setForm({ title: "", platform: "", progress: "0%", cover: "", rating: 3, review: "" });
    onClose();
  }

  if (!open) return null;
  return (
    <div className="modal">
      <div className="modal-content add-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>Agregar Nuevo Juego</h3>
        <form onSubmit={submit} className="add-form">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Título" required />
          <input name="platform" value={form.platform} onChange={handleChange} placeholder="Plataforma (PC, Switch, Mobile...)" required />
          <input name="progress" value={form.progress} onChange={handleChange} placeholder="Progreso (ej. 80%)" />
          <input name="cover" value={form.cover} onChange={handleChange} placeholder="URL de la imagen (o /assets/miimagen.jpg)" required />
          <label className="label">Puntuación (1-5)</label>
          <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} />
          <textarea name="review" value={form.review} onChange={handleChange} placeholder="Escribe una reseña breve..." />
          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary">Agregar Juego</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailModal({ game, onClose }) {
  if (!game) return null;
  return (
    <div className="modal">
      <div className="modal-content detail-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <img src={game.cover} className="detail-cover" alt={game.title} />
        <h2>{game.title}</h2>
        <p className="muted">{game.platform}</p>
        <div className="detail-meta">
          <div>⭐ {game.rating ?? "-"}/5</div>
          <div>{game.progress}</div>
        </div>
        <p className="review">{game.review || "Sin reseña"}</p>
      </div>
    </div>
  );
}

export default function App() {
  // initial 10 games (use public/assets/... or full URLs)
  const initialGames = [
    { 
      title: "Free Fire", 
      platform: "Mobile", 
      progress: "85%", 
      cover: "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2021/04/free-fire-codigos-gratis-2290285.jpg?tf=1200x1200", 
      rating: 4, 
      review: "Adictivo y competitivo." 
    },
    { 
      title: "Fortnite", 
      platform: "PC", 
      progress: "90%", 
      cover: "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2018/05/fortnite-cover.jpg", 
      rating: 5, 
      review: "Excelente jugabilidad y gráficos." 
    },
    { 
      title: "Roblox", 
      platform: "PC", 
      progress: "70%", 
      cover: "https://static0.makeuseofimages.com/wordpress/wp-content/uploads/2020/11/roblox.jpg", 
      rating: 3, 
      review: "Muy creativo para niños y jóvenes." 
    },
    { 
      title: "Indiana Jones and the Great Circle", 
      platform: "PC", 
      progress: "100%", 
      cover: "https://cdn.sanity.io/images/ko0ytj5o/production/cfccdef8dcab003a3d39417bf627f15d749aa0c6-1524x1958.png?w=1024", 
      rating: 5, 
      review: "Historia impresionante." 
    },
    { 
      title: "Hades II", 
      platform: "PC", 
      progress: "94%", 
      cover: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/store/software/switch2/70010000105526/75473d99ae0d87abda2bf0979c0886a78a1ec9debd46fa77b6c5f19b9c7ab175", 
      rating: 5, 
      review: "Desafiante y visualmente espectacular." 
    },
    { 
      title: "The Legend of Zelda: Tears of the Kingdom", 
      platform: "Switch", 
      progress: "45%", 
      cover: "https://phantom.estaticos-marca.com/4686023be74228acb58e446e4c5f3ef1/resize/828/f/jpg/assets/multimedia/imagenes/2024/09/26/17273458124026.jpg", 
      rating: 4, 
      review: "Una obra maestra de aventura." 
    },
    { 
      title: "Call of Duty: Warzone", 
      platform: "PC", 
      progress: "60%", 
      cover: "https://i0.wp.com/seven.com.ec/wp-content/uploads/2022/03/0001-call_of_duty_warzone-seven_ecuador-videojuegos-gamers-juegos-0001.jpg?fit=1920%2C1080&ssl=1", 
      rating: 4, 
      review: "Acción intensa en cada partida." 
    },
    { 
      title: "Minecraft", 
      platform: "PC", 
      progress: "80%", 
      cover: "https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png", 
      rating: 5, 
      review: "Creatividad sin límites." 
    },
    { 
      title: "Valorant", 
      platform: "PC", 
      progress: "75%", 
      cover: "https://assets-prd.ignimgs.com/2021/12/21/valorant-1640045685890.jpg?crop=1%3A1%2Csmart&width=348&height=348&format=jpg&auto=webp&quality=80", 
      rating: 4, 
      review: "Competitivo y adictivo." 
    },
    { 
      title: "League of Legends", 
      platform: "PC", 
      progress: "50%", 
      cover: "https://fotos.perfil.com/2022/02/01/trim/1140/641/conoce-todos-los-detalles-acerca-de-lol-y-enterate-como-se-juega-1306879.jpg", 
      rating: 3, 
      review: "Estrategia y trabajo en equipo." 
    }
  ];

  const [games, setGames] = useState(initialGames);
  const [sidebarOpen, setSidebarOpen] = useState(true); // visible by default (desktop)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [section, setSection] = useState("mis-juegos");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  function handleAddGame(newGame) {
    const progress = newGame.progress && String(newGame.progress).endsWith("%") ? newGame.progress : `${newGame.progress}%`;
    setGames(prev => [...prev, { ...newGame, progress }]);
  }

  const stats = {
    total: games.length,
    avgRating: (games.reduce((acc, g) => acc + Number(g.rating || 0), 0) / games.length).toFixed(1),
    mostComplete: (games.reduce((max, g) => (parseInt(g.progress) > parseInt(max.progress) ? g : max), games[0]) || {}).title
  };

  return (
    <div className="app">
      <button
        className="hamburger"
        aria-label="Abrir menú"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        ☰
      </button>

      <Sidebar
        open={sidebarOpen || mobileSidebarOpen}
        onNavigate={(s) => {
          setSection(s);
          setMobileSidebarOpen(false);
          if (s === "agregar") setAddModalOpen(true);
        }}
        active={section}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main
        className="main-content"
        style={{ width: "calc(100% - 280px)", height: "100vh", overflowY: "auto" }}
      >
        {section === "inicio" && (
          <section>
            <div className="hero">
              <div>
                <h2>Bienvenida a Game Tracker</h2>
                <p>Gestiona tus juegos, registra progreso, escribe reseñas y puntúa tus favoritos.</p>
                <div className="hero-actions">
                  <button className="btn primary" onClick={() => { setSection("mis-juegos"); }}>Ver Mis Juegos</button>
                  <button className="btn ghost" onClick={() => { setAddModalOpen(true); }}>Agregar Juego</button>
                </div>
              </div>

              <div className="summary-cards">
                <div className="card small">
                  <div>Total</div>
                  <div className="big">{games.length}</div>
                </div>
                <div className="card small">
                  <div>Puntuación Promedio</div>
                  <div className="big">⭐ {stats.avgRating}</div>
                </div>
                <div className="card small">
                  <div>Mayor progreso</div>
                  <div className="big">{stats.mostComplete}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {section === "mis-juegos" && (
          <section>
            <h2>Mis Juegos</h2>
            <div className="game-grid">
              {games.map((g, i) => (
                <GameCard key={i} game={g} onClick={(game) => setSelectedGame(game)} />
              ))}
            </div>
          </section>
        )}

        {section === "progreso" && (
          <section>
            <h2>Progreso</h2>
            <div className="progress-list">
              {games.map((g, i) => (
                <div className="progress-item" key={i}>
                  <img src={g.cover} alt={g.title} />
                  <div className="pi-body">
                    <h4>{g.title}</h4>
                    <div className="progress-bar small">
                      <div className="progress-fill" style={{ width: g.progress }} />
                    </div>
                    <div className="pi-meta">
                      <span>{g.progress}</span>
                      <span>⭐ {g.rating}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {section === "agregar" && (
          <section>
            <h2>Agregar Juego</h2>
            <p>Puedes agregar un juego usando el botón o el formulario rápido.</p>
            <button className="btn primary" onClick={() => setAddModalOpen(true)}>Abrir formulario</button>
          </section>
        )}

        {section === "reseñas" && (
          <section>
            <h2>Reseñas</h2>
            <div className="reviews-grid">
              {games.map((g, i) => (
                <div className="review-card" key={i}>
                  <div className="rc-head">
                    <img src={g.cover} alt={g.title} />
                    <div>
                      <h4>{g.title}</h4>
                      <div className="muted">{g.platform} • ⭐ {g.rating}/5</div>
                    </div>
                  </div>
                  <p className="rc-body">{g.review || "Sin reseña"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {section === "config" && (
          <section>
            <h2>Configuración</h2>
            <p>Aquí puedes ajustar preferencias (tema, notificaciones y más).</p>
            <div className="settings">
              <label><input type="checkbox" defaultChecked /> Notificaciones activas</label>
              <label><input type="checkbox" /> Guardar automáticamente (backend)</label>
            </div>
          </section>
        )}
      </main>

      <footer className="page-footer">
        <span>Creado por Alina Ibarra & Valeria Jugacho — Jóvenes Creativos 2025</span>
      </footer>

      <AddGameModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={(g) => {
          handleAddGame(g);
          setSection("mis-juegos");
        }}
      />

      <DetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
