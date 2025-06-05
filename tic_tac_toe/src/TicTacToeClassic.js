import React, { useState } from 'react';

// Add Press Start 2P font from Google Fonts
const fontLinkId = 'retro-ttt-press-start2p-font';
if (!document.getElementById(fontLinkId)) {
  const link = document.createElement('link');
  link.id = fontLinkId;
  link.href =
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Add retro style background pattern to body if not present
const retroBgId = 'retro-ttt-bg-style';
if (!document.getElementById(retroBgId)) {
  const retroBgStyle = document.createElement('style');
  retroBgStyle.id = retroBgId;
  retroBgStyle.innerText = `
    body {
      /* Diagonal stripes: PNG pixel pattern, fallback to dark navy */
      background-color: #0a0033;
      background-image: repeating-linear-gradient(
        135deg,
        #181d29 0px,
        #181d29 24px,
        #1adcfc 24px,
        #1adcfc 32px
      );
    }
  `;
  document.head.appendChild(retroBgStyle);
}

// Retro color palette
const retroVars = {
  '--retro-bg': '#0a0033',
  '--retro-panel': '#0d1040',
  '--retro-pink': '#ff4bf5',
  '--retro-cyan': '#41fff2',
  '--retro-blue': '#34adff',
  '--retro-green': '#2fff4b',
  '--retro-yellow': '#ffe94b',
  '--retro-x': '#ffe94b',
  '--retro-o': '#41fff2',
  '--retro-button-bg': '#181d29',
  '--retro-button-hover': '#ff4bf5',
  '--retro-border': '#41fff2',
  '--retro-shadow': '#ff4bf571',
  '--retro-cell-border': '#00ffe9',
  '--retro-font': "'Press Start 2P', 'Courier New', monospace"
};
// Inject retro CSS variables for use in react styles
const retroVarSheetId = 'retro-ttt-css-vars';
if (!document.getElementById(retroVarSheetId)) {
  const sheet = document.createElement('style');
  sheet.id = retroVarSheetId;
  let css = `:root {`;
  for (const key in retroVars) {
    css += `${key}: ${retroVars[key]};`;
  }
  css += '}';
  document.head.appendChild(sheet);
  sheet.innerText = css;
}

// PUBLIC_INTERFACE
/**
 * Main Container for TicTacToe Classic.
 * Two-player game, win/draw detection, restart feature.
 * Retro 90s arcade/pixel theme.
 */
function TicTacToeClassic() {
  // Board is a 9-element array, null = empty, 'X' or 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // true = X's turn, false = O's turn
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // PUBLIC_INTERFACE
  /**
   * Handles a click on a square. Sets value if not taken and game isn't over.
   */
  function handleSquareClick(idx) {
    if (board[idx] || gameOver) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    const theWinner = calculateWinner(newBoard);

    setBoard(newBoard);
    setXIsNext(!xIsNext);

    if (theWinner) {
      setGameOver(true);
      setWinner(theWinner);
    } else if (newBoard.every(Boolean)) {
      setGameOver(true);
      setWinner('draw');
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Resets the board and game state.
   */
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
  }

  // PUBLIC_INTERFACE
  /**
   * Returns a status message: player's turn, win or draw.
   */
  function getStatusMessage() {
    if (winner && winner !== 'draw') {
      return (
        <span
          style={{
            color: winner === 'X' ? 'var(--retro-x)' : 'var(--retro-o)',
            textShadow: '0 2px 8px var(--retro-shadow)'
          }}
        >
          Player <b>{winner}</b> Wins!
        </span>
      );
    }
    if (winner === 'draw') {
      return (
        <span
          style={{
            color: 'var(--retro-yellow)',
            textShadow: '0 2px 8px var(--retro-blue)'
          }}
        >
          It's a draw!
        </span>
      );
    }
    return (
      <span>
        <span style={{ color: '#fff', textShadow: '0 2px 8px #1adcfc55' }}>Your turn: </span>
        <span
          style={{
            color: xIsNext ? 'var(--retro-x)' : 'var(--retro-o)',
            fontWeight: 700,
            textShadow: '0 0px 6px var(--retro-pink)'
          }}
        >
          {xIsNext ? 'X' : 'O'}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-main-container" style={styles.mainContainer}>
      <h1 style={styles.title}>Tic Tac Toe</h1>
      <div className="ttt-board" style={styles.board}>
        {board.map((cell, idx) => (
          <button
            className="ttt-cell"
            key={idx}
            style={{
              ...styles.cell,
              ...(cell === 'X'
                ? styles.cellX
                : cell === 'O'
                ? styles.cellO
                : {})
            }}
            onClick={() => handleSquareClick(idx)}
            aria-label={`cell-${idx}`}
            disabled={!!cell || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>
      <div className="ttt-status" style={styles.status}>
        {getStatusMessage()}
      </div>
      <button
        className="ttt-restart-btn"
        style={styles.restartBtn}
        onClick={handleRestart}
      >
        <span style={{ letterSpacing: '2px' }}>RESTART</span>
      </button>
      <div style={styles.credit}>90's Arcade Theme Mode</div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Checks if someone has won. Returns 'X', 'O', or null.
 */
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

const styles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'var(--retro-panel)',
    border: '6px solid var(--retro-cyan)',
    borderRadius: 12,
    margin: '48px auto',
    boxShadow:
      '0 0 32px 6px var(--retro-pink), 0 0 0 8px var(--retro-blue) inset, 0 2px 12px 0px #01031d99',
    padding: '46px 30px 24px 30px',
    maxWidth: 370,
    color: '#fff',
    minHeight: 540,
    fontFamily: "var(--retro-font)",
    position: 'relative',
  },
  title: {
    fontSize: '2.1rem',
    marginBottom: 26,
    marginTop: 0,
    color: 'var(--retro-pink)',
    letterSpacing: 2,
    textShadow:
      '0 2px 0 var(--retro-yellow), 1px 2px 8px var(--retro-cyan), 0 0 20px #3161ff99',
    fontFamily: "var(--retro-font)",
    fontWeight: 'bold',
    textAlign: 'center'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 64px)',
    gridTemplateRows: 'repeat(3, 64px)',
    gap: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 34,
    marginTop: 4,
    background:
      "radial-gradient(circle at 50% 170%, #1adcfc16 0%, #0a0033 80%)",
    border: '5px solid var(--retro-border)',
    borderRadius: 8,
    boxShadow:
      '0 2px 22px 1px var(--retro-cyan), 0 0 12px 0px var(--retro-pink) inset',
    padding: 10,
  },
  cell: {
    width: 64,
    height: 64,
    fontSize: '1.4rem',
    color: 'var(--retro-blue)',
    background:
      "linear-gradient(145deg, #181d29 80%, #1adcfc44 100%)",
    border: '4px solid var(--retro-cell-border)',
    borderRadius: 3,
    cursor: 'pointer',
    transition: 'background 0.15s, box-shadow 0.18s, filter 0.09s, color 0.13s',
    fontWeight: 700,
    outline: 'none',
    boxShadow:
      '0 2px 8px var(--retro-shadow), 0 0 0 2px #0a0033 inset',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    fontFamily: "var(--retro-font)",
    textShadow:
      "0 0px 4px #58fff988, 0 1px 12px #fff4bf30",
    position: 'relative',
    zIndex: 6,
  },
  cellX: {
    color: 'var(--retro-x)',
    textShadow:
      "0 2px 8px #fff4bf99, 0 0px 18px #ffe94bd4, 1px 1px 0px #f400ff",
    filter: "drop-shadow(0 1px 2px #fff4bf70)",
    background: "linear-gradient(80deg, #1f161d 80%, #ffe94b40 100%)",
    border: '4px solid var(--retro-x)',
  },
  cellO: {
    color: 'var(--retro-o)',
    textShadow:
      "0 2px 9px #41fff299, 0 0px 16px #34adffb4, 1px 1px 0px #0ff4ff",
    filter: "drop-shadow(0 1px 2px #00fff1)",
    background: "linear-gradient(245deg, #181d29 65%, #41fff2b7 100%)",
    border: '4px solid var(--retro-o)',
  },
  status: {
    minHeight: 38,
    fontSize: '0.91rem',
    fontWeight: 600,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: '0.7px',
    fontFamily: "var(--retro-font)",
    textShadow: '0 2px 8px #ffe94b99, 0 0px 6px #41fff29b',
    border: 0,
    padding: 2,
  },
  restartBtn: {
    background:
      'linear-gradient(90deg, var(--retro-yellow) 8%, var(--retro-pink) 90%)',
    color: '#080228',
    border: '3px solid var(--retro-cyan)',
    borderRadius: 8,
    padding: '11px 34px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 700,
    marginTop: 0,
    letterSpacing: 2,
    transition: 'background 0.18s, color 0.15s, border 0.15s, filter 0.12s',
    boxShadow:
      '0 2px 12px #ff4bf581, 0 0 22px #ffe94b61 inset',
    outline: 'none',
    fontFamily: "var(--retro-font)",
    textShadow: "1px 1px 2px #fff4bfbb",
    marginBottom: 10,
  },
  credit: {
    marginTop: 28,
    color: 'var(--retro-pink)',
    fontFamily: "var(--retro-font)",
    fontSize: '0.65rem',
    letterSpacing: '.12em',
    textAlign: 'center',
    textShadow: '0 1px 10px #ff4bf5a6, 0 2px 8px #ffe94b99',
    opacity: 0.9
  }
};

export default TicTacToeClassic;
