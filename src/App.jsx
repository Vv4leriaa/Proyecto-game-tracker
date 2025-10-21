import "./App.css";

export default function App() {
  const games = [
    { title: "Hades II", platform: "PC", progress: "94%", cover: "https://via.placeholder.com/120x150?text=Hades+II" },
    { title: "Indiana Jones and the Great Circle", platform: "PC", progress: "100%", cover: "https://via.placeholder.com/120x150?text=Indiana+Jones" },
    { title: "The Legend of Zelda", platform: "Switch", progress: "45%", cover: "https://via.placeholder.com/120x150?text=Zelda" },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Game Tracker</h2>
        <div className="stats">
          <div className="stat-item">
            <span className="count">39</span>
            <span>All</span>
          </div>
          <div className="stat-item">
            <span className="count">2</span>
            <span>Spaces</span>
          </div>
        </div>
        <div className="section">
          <h3>Currently playing</h3>
          {games.slice(0, 2).map((g, i) => (
            <div key={i} className="current-game">
              <img src={g.cover} alt={g.title} />
              <div>
                <h4>{g.title}</h4>
                <p>{g.progress} left</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="main">
        <h3>All games</h3>
        <div className="game-grid">
          {games.map((g, i) => (
            <div key={i} className="game-card">
              <img src={g.cover} alt={g.title} />
              <h4>{g.title}</h4>
              <span className="platform">{g.platform}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Center modal */}
      <div className="modal">
        <div className="modal-header">
          <button>✕</button>
          <div className="actions">⚙️ Actions…</div>
        </div>
        <div className="modal-content">
          <img src="https://via.placeholder.com/150x200?text=Indiana+Jones" alt="Indiana Jones" />
          <h3>Indiana Jones and the Great Circle</h3>
          <p>Bethesda Softworks</p>
          <p>Adventure, Puzzle</p>
          <div className="rating">
            <span>❤️ 85.2</span>
            <button className="rate">Rate it</button>
          </div>
        </div>
      </div>
    </div>
  );
}

