import { useState } from "react";

function Square({ value, onSquareClick, winningSquare }) {
  return (
    <button className={`square ${winningSquare && 'square-winner-border'}`} onClick={onSquareClick} >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, position) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, position);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (!squares.includes(null)) {
    status = "Draw"
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows = [0, 1, 2];
  const boardCols = [0, 1, 2];

  return (
    <>
      <div className="status">{status}</div>
        {boardRows.map((row) => (
          <div key={row} className="board-row">
            {boardCols.map((col) => {
              const index = row * 3 + col;
              const winningSquare = winner?.line?.includes(index)
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index, {x: row, y: col})}
                  winningSquare={winningSquare}
                />
              );
            })}
          </div>
        ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null)
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, currentMoveIndex) {
    const nextMove = {
      squares: nextSquares,
      position: {
        x: currentMoveIndex.x,
        y: currentMoveIndex.y
      }
    }
    const nextHistory = [...history.slice(0, currentMove + 1), nextMove]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((currentSqHist, move, history) => {
    let description;
    if (move > 0) {
      const lastLocation = `${history[move].position.x}, ${history[move].position.y}`
      description = `Go to move # ${move}, square: ${lastLocation}`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? <div>You are at move #{move + 1} </div> : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares.squares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}