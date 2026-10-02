const rows = 20;
const cols = 30;

const gridElement = document.getElementById("grid");

let start = { row: 2, col: 2 };
let goal = { row: 17, col: 27 };

let mode = "wall";
let running = false;

let grid = [];


// -----------------------------
// CREATE GRID
// -----------------------------

function createGrid() {

    gridElement.innerHTML = "";

    grid = [];

    for (let r = 0; r < rows; r++) {

        grid[r] = [];

        for (let c = 0; c < cols; c++) {

            const cell = {
                row: r,
                col: c,
                wall: false,
                element: document.createElement("div")
            };

            cell.element.className = "cell";

            cell.element.addEventListener("click", () => {

                if (running) return;

                if (mode === "wall") {
                    cell.wall = !cell.wall;
                }

                if (mode === "start") {
                    start = { row: r, col: c };
                }

                if (mode === "goal") {
                    goal = { row: r, col: c };
                }

                render();

            });

            grid[r][c] = cell;

            gridElement.appendChild(cell.element);
        }
    }

    render();
}


// -----------------------------
// DRAW GRID
// -----------------------------

function render() {

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            const cell = grid[r][c];

            cell.element.className = "cell";

            if (cell.wall)
                cell.element.classList.add("wall");

            if (r === start.row && c === start.col)
                cell.element.classList.add("start");

            if (r === goal.row && c === goal.col)
                cell.element.classList.add("goal");
        }
    }
}


// -----------------------------
// HEURISTIC
// -----------------------------

function heuristic(a, b) {

    return Math.abs(a.row - b.row) +
        Math.abs(a.col - b.col);
}


// -----------------------------
// GET NEIGHBOURS
// -----------------------------

function getNeighbours(node) {

    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    const neighbours = [];

    for (const [dr, dc] of directions) {

        const nr = node.row + dr;
        const nc = node.col + dc;

        if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols
        ) {

            if (!grid[nr][nc].wall) {
                neighbours.push(grid[nr][nc]);
            }
        }
    }

    return neighbours;
}


// -----------------------------
// A* ALGORITHM
// -----------------------------

function aStar() {

    const openSet = [grid[start.row][start.col]];

    const cameFrom = new Map();

    const gScore = new Map();
    const fScore = new Map();

    const explored = [];

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            gScore.set(grid[r][c], Infinity);
            fScore.set(grid[r][c], Infinity);
        }
    }

    const startNode = grid[start.row][start.col];

    gScore.set(startNode, 0);

    fScore.set(
        startNode,
        heuristic(startNode, grid[goal.row][goal.col])
    );


    while (openSet.length > 0) {

        openSet.sort(
            (a, b) => fScore.get(a) - fScore.get(b)
        );

        const current = openSet.shift();

        explored.push(current);


        if (
            current.row === goal.row &&
            current.col === goal.col
        ) {

            return {
                path: reconstructPath(cameFrom, current),
                explored: explored
            };
        }


        for (const neighbour of getNeighbours(current)) {

            const tentativeScore =
                gScore.get(current) + 1;


            if (tentativeScore < gScore.get(neighbour)) {

                cameFrom.set(neighbour, current);

                gScore.set(
                    neighbour,
                    tentativeScore
                );

                fScore.set(
                    neighbour,
                    tentativeScore +
                    heuristic(
                        neighbour,
                        grid[goal.row][goal.col]
                    )
                );


                if (!openSet.includes(neighbour)) {
                    openSet.push(neighbour);
                }
            }
        }
    }


    return {
        path: [],
        explored: explored
    };
}


// -----------------------------
// RECONSTRUCT PATH
// -----------------------------

function reconstructPath(cameFrom, current) {

    const path = [current];

    while (cameFrom.has(current)) {

        current = cameFrom.get(current);

        path.unshift(current);
    }

    return path;
}


// -----------------------------
// RUN SIMULATION
// -----------------------------

async function runSimulation() {

    if (running) return;

    running = true;

    document.getElementById("status").textContent =
        "Searching...";

    const result = aStar();

    document.getElementById("nodesExplored").textContent =
        result.explored.length;


    // Show explored nodes

    for (const node of result.explored) {

        if (
            !(node.row === start.row &&
                node.col === start.col) &&
            !(node.row === goal.row &&
                node.col === goal.col)
        ) {

            node.element.classList.add("visited");

            await sleep(10);
        }
    }


    // Show path

    if (result.path.length === 0) {

        document.getElementById("status").textContent =
            "No path found";

        running = false;

        return;
    }


    document.getElementById("pathLength").textContent =
        result.path.length - 1;


    for (const node of result.path) {

        if (
            !(node.row === start.row &&
                node.col === start.col) &&
            !(node.row === goal.row &&
                node.col === goal.col)
        ) {

            node.element.classList.remove("visited");

            node.element.classList.add("path");

            await sleep(40);
        }
    }


    document.getElementById("status").textContent =
        "Path found!";


    // Animate robot

    await animateRobot(result.path);

    running = false;
}


// -----------------------------
// ROBOT ANIMATION
// -----------------------------

async function animateRobot(path) {

    for (const node of path) {

        node.element.textContent = "🤖";

        await sleep(70);

        if (
            !(node.row === goal.row &&
                node.col === goal.col)
        ) {
            node.element.textContent = "";
        }
    }
}


// -----------------------------
// RANDOM MAZE
// -----------------------------

function generateMaze() {

    if (running) return;

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            grid[r][c].wall =
                Math.random() < 0.25;
        }
    }

    grid[start.row][start.col].wall = false;
    grid[goal.row][goal.col].wall = false;

    document.getElementById("pathLength").textContent = "-";
    document.getElementById("nodesExplored").textContent = "-";
    document.getElementById("status").textContent = "Ready";

    render();
}


// -----------------------------
// CLEAR
// -----------------------------

function clearGrid() {

    if (running) return;

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            grid[r][c].wall = false;
            grid[r][c].element.textContent = "";
        }
    }

    document.getElementById("pathLength").textContent = "-";
    document.getElementById("nodesExplored").textContent = "-";
    document.getElementById("status").textContent = "Ready";

    render();
}


// -----------------------------
// BUTTONS
// -----------------------------

document.getElementById("startBtn")
    .addEventListener("click", () => {
        mode = "start";
    });

document.getElementById("goalBtn")
    .addEventListener("click", () => {
        mode = "goal";
    });

document.getElementById("obstacleBtn")
    .addEventListener("click", () => {
        mode = "wall";
    });

document.getElementById("runBtn")
    .addEventListener("click", runSimulation);

document.getElementById("clearBtn")
    .addEventListener("click", clearGrid);

document.getElementById("mazeBtn")
    .addEventListener("click", generateMaze);


// -----------------------------
// UTILITY
// -----------------------------

function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}


// Start

createGrid();
