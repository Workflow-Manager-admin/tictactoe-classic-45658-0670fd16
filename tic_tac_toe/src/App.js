import React from 'react';
import './App.css';
import TicTacToeClassic from './TicTacToeClassic';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" disabled style={{ opacity: 0.7 }}>
              TicTacToe
            </button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 120 }}>
          <TicTacToeClassic />
        </div>
      </main>
    </div>
  );
}

export default App;