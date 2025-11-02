from flask import Flask, render_template, request, jsonify
import heapq, math

app = Flask(__name__)

def heuristic(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def astar_search(start, goal, grid):
    rows, cols = len(grid), len(grid[0])
    open_list = [(0, start)]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    while open_list:
        _, current = heapq.heappop(open_list)
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return path

        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = current[0]+dr, current[1]+dc
            neighbor = (nr, nc)
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                tentative_g = g_score[current] + 1
                if tentative_g < g_score.get(neighbor, float("inf")):
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_list, (f_score[neighbor], neighbor))
    return []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/find_path", methods=["POST"])
def find_path():
    data = request.json
    start = tuple(data["start"])
    goal = tuple(data["goal"])
    grid = data["grid"]
    path = astar_search(start, goal, grid)
    return jsonify({"path": path})

if __name__ == "__main__":
    app.run(debug=True)
