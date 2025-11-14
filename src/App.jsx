import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------ COMPONENTES ------------- */

function Sidebar({ open, onNavigate, active, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-top">
        <h1>Game Tracker</h1>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={active === "inicio" ? "active" : ""} onClick={() => { onNavigate("inicio"); onClose(); }}>Inicio</li>
          <li className={active === "mis-juegos" ? "active" : ""} onClick={() => { onNavigate("mis-juegos"); onClose(); }}>Mis Juegos</li>
          <li className={active === "progreso" ? "active" : ""} onClick={() => { onNavigate("progreso"); onClose(); }}>Progreso</li>
          <li className={active === "agregar" ? "active" : ""} onClick={() => { onNavigate("agregar"); onClose(); }}>Agregar Juego</li>
          <li className={active === "reseñas" ? "active" : ""} onClick={() => { onNavigate("reseñas"); onClose(); }}>Reseñas</li>
          <li className={active === "config" ? "active" : ""} onClick={() => { onNavigate("config"); onClose(); }}>Configuración</li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="credits">
          <small>Creado por</small>
          <div>Alina Ibarra & Valeria Jugacho</div>
          <small>Jóvenes Creativos 2025</small>
        </div>
      </div>
    </aside>
  );
}

function GameCard({ game, onClick, onEdit, onDelete }) {
  return (
    <div className="game-card">
      <div className="cover-wrap" onClick={() => onClick(game)}>
        <img className="game-cover" src={game.cover} alt={game.title} />
      </div>
      <div className="game-info">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-platform">{game.platform}</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: game.progress }}></div>
        </div>

        <div className="game-meta">
          <div>⭐ {game.rating}/5</div>
          <div>{game.progress}</div>
        </div>

        <div className="card-actions">
          <button className="btn edit-btn" onClick={() => onEdit(game)}>Editar</button>
          <button className="btn delete-btn" onClick={() => onDelete(game._id)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function AddGameModal({ open, onClose, onAdd, editGame }) {
  const [form, setForm] = useState({
    title: "",
    platform: "",
    progress: "0%",
    cover: "",
    rating: 3,
    review: "",
  });

  useEffect(() => {
    if (editGame) {
      setForm({
        title: editGame.title,
        platform: editGame.platform,
        progress: editGame.progress,
        cover: editGame.cover,
        rating: editGame.rating,
        review: editGame.review,
      });
    }
  }, [editGame]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    let progress = form.progress;
    if (!progress.endsWith("%")) progress += "%";

    const payload = { ...form, progress };
    await onAdd(payload, editGame?._id);

    setForm({ title: "", platform: "", progress: "0%", cover: "", rating: 3, review: "" });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal-content add-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>{editGame ? "Editar Juego" : "Agregar Nuevo Juego"}</h3>

        <form onSubmit={submit} className="add-form">
          <input name="title" required value={form.title} onChange={handleChange} placeholder="Título" />
          <input name="platform" required value={form.platform} onChange={handleChange} placeholder="Plataforma" />
          <input name="progress" value={form.progress} onChange={handleChange} placeholder="Progreso (ej. 80%)" />
          <input name="cover" required value={form.cover} onChange={handleChange} placeholder="URL de la imagen" />

          <label>Puntuación (1-5)</label>
          <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} />

          <textarea name="review" value={form.review} onChange={handleChange} placeholder="Escribe una reseña breve..." />

          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary">{editGame ? "Guardar Cambios" : "Agregar"}</button>
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
          <div>⭐ {game.rating}/5</div>
          <div>{game.progress}</div>
        </div>
        <p>{game.review || "Sin reseña"}</p>
      </div>
    </div>
  );
}

/* ------------ APP PRINCIPAL ------------- */

export default function App() {
  const [games, setGames] = useState([]);
  const [section, setSection] = useState("inicio");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [editGame, setEditGame] = useState(null);

  /* ---- MENÚ HAMBURGUESA ---- */
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ---- BUSCADOR ---- */
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.platform.toLowerCase().includes(search.toLowerCase()) ||
    g.review.toLowerCase().includes(search.toLowerCase())
  );

  /* ---- CARGAR JUEGOS ---- */
  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch("http://localhost:5000/api/games");
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error("Error cargando juegos", err);
      }
    }
    loadGames();
  }, []);

  /* ---- AGREGAR / EDITAR ---- */
  async function handleAddGame(game, id) {
    try {
      if (id) {
        const res = await fetch(`http://localhost:5000/api/games/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(game),
        });
        const updated = await res.json();
        setGames(prev => prev.map(g => g._id === id ? updated : g));
      } else {
        const res = await fetch("http://localhost:5000/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(game),
        });
        const saved = await res.json();
        setGames(prev => [...prev, saved]);
      }
    } catch (err) {
      console.error("Error guardando juego", err);
    }
  }

  /* ---- BORRAR ---- */
  async function handleDeleteGame(id) {
    if (!window.confirm("¿Eliminar este juego?")) return;
    try {
      await fetch(`http://localhost:5000/api/games/${id}`, { method: "DELETE" });
      setGames(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error("Error eliminando juego", err);
    }
  }

  /* ---- ESTADISTICAS ---- */
  const stats = {
    total: games.length,
    avgRating: games.length ? (games.reduce((a, g) => a + g.rating, 0) / games.length).toFixed(1) : 0,
    mostComplete: games.length ? games.reduce((max, g) => parseInt(g.progress) > parseInt(max.progress) ? g : max, games[0]).title : "-",
    avgProgress: games.length ? Math.round(games.reduce((a, g) => a + parseInt(g.progress), 0) / games.length) : 0,
    fiveStars: games.filter(g => g.rating === 5).length,
  };

  return (
    <div className="app">

      {/* ---------------------- MENÚ HAMBURGUESA ---------------------- */}
      <button
        className="hamburger"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        ☰
      </button>

      {/* ---------------------- SIDEBAR ---------------------- */}
      <Sidebar
        open={mobileSidebarOpen}
        active={section}
        onClose={() => setMobileSidebarOpen(false)}
        onNavigate={(s) => {
          setSection(s);
          if (s === "agregar") {
            setEditGame(null);
            setAddModalOpen(true);
          }
        }}
      />

      {/* ---------------------- CONTENIDO PRINCIPAL ---------------------- */}
      <main className="main-content">

        {/* ---------------- BUSCADOR SI LA SECCIÓN LO PERMITE ---------------- */}
        {(section === "mis-juegos" || section === "reseñas") && (
          <div className="search-container">
            <button 
              className="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              🔍
            </button>

            {searchOpen && (
              <input
                className="search-bar"
                placeholder="Buscar por título, plataforma o reseña..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
          </div>
        )}

        {/* ---------------------- INICIO ---------------------- */}
        {section === "inicio" && (
          <section className="inicio">
            <h2 className="title">✨ Bienvenido Joven ✨</h2>
            <p className="subtitle">Aquí tienes un resumen de tu mundo gamer</p>

            <div className="stats-grid">
              <div className="stat-card"><h3>{stats.total}</h3><p>Juegos Registrados</p></div>
              <div className="stat-card"><h3>{stats.avgRating}</h3><p>Promedio de Calificación</p></div>
              <div className="stat-card"><h3>{stats.avgProgress}%</h3><p>Progreso Promedio</p></div>
              <div className="stat-card"><h3>{stats.fiveStars}</h3><p>Juegos 5 Estrellas</p></div>
            </div>

            <h3 className="section-title">📊 Progreso Global</h3>

            <div className="progress-global">
              <div className="progress-bar big">
                <div className="progress-fill" style={{ width: stats.avgProgress + "%" }}></div>
              </div>
              <p>{stats.avgProgress}% completado entre todos tus juegos</p>
            </div>

            <h3 className="section-title">🎮 Tus Hábitos Gamer</h3>

            <ul className="habits-list">
              <li>⭐ Te gustan juegos con calificaciones altas</li>
              <li>📈 Sueles avanzar constantemente tus juegos</li>
              <li>🕹️ Juego más avanzado: <strong>{stats.mostComplete}</strong></li>
            </ul>
          </section>
        )}

        {/* ---------------------- JUEGOS ---------------------- */}
        {section === "mis-juegos" && (
          <section>
            <h2>Mis Juegos</h2>
            <div className="game-grid">
              {filteredGames.map(g => (
                <GameCard 
                  key={g._id} 
                  game={g} 
                  onClick={setSelectedGame} 
                  onEdit={(g) => { setEditGame(g); setAddModalOpen(true); }}
                  onDelete={handleDeleteGame}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---------------------- PROGRESO ---------------------- */}
        {section === "progreso" && (
          <section>
            <h2>Progreso</h2>
            <div className="progress-list">
              {games.map(g => (
                <div className="progress-item" key={g._id}>
                  <img src={g.cover} alt={g.title} />
                  <div>
                    <h4>{g.title}</h4>
                    <div className="progress-bar small">
                      <div className="progress-fill" style={{ width: g.progress }}></div>
                    </div>
                    <span>{g.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------------------- AGREGAR ---------------------- */}
        {section === "agregar" && (
          <section>
            <h2>Agregar Juego</h2>
            <button className="btn primary" onClick={() => { setEditGame(null); setAddModalOpen(true); }}>Abrir Formulario</button>
          </section>
        )}

        {/* ---------------------- RESEÑAS ---------------------- */}
        {section === "reseñas" && (
          <section>
            <h2>Reseñas</h2>
            <div className="reviews-grid">
              {filteredGames.map(g => (
                <div className="review-card" key={g._id}>
                  <img src={g.cover} alt={g.title} />
                  <h4>{g.title}</h4>
                  <p>{g.review || "Sin reseña"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ---------------------- MODALES ---------------------- */}
      <AddGameModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddGame} editGame={editGame} />
      <DetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
