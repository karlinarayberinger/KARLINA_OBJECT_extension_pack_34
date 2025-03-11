/**
 * file: random_graph_generator.js
 * type: JavaScript
 * author: karbytes
 * date: 11_MARCH_2025
 * license: PUBLIC_DOMAIN
 */

/**
 * Get the approximate integer Number of milliseconds which have elapsed since the Unix Epoch.
 * 
 * The Unix Epoch is 01_JANUARY_1970 at 00:00 (Coordinated Universal Time (UTC)).
 * 
 * @return {String} message displaying the time at which this function was called.
 */
function generate_time_stamp() {
    const approximate_number_of_milliseconds_elapsed_since_unix_epoch = Date.now();
    return "approximately " + approximate_number_of_milliseconds_elapsed_since_unix_epoch + " milliseconds after 00:00 Coordinated Universal Time on 01_JANUARY_1970.";
}

/**
 * Display a time-stamped message at the bottom of the web page indicating the time at which that web page's source code file 
 * (i.e. random_graph_generator.html) was most recently loaded by the web browser.
 * 
 * Instantiate the appearance of a two-dimensional Cartesian grid on the web page's only canvas element.
 */
function initialize_web_page() {
    try {
        const time_stamped_message = "The initialize_web_page() function was called " + generate_time_stamp(), p0 = "<p>", p1 = "</p>";
        console.log(time_stamped_message);
        document.getElementById("time_stamped_messages").innerHTML = p0 + time_stamped_message + p1;
        drawGrid();
    }
    catch(e) {
        console.log("An exception to normal functioning occurred during the runtime of function initialize_web_page(): " + e);
    }
}

/**
 * Populate the (assumedly blank) canvas element (on the web page named random_graph_generator.html) 
 * with grid lines (each separated by a 20-pixel width gap), horizontal (y) and vertical (x) axes 
 * which intersect with each other at the center of the canvas (i.e. at x = 0, y = 0), 
 * and numerical coordinate labels along each the x-axis and the y-axis.
 */
function drawGrid() {
	const canvas = document.getElementById('graphCanvas');
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	const centerX = width / 2;
	const centerY = height / 2;
	const scale = 20; // pixels per grid unit

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = centerX % scale; x < width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = centerY % scale; y < height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Tick marks and labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';

    for (let i = -10; i <= 10; i++) {
        // X-axis ticks
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, centerY - 5);
        ctx.lineTo(centerX + i * scale, centerY + 5);
        ctx.stroke();
        if (i !== 0) ctx.fillText(i, centerX + i * scale - 3, centerY + 15);

        // Y-axis ticks
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY + i * scale);
        ctx.lineTo(centerX + 5, centerY + i * scale);
        ctx.stroke();
        if (i !== 0) ctx.fillText(-i, centerX + 8, centerY + i * scale + 3);
    }
}

// Generate random integer within grid bounds (-10 to 10)
function randomCoordinate() {
    return Math.floor(Math.random() * 21) - 10;
}

// Calculate Euclidean distance
function calculateDistance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2).toFixed(2);
}

// Node generation
const nodeLabels = ['A', 'B', 'C', 'D', 'E'];
const nodes = nodeLabels.map(label => ({
    label,
    x: randomCoordinate(),
    y: randomCoordinate()
}));

// Generate random lines connecting nodes
const lines = [];
const numLines = Math.floor(Math.random() * 6) + 5; // between 5 and 10 lines
for (let i = 0; i < numLines; i++) {
    let [n1, n2] = [nodes[Math.floor(Math.random() * nodes.length)], nodes[Math.floor(Math.random() * nodes.length)]];
    while (n1 === n2 || lines.some(line => (line.node0 === n1 && line.node1 === n2) || (line.node0 === n2 && line.node1 === n1))) {
        n1 = nodes[Math.floor(Math.random() * nodes.length)];
        n2 = nodes[Math.floor(Math.random() * nodes.length)];
    }
    lines.push({ node0: n1, node1: n2, length: calculateDistance(n1, n2) });
}

/**
 * Draw Nodes and Lines
 * 
 * The following function, drawGraph, renders a visual representation of a graph onto an HTML5 canvas element.
 * The function retrieves the canvas context, determines the center of the canvas, and applies a scaling factor to properly position nodes.
 * It first draws edges (lines) between connected nodes using the predefined 'lines' array.
 * Then, it iterates through the 'nodes' array to render nodes as red circles, labeling them appropriately.
 * The y-axis is inverted to align with conventional Cartesian coordinates (positive y values appear above the center).
 * Dependencies: This function requires a global 'nodes' array containing labeled coordinate points and a 'lines' array defining connections between nodes.
 */
function drawGraph() {
	const canvas = document.getElementById('graphCanvas');
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	const centerX = width / 2;
	const centerY = height / 2;
	const scale = 20; // pixels per grid unit

    // Draw Lines
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1.5;
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(centerX + line.node0.x * scale, centerY - line.node0.y * scale);
        ctx.lineTo(centerX + line.node1.x * scale, centerY - line.node1.y * scale);
        ctx.stroke();
    });

    // Draw Nodes
    nodes.forEach(node => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centerX + node.x * scale, centerY - node.y * scale, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.fillText(node.label, centerX + node.x * scale + 5, centerY - node.y * scale - 5);
    });
}

/**
 * Find a simple shortest traversable path using a basic greedy algorithm.
 * 
 * The following function, shortestPath, determines a simple shortest traversable path using a greedy algorithm.
 * Given a starting node and a set of all nodes, the function iteratively selects the nearest unvisited node as the next step in the path.
 * This method does not guarantee a globally optimal shortest path but provides a computationally efficient approximation.
 * The function returns an object containing a string representation of the traversal sequence and the total path length rounded to two decimal places.
 * Dependencies: This function requires a calculateDistance function to compute Euclidean distances between nodes.
 */
function shortestPath(startNode, allNodes) {
    const visited = [startNode];
    const unvisited = allNodes.filter(n => n !== startNode);

    let current = startNode;
    let totalLength = 0;

    while (unvisited.length > 0) {
        let closest = unvisited[0];
        let minDist = calculateDistance(current, closest);

        unvisited.forEach(n => {
            const dist = calculateDistance(current, n);
            if (dist < minDist) {
                closest = n;
                minDist = dist;
            }
        });

        totalLength += parseFloat(minDist);
        visited.push(closest);
        unvisited.splice(unvisited.indexOf(closest), 1);
        current = closest;
    }

    return { path: visited.map(n => n.label).join(' → '), length: totalLength.toFixed(2) };
}

// Display Information Below Canvas
function displayInfo() {
    const infoDiv = document.getElementById('graphInfo');
    let html = '<h3>Graph Information</h3>';

    html += '<strong>NODEs:</strong><ul>';
    nodes.forEach(node => {
        html += `<li>${node.label}: X_POSITION = ${node.x}, Y_POSITION = ${node.y}</li>`;
    });
    html += '</ul>';

    html += '<strong>LINEs:</strong><ul>';
    lines.forEach((line, idx) => {
        html += `<li>L${idx}: NODE_0 = ${line.node0.label}, NODE_1 = ${line.node1.label}, LENGTH = ${line.length}</li>`;
    });
    html += '</ul>';

    const shortest = shortestPath(nodes[0], nodes);
    html += `<strong>Shortest Path Starting at ${nodes[0].label}:</strong> ${shortest.path} (Total Length: ${shortest.length})`;

    infoDiv.innerHTML = html;
}

/**
 * Append a time-stamped message to the bottom of the web page indicating when the function, generate_random_graph_and_data_about_that_graph(), was called.
 * 
 * Generate up to five randomized NODE instances such that each NODE instance is a software object consisting of two data attributes: 
 * integers representing a horizontal and a vertical position on a Cartesian plane within 10 units of the Cartesian plane's center point.
 * 
 * Generate randomized LINE instances such that each LINE instance is a software object consisting of two data attributes:
 * NODEs representing exactly two end-points to a line segment.
 */
function generate_random_graph_and_data_about_that_graph() {
	const time_stamped_message = "The generate_random_graph_and_data_about_that_graph() function was called " + generate_time_stamp(), p0 = "<p>", p1 = "</p>";
	console.log(time_stamped_message);
	document.getElementById("time_stamped_messages").innerHTML += p0 + time_stamped_message + p1;
	drawGraph();
	displayInfo();
}