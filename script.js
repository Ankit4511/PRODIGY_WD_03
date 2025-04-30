const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const gameModeSelect = document.getElementById('gameMode');

let circleTurn;
let gameMode = 'pvp'; // default

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

gameModeSelect.addEventListener('change', () => {
  gameMode = gameModeSelect.value;
  startGame();
});

restartButton.addEventListener('click', startGame);

function startGame() {
  circleTurn = false;
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.innerText = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  message.innerText = '';
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? 'o' : 'x';
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false, currentClass);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    if (gameMode === 'ai' && circleTurn) {
      setTimeout(aiMove, 500); // small delay to mimic thinking
    }
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.innerText = currentClass.toUpperCase();
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => cells[index].classList.contains(currentClass))
  );
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains('x') || cell.classList.contains('o')
  );
}

function endGame(draw, winner) {
  if (draw) {
    message.innerText = "It's a draw!";
  } else {
    message.innerText = `${winner.toUpperCase()} wins!`;
  }
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function aiMove() {
  const availableCells = [...cells].filter(cell =>
    !cell.classList.contains('x') && !cell.classList.contains('o')
  );
  if (availableCells.length === 0) return;

  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, 'o');

  if (checkWin('o')) {
    endGame(false, 'o');
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}
