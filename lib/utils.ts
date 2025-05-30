import { BoardType } from './types';

export const createEmptyBoard = (rows: number, cols: number): BoardType => {
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => ({
      x,
      y,
      isMine: false,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
    }))
  );
};

export const placeMines = (board: BoardType, numMines: number): BoardType => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlaced = 0;

  while (minesPlaced < numMines) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);

    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  return board;
};

export const calculateAdjacents = (board: BoardType): BoardType => {
  const rows = board.length;
  const cols = board[0].length;
  const directions = [-1, 0, 1];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x].isMine) continue;

      let count = 0;
      for (const dx of directions) {
        for (const dy of directions) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && board[ny][nx].isMine) {
            count++;
          }
        }
      }

      board[y][x].adjacentMines = count;
    }
  }

  return board;
};

export const revealCell = (board: BoardType, row: number, col: number): BoardType => {
  if (board[row][col].isRevealed || board[row][col].isFlagged) return board;

  board[row][col].isRevealed = true;

  if (board[row][col].adjacentMines === 0 && !board[row][col].isMine) {
    const directions = [-1, 0, 1];

    for (const dx of directions) {
      for (const dy of directions) {
        if (dx === 0 && dy === 0) continue;
        const newRow = row + dy;
        const newCol = col + dx;

        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[0].length
        ) {
          if (!board[newRow][newCol].isRevealed) {
            board = revealCell(board, newRow, newCol); // recursive reveal
          }
        }
      }
    }
  }

  return [...board];
};
