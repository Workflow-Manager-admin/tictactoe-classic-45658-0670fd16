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

/*
 * Add retro red arcade-style background pattern to body if not already present
 * Uses bold red stripes and a deep cherry field to evoke 90s arcade cabinets, but keeps pixel/stripe feel.
 */
const retroBgId = 'retro-ttt-bg-style';
if (!document.getElementById(retroBgId)) {
  const retroBgStyle = document.createElement('style');
  retroBgStyle.id = retroBgId;
  retroBgStyle.innerText = `
    body {
      /* Arcade Red Diagonal stripes. #BD002C = powerful red, #85001C = deep red-black, #FF2163 & #FF757B = fuchsia accents */
      background-color: #85001c !important;
      background-image: repeating-linear-gradient(
        135deg,
        #bd002c 0px,
        #bd002c 22px,
        #ff2163 22px,
        #ff2163 30px,
        #85001c 30px,
        #85001c 54px,
        #ff757b 54px,
        #ff757b 62px
      );
      background-size: 62px 62px;
    }
  `;
  document.head.appendChild(retroBgStyle);
}

/*
 * Retro 90's arcade red palette: update for strong red theme with hot pink and neon blue/teal accents.
 * Background and major panels lean into red, bold pink & yellow for light sources, cyan/blue for board elements.
 */
const retroVars = {
  '--retro-bg': '#85001c',              // deep red-maroon as background
  '--retro-panel': '#bd002c',           // bold red for main container/panels
  '--retro-pink': '#ff4bf5',            // magenta-pink accent (neon light)
  '--retro-cyan': '#ffd319',            // yellow-glow border + text highlights
  '--retro-blue': '#34adff',            // neon blue for older highlights
  '--retro-green': '#2fff4b',           // keep for victory accents (optional)
  '--retro-yellow': '#ffe94b',          // neon yellow for draw/borders
  '--retro-x': '#ffe94b',               // keep X yellow for pop
  '--retro-o': '#ff4bf5',               // O as neon magenta (pop on red/black)
  '--retro-button-bg': '#ff2163',       // arcade red/pink for button background
  '--retro-button-hover': '#ffd319',    // button hover: yellow for punch
  '--retro-border': '#ffe94b',          // All borders go electric yellow/gold
  '--retro-shadow': '#bd002cb1',        // softer redto-pink shadow
  '--retro-cell-border': '#ffd319',     // board: yellow (strong contrast)
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
    background: 'var(--retro-panel)', // now bold red (#bd002c)
    border: '6px solid var(--retro-yellow)', // strong gold/yellow accent
    borderRadius: 15,
    margin: '48px auto',
    boxShadow:
      '0 0 38px 8px #ff216380, 0 0 0 12px #ffe94b88 inset, 0 2px 14px 0px #33010c99',
    padding: '46px 30px 24px 30px',
    maxWidth: 370,
    color: '#fff',
    minHeight: 540,
    fontFamily: "var(--retro-font)",
    position: 'relative',
    outline: '3px solid #ff2163', // extra neon red glow
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: 26,
    marginTop: 0,
    color: 'var(--retro-yellow)',
    letterSpacing: 2,
    textShadow:
      '0 2px 0 #ff2163, 1px 2px 8px #ffe94bdd, 0 0 26px #bd002cb4',
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
      "radial-gradient(circle at 60% 170%, #ffd31919 0%, #bd002c 88%)", // light yellow glow into red
    border: '5px solid var(--retro-border)', // #ffe94b
    borderRadius: 8,
    boxShadow:
      '0 2px 18px 1px #ffd319b1, 0 0 18px 0px #ff2163aa inset',
    padding: 10,
  },
  cell: {
    width: 64,
    height: 64,
    fontSize: '1.4rem',
    color: 'var(--retro-blue)',
    background:
      "linear-gradient(135deg, #ff757b 72%, #ff216344 100%)", // pink fade, visible on red
    border: '4px solid var(--retro-cell-border)', // yellow border
    borderRadius: 3,
    cursor: 'pointer',
    transition: 'background 0.15s, box-shadow 0.18s, filter 0.09s, color 0.13s',
    fontWeight: 700,
    outline: 'none',
    boxShadow:
      '0 2px 8px var(--retro-shadow), 0 0 0 2px #bd002c inset',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    fontFamily: "var(--retro-font)",
    textShadow:
      "0 0px 4px #ffd31988, 0 1px 12px #ffe94b40",
    position: 'relative',
    zIndex: 6,
  },
  cellX: {
    color: 'var(--retro-x)', // yellow
    textShadow:
      "0 2px 8px #ffe94bbb, 0 0px 18px #ffe94bd4, 1px 1px 0px #ff2163b0",
    filter: "drop-shadow(0 1px 2px #ffe94b70)",
    background: "linear-gradient(80deg, #450014 80%, #ffe94b40 100%)", // soft red base
    border: '4px solid var(--retro-x)',
  },
  cellO: {
    color: 'var(--retro-o)', // neon magenta for O, pops on red
    textShadow:
      "0 2px 10px #ff4bf599, 0 0px 18px #bd002cb4, 1px 1px 0px #ffe94b",
    filter: "drop-shadow(0 2px 7px #ff4bf570)",
    background: "linear-gradient(245deg, #bd002c 65%, #ff4bf580 100%)",
    border: '4px solid var(--retro-o)',
  },
  status: {
    minHeight: 38,
    fontSize: '0.99rem',
    fontWeight: 600,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: '1px',
    fontFamily: "var(--retro-font)",
    textShadow: '0 2px 8px #ffe94bbb, 0 0px 6px #ff2163c9',
    border: 0,
    padding: 2,
  },
  restartBtn: {
    background:
      'linear-gradient(92deg, var(--retro-pink) 7%, var(--retro-yellow) 93%)',
    color: '#340013',
    border: '3px solid var(--retro-border)', // yellow
    borderRadius: 8,
    padding: '11px 34px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 700,
    marginTop: 0,
    letterSpacing: 2,
    transition: 'background 0.18s, color 0.15s, border 0.15s, filter 0.12s',
    boxShadow:
      '0 2px 12px #ff216388, 0 0 22px #ffe94b71 inset',
    outline: 'none',
    fontFamily: "var(--retro-font)",
    textShadow: "1px 1px 2px #ffe94bbb",
    marginBottom: 10,
  },
  credit: {
    marginTop: 28,
    color: '#ffe94b', // yellow accent
    fontFamily: "var(--retro-font)",
    fontSize: '0.65rem',
    letterSpacing: '.13em',
    textAlign: 'center',
    textShadow: '0 1px 10px #ff21639c, 0 2px 8px #ffe94b88',
    opacity: 0.97
  }
};

export default TicTacToeClassic;
