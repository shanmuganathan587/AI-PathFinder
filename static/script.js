const rows = 15, cols = 15;
const gridDiv = document.getElementById("grid");
let grid = Array.from({length: rows}, () => Array(cols).fill(0));
let start = null, goal = null;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = r; cell.dataset.col = c;
    cell.oncontextmenu = (e) => e.preventDefault();
    cell.onclick = () => toggleObstacle(cell);
    cell.oncontextmenu = (e) => setPoint(cell);
    gridDiv.appendChild(cell);
  }
}

function toggleObstacle(cell) {
  let r = +cell.dataset.row, c = +cell.dataset.col;
  if (grid[r][c] === 0) { grid[r][c] = 1; cell.classList.add("block"); }
  else { grid[r][c] = 0; cell.classList.remove("block"); }
}

function setPoint(cell) {
  let r = +cell.dataset.row, c = +cell.dataset.col;
  if (!start) { start = [r,c]; cell.classList.add("start"); }
  else if (!goal) { goal = [r,c]; cell.classList.add("goal"); }
}

document.getElementById("runBtn").onclick = async () => {
  const res = await fetch("/find_path", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({start, goal, grid})
  });
  const data = await res.json();
  data.path.forEach(([r,c]) => {
    const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
    if (cell && !cell.classList.contains("start") && !cell.classList.contains("goal"))
      cell.classList.add("path");
  });
};
