let grid;
let playerPosition;
const gridSize = 4;
let wumpusPosition;
let pitPositions;
let goldPosition;
let revealedCells;
let gameOver;

function initializeGame() {
    grid = [];
    revealedCells = [];
    gameOver = false;
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        revealedCells[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = '';
            revealedCells[i][j] = false;
        }
    }
    playerPosition = [0, 0];
    placeRandomObjects();
    document.getElementById('message').textContent = 'Good luck!';
    document.getElementById('play-again').style.display = 'none';
    renderGrid();
}

function placeRandomObjects() {
    do {
        wumpusPosition = getRandomPosition();
    } while (isInvalidPosition(wumpusPosition));

    pitPositions = [];
    while (pitPositions.length < 2) {
        const pos = getRandomPosition();
        if (!isInvalidPosition(pos) && !isAdjacentToAnyPit(pos) && !pitPositions.some(p => p[0] === pos[0] && p[1] === pos[1])) {
            pitPositions.push(pos);
        }
    }

    do {
        goldPosition = getRandomPosition();
    } while (
        isInvalidPosition(goldPosition) ||
        (goldPosition[0] === wumpusPosition[0] && goldPosition[1] === wumpusPosition[1]) ||
        pitPositions.some(pos => pos[0] === goldPosition[0] && pos[1] === goldPosition[1])
    );
}

function getRandomPosition() {
    return [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
}

function isInvalidPosition(position) {
    const [x, y] = position;
    return (x === 0 && y === 0);
}

function isAdjacentToAnyPit(position) {
    return pitPositions.some(pit => isAdjacent(position[0], position[1], pit));
}

function renderGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            if (revealedCells[i][j] || (i === playerPosition[0] && j === playerPosition[1])) {
                addTextToCell(cell, i, j);
            }
            if (i === playerPosition[0] && j === playerPosition[1]) {
                addPlayerToCell(cell);
            }
            cell.addEventListener('click', () => movePlayer(i, j));
            gridContainer.appendChild(cell);
        }
    }
}

function addTextToCell(cell, x, y) {
    let cellText = '';

    if (x === wumpusPosition[0] && y === wumpusPosition[1]) {
        cellText += 'Wumpus ';
    }
    if (pitPositions.some(pos => pos[0] === x && pos[1] === y)) {
        cellText += 'Pit ';
    }
    if (x === goldPosition[0] && y === goldPosition[1]) {
        cellText += 'Gold ';
    }
    if (isAdjacent(x, y, wumpusPosition)) {
        cellText += 'Stench ';
    }
    if (pitPositions.every(pos => !(pos[0] === x && pos[1] === y)) && pitPositions.some(pos => isAdjacent(x, y, pos))) {
        cellText += 'Breeze ';
    }

    cell.textContent = cellText.trim();
}

function addPlayerToCell(cell) {
    const img = document.createElement('img');
    img.src = 'images/player.png';
    img.classList.add('player');
    cell.appendChild(img);
}

function isAdjacent(x, y, position) {
    return Math.abs(x - position[0]) + Math.abs(y - position[1]) === 1;
}

function movePlayer(x, y) {
    if (gameOver) return;
    if (Math.abs(playerPosition[0] - x) + Math.abs(playerPosition[1] - y) === 1) {
        playerPosition = [x, y];
        revealedCells[x][y] = true;
        checkPosition();
        renderGrid();
    }
}

function checkPosition() {
    const [x, y] = playerPosition;
    if (x === wumpusPosition[0] && y === wumpusPosition[1]) {
        document.getElementById('message').textContent = 'You were eaten by the Wumpus! Game Over!';
        gameOver = true;
    } else if (pitPositions.some(pos => pos[0] === x && pos[1] === y)) {
        document.getElementById('message').textContent = 'You fell into a pit! Game Over!';
        gameOver = true;
    } else if (x === goldPosition[0] && y === goldPosition[1]) {
        document.getElementById('message').textContent = 'Congratulations! You found the gold!';
        gameOver = true;
    }
    if (gameOver) {
        document.getElementById('play-again').style.display = 'block';
    }
}

initializeGame();