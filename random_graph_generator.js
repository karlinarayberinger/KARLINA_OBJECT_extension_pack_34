/**
 * file: random_graph_generator.js
 * type: JavaScript
 * author: karbytes
 * date: 13_MARCH_2025
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

/**
 * Generate a random integer within grid bounds (i.e. from -10 to 10).
 * 
 * @return {Number} exactly one of the following twenty one values: 
 *         -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.
 */
function randomCoordinate() {
    return Math.floor(Math.random() * 21) - 10;
}

/**
 * Calculate the Euclidean distance between two points on a plane.
 * 
 * @param {Object} a represents a graph NODE whose properties are the following: 
 *                 exactly one x-axis value and exactly one y-axis value.
 * 
 * @param {Object} b represents a graph NODE whose properties are the following: 
 *                 exactly one x-axis value and exactly one y-axis value.
 */
function calculateDistance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2).toFixed(2);
}

/**-----------------------------------------------------------------------------------------------------------------------------------------------------*/
/** The following global variables store data which changes each time the GENERATE button is clicked on the web page named random_graph_generator.html. */
/**-----------------------------------------------------------------------------------------------------------------------------------------------------*/

// Generate five random non-identical NODE instances.
let nodeLabels = ['A', 'B', 'C', 'D', 'E'];

function generateUniqueNodes(count) {
    let uniqueNodes = [];
    let usedCoordinates = new Set();

    while (uniqueNodes.length < count) {
        let x = randomCoordinate();
        let y = randomCoordinate();
        let coordinateKey = `${x},${y}`; // Create a unique key for the coordinate

        if (!usedCoordinates.has(coordinateKey)) {
            usedCoordinates.add(coordinateKey);
            uniqueNodes.push({ label: nodeLabels[uniqueNodes.length], x, y });
        }
    }
    return uniqueNodes;
}

// Assign nodes using generateUniqueNodes
let nodes = generateUniqueNodes(nodeLabels.length);

// Generate up to ten random EDGE instances (which each represent two adjacent nodes of a graph).
let edges = [];
let numEdges = Math.floor(Math.random() * 6) + 5; // between 5 and 10 lines
for (let i = 0; i < numEdges; i++) {
    let [n1, n2] = [nodes[Math.floor(Math.random() * nodes.length)], nodes[Math.floor(Math.random() * nodes.length)]];
    while (n1 === n2 || edges.some(edge => (edge.node0 === n1 && edge.node1 === n2) || (edge.node0 === n2 && edge.node1 === n1))) {
        n1 = nodes[Math.floor(Math.random() * nodes.length)];
        n2 = nodes[Math.floor(Math.random() * nodes.length)];
    }
    edges.push({ node0: n1, node1: n2, length: calculateDistance(n1, n2) });
}

// Global graph variable
let graph = {};

function createGraph(nodes, edges) {
    graph = {}; // Reset global graph

    // Initialize graph with empty arrays for each node label
    nodes.forEach(node => {
        graph[node.label] = [];
    });

    // Add edges ensuring bidirectionality and correctness
    edges.forEach(edge => {
        let from = edge.node0.label;
        let to = edge.node1.label;
        
        if (graph.hasOwnProperty(from) && graph.hasOwnProperty(to)) {
            if (!graph[from].includes(to)) {
                graph[from].push(to);
            }
            if (!graph[to].includes(from)) {
                graph[to].push(from);
            }
        }
    });

    // Debugging: Log final adjacency list for verification
    // console.log("Final Adjacency List:", JSON.stringify(graph, null, 2));
}

// Generate the graph from the global nodes and edges
createGraph(nodes, edges);
/**-----------------------------------------------------------------------------------------------------------------------------------------------------*/
/** End of global variables initialization (nodes, edges, graph)                                                                                        */
/**-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Draw Nodes and Edges
 * 
 * The following function, drawGraph, renders a visual representation of a graph onto an HTML5 canvas element.
 * The function retrieves the canvas context, determines the center of the canvas, and applies a scaling factor to properly position nodes.
 * It first draws edges (lines) between connected nodes using the predefined edges array.
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

    // Adjust font settings for better readability
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw Edges
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1.5;
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(centerX + edge.node0.x * scale, centerY - edge.node0.y * scale);
        ctx.lineTo(centerX + edge.node1.x * scale, centerY - edge.node1.y * scale);
        ctx.stroke();
    });

    // Draw Nodes
    nodes.forEach(node => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centerX + node.x * scale, centerY - node.y * scale, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Adjust label positioning to prevent cutoff
        const labelOffsetX = node.x >= 0 ? 10 : -10; // Shift right for positive x, left for negative x
        const labelOffsetY = node.y >= 0 ? -10 : 10; // Shift up for positive y, down for negative y

        ctx.fillStyle = 'black';
        ctx.fillText(node.label, centerX + node.x * scale + labelOffsetX, centerY - node.y * scale + labelOffsetY);
    });
}

// Display Information Below Canvas (after the GENERATE button is clicked)
function displayInfo() {
    const infoDiv = document.getElementById('graphInfo');
    let html = '<h3>Graph Information</h3>';

    html += '<strong>NODEs:</strong><ul>';
    nodes.forEach(node => {
        html += `<li>${node.label}: X_POSITION = ${node.x}, Y_POSITION = ${node.y}</li>`;
    });
    html += '</ul>';

    html += '<strong>EDGEs:</strong><ul>';
    edges.forEach((edge, idx) => {
        html += `<li>E${idx}: NODE_0 = ${edge.node0.label}, NODE_1 = ${edge.node1.label}, LENGTH = ${edge.length}</li>`;
    });
    html += '</ul>';

    // Generate adjacency list and display it
    let adjacencyArray = generateAdjacencyArray(graph);
    html += "<strong>Graph Representation:</strong><pre>";
    adjacencyArray.forEach(entry => {
        html += entry[0] + ": " + entry.slice(1).join(", ") + "\n";
    });
    html += "</pre>";

    if (graph['A']) {
        let traversalResults = calculateTraversalDistances(graph, edges, 'A');
        //traversalResults = sortTraversalsByDistance(traversalResults);
        html += '<strong>All Traversals Starting at A:</strong><ul>';
        traversalResults.forEach((entry, index) => {
            let distanceText = (typeof entry.distance === 'number' && !isNaN(entry.distance))
                ? entry.distance.toFixed(2) 
                : "Unknown";
            html += `<li>Traversal ${index + 1}: ${entry.path} (Total Distance: ${distanceText})</li>`;
        });
        html += '</ul>';
    } else {
        html += '<strong>All Traversals Starting at A:</strong> No valid paths found from A.';
    }

    infoDiv.innerHTML = html;
}

/**
 * Append a time-stamped message to the bottom of the web page indicating when the function, generate_random_graph_and_data_about_that_graph(), was called.
 * 
 * Assume this function was called in response to the GENERATE button on random_graph_generator.html getting clicked.
 * 
 * Each time that button is clicked, a new instance of a randomized graph consisting of 5 nodes and up to 10 edges is drawn on the HTML5 canvas.
 * 
 * Generate up to five randomized NODE instances such that each NODE instance is a software object consisting of two data attributes: 
 * integers representing a horizontal and a vertical position on a Cartesian plane within 10 units of the Cartesian plane's center point.
 * 
 * Generate randomized EDGE instances such that each EDGE instance is a software object consisting of two data attributes:
 * NODEs representing exactly two end-points to a edge segment.
 */
function generate_random_graph_and_data_about_that_graph() {
    const time_stamped_message = "The generate_random_graph_and_data_about_that_graph() function was called " + generate_time_stamp(), p0 = "<p>", p1 = "</p>";
    console.log(time_stamped_message);
    document.getElementById("time_stamped_messages").innerHTML += p0 + time_stamped_message + p1;
    resetGraphData();
    clearGraphElements();
    drawGraph();
    displayInfo();
}

/**
 * Remove NODE and EDGE components from the HTML5 canvas on the web page whose source code file is named random_graph_generator.html.
 */
function clearGraphElements() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    // Define the area where nodes and edges exist
    const width = canvas.width;
    const height = canvas.height;

    // Use a composite operation to only clear nodes and lines while keeping the grid
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';

    // Redraw the grid after clearing nodes and edges
    drawGrid(ctx, width, height);
}

/**
 * Delete the data inside of the arrays named nodes and edges.
 * 
 * Re-populate the canvas with a new randomized graph.
 */
function resetGraphData() {
    nodes = [];
    edges = [];
    console.log("Graph data has been reset.");

    generateNewGraphData();  // Reinitialize nodes and edges
}

/**
 * Generate EDGE instances which represent connections between NODE instances within the context of a graph.
 * 
 * In the context of this software application, a graph consists of some natural number of point-sized nodes
 * and line-segment edges whose end-points are two non-identical nodes.
 */
function generateNewGraphData() {
    // Generate new nodes
    let nodeLabels = ['A', 'B', 'C', 'D', 'E'];
    nodes = nodeLabels.map(label => ({
        label,
        x: randomCoordinate(),
        y: randomCoordinate()
    }));
    generateUniqueNodes(5);

    // Generate new random edges
    let numEdges = Math.floor(Math.random() * 6) + 5; // between 5 and 10 lines
    for (let i = 0; i < numEdges; i++) {
        let n1, n2;
        do {
            n1 = nodes[Math.floor(Math.random() * nodes.length)];
            n2 = nodes[Math.floor(Math.random() * nodes.length)];
        } while (n1 === n2 || edges.some(edge => (edge.node0 === n1 && edge.node1 === n2) || (edge.node0 === n2 && edge.node1 === n1)));

        edges.push({ node0: n1, node1: n2, length: calculateDistance(n1, n2) });
    }

    // Generate the graph from the global nodes and edges
    createGraph(nodes, edges);
}

/**
 * This function converts the graph object into an adjacency array format.
 * Each element of the array represents a node and its connections.
 * The first element of each sub-array is the node itself, followed by its neighbors.
 * Example output:
 * [
 *   ["A", "B", "C", "D"],
 *   ["B", "A", "C"],
 *   ["C", "A", "B", "E"],
 *   ["D", "A", "E"],
 *   ["E", "C", "D"]
 * ]
 * @param {Object} graph - The adjacency list representation of the graph.
 * @returns {Array} adjacencyArray - The adjacency array representation of the graph.
 */
function generateAdjacencyArray(graph) {
    let adjacencyArray = [];
    Object.keys(graph).forEach(node => {
        adjacencyArray.push([node, ...graph[node]]);
    });
    // console.log("Adjacency Array:", JSON.stringify(adjacencyArray, null, 2));
    return adjacencyArray;
}

/**
 * This function finds all possible traversal paths in the graph
 * starting from a given node. It allows cycles and backtracking.
 * Each path follows edges between connected nodes and tracks visited edges.
 *
 * @param {Object} graph - The adjacency list representation of the graph.
 * @param {string} startNode - The node to start traversals from.
 * @returns {Array} paths - An array of all possible traversal paths.
 */
function findAllTraversals(graph, startNode) {
    let paths = [];

    function traverse(node, path, visitedEdges, cycleUsed) {
        path.push(node);

        let hasUnvisited = false;
        for (let neighbor of graph[node] || []) {
            let edgeKey = `${node}-${neighbor}`;
            let reverseEdgeKey = `${neighbor}-${node}`;

            if (!visitedEdges.has(edgeKey) || !cycleUsed) {
                hasUnvisited = true;
                let newVisitedEdges = new Set(visitedEdges);
                newVisitedEdges.add(edgeKey);
                newVisitedEdges.add(reverseEdgeKey); // Treat as an undirected graph
                
                traverse(neighbor, [...path], newVisitedEdges, cycleUsed || visitedEdges.has(edgeKey));
            }
        }

        if (!hasUnvisited) {
            paths.push(path.join(" -> "));
        }
    }

    traverse(startNode, [], new Set(), false);

    return paths;
}

/**
 * Sum the lengths of all edges in a given traversal.
 * Logs the traversal path and the total distance.
 * 
 * @param {Array} traversal - An array of edges representing a path.
 * @return {Number} - The total sum of edge lengths.
 */
function sumEdgeLengths(traversal) {
    let totalLength = 0;
    let traversalPath = traversal.map(edge => `(${edge.node0.label} → ${edge.node1.label})`).join(" -> ");

    for (let edge of traversal) {
        totalLength += parseFloat(calculateDistance(edge.node0, edge.node1));
    }
    
    console.log(`Traversal: ${traversalPath} | Total Distance: ${totalLength.toFixed(2)}`);

    return totalLength;
}

/**
 * Calculate the total distances for all traversals from a given start node.
 * Uses sumEdgeLengths(traversal) to compute distances.
 * 
 * @param {Array} graph - The graph containing nodes.
 * @param {Array} edges - The list of edges with nodes.
 * @param {Object} startNode - The starting node for traversal.
 * @return {Array} - An array of traversal paths and their respective distances.
 */
/*
function calculateTraversalDistances(graph, edges, startNode) {
    let traversals = findAllTraversals(graph, startNode);
    let edgeMap = new Map();

    console.log("Generating Edge Map...");

    // Create a mapping of edges to their respective distances
    edges.forEach(edge => {
        let key = `${edge.node0.label}-${edge.node1.label}`;
        let reverseKey = `${edge.node1.label}-${edge.node0.label}`;
        let distance = Math.max(1, Math.ceil(parseFloat(calculateDistance(edge.node0, edge.node1)))); // Ensure nonzero integer

        edgeMap.set(key, { distance, edge });
        edgeMap.set(reverseKey, { distance, edge });
        console.log(`Mapped Edge: ${key} & ${reverseKey} → Distance: ${distance}`);
    });

    console.log("Edge Map:", edgeMap);

    // Calculate the total minimum distance for each traversal using sumEdgeLengths
    let pathsWithDistances = traversals.map(pathStr => {
        let pathNodes = pathStr.split(" -> ").map(node => node.trim());
        let traversalEdges = [];
        let validPath = true;

        console.log(`Processing Traversal: ${pathStr}`);

        for (let i = 0; i < pathNodes.length - 1; i++) {
            let node0 = pathNodes[i];
            let node1 = pathNodes[i + 1];
            let edgeKey = `${node0}-${node1}`;
            let reverseEdgeKey = `${node1}-${node0}`;

            console.log(`Checking Edge: ${edgeKey}`);

            if (edgeMap.has(edgeKey)) {
                let edgeObj = edgeMap.get(edgeKey);
                console.log(`Found Edge: ${edgeKey} → Distance: ${edgeObj.distance}`);
                traversalEdges.push(edgeObj.edge);
            } else {
                console.warn(`Edge Missing: ${edgeKey} or ${reverseEdgeKey} not found in Edge Map`);
                validPath = false;
                break; // Invalid path due to missing edge
            }
        }

        if (validPath && traversalEdges.length > 0) {
            let totalDistance = sumEdgeLengths(traversalEdges);
            console.log(`Traversal: ${pathStr} | Total Distance: ${totalDistance}`);
            return { path: pathStr, distance: totalDistance };
        } else {
            console.warn(`Traversal: ${pathStr} | Total Distance: Unknown (Missing Edges)`);
            return { path: pathStr, distance: "Unknown (Missing Edges)" };
        }
    });

    return pathsWithDistances;
}
*/

/**
 * Sort the traversals in order of their distance from shortest to longest.
 * 
 * @param {Array} traversals - An array of traversal objects containing paths and distances.
 * @return {Array} - The sorted array of traversals.
 */
/*
function sortTraversalsByDistance(traversals) {
    if (traversals.length === 0) {
        console.warn("No traversals provided.");
        return [];
    }

    // Ensure all traversals have a valid totalLength
    let validTraversals = traversals.filter(traversal => traversal.totalLength !== "Unknown (Missing Edges)");

    // Sort by totalLength in ascending order
    validTraversals.sort((a, b) => a.totalLength - b.totalLength);

    console.log("Sorted Traversals (Shortest to Longest):");
    validTraversals.forEach(traversal => {
        console.log(`Traversal: ${traversal.traversal.map(edge => `(${edge.node0.label} → ${edge.node1.label})`).join(" -> ")} | Total Distance: ${traversal.totalLength.toFixed(2)}`);
    });

    return validTraversals;
}*/

/**
 * Calculate the total distances for all traversals from a given start node.
 * Uses sumEdgeLengths(traversal) to compute distances and sorts them from shortest to longest.
 * 
 * @param {Array} graph - The graph containing nodes.
 * @param {Array} edges - The list of edges with nodes.
 * @param {Object} startNode - The starting node for traversal.
 * @return {Array} - A sorted array of traversal paths and their respective distances.
 */
function calculateTraversalDistances(graph, edges, startNode) {
    let traversals = findAllTraversals(graph, startNode);
    let edgeMap = new Map();

    console.log("Generating Edge Map...");

    // Create a mapping of edges to their respective distances
    edges.forEach(edge => {
        let key = `${edge.node0.label}-${edge.node1.label}`;
        let reverseKey = `${edge.node1.label}-${edge.node0.label}`;
        let distance = Math.max(1, Math.ceil(parseFloat(calculateDistance(edge.node0, edge.node1)))); // Ensure nonzero integer

        edgeMap.set(key, { distance, edge });
        edgeMap.set(reverseKey, { distance, edge });
        console.log(`Mapped Edge: ${key} & ${reverseKey} → Distance: ${distance}`);
    });

    console.log("Edge Map:", edgeMap);

    // Calculate the total minimum distance for each traversal using sumEdgeLengths
    let pathsWithDistances = traversals.map(pathStr => {
        let pathNodes = pathStr.split(" -> ").map(node => node.trim());
        let traversalEdges = [];
        let validPath = true;

        console.log(`Processing Traversal: ${pathStr}`);

        for (let i = 0; i < pathNodes.length - 1; i++) {
            let node0 = pathNodes[i];
            let node1 = pathNodes[i + 1];
            let edgeKey = `${node0}-${node1}`;
            let reverseEdgeKey = `${node1}-${node0}`;

            console.log(`Checking Edge: ${edgeKey}`);

            if (edgeMap.has(edgeKey)) {
                let edgeObj = edgeMap.get(edgeKey);
                console.log(`Found Edge: ${edgeKey} → Distance: ${edgeObj.distance}`);
                traversalEdges.push(edgeObj.edge);
            } else {
                console.warn(`Edge Missing: ${edgeKey} or ${reverseEdgeKey} not found in Edge Map`);
                validPath = false;
                break; // Invalid path due to missing edge
            }
        }

        if (validPath && traversalEdges.length > 0) {
            let totalDistance = sumEdgeLengths(traversalEdges);
            console.log(`Traversal: ${pathStr} | Total Distance: ${totalDistance}`);
            return { path: pathStr, distance: totalDistance };
        } else {
            console.warn(`Traversal: ${pathStr} | Total Distance: Unknown (Missing Edges)`);
            return { path: pathStr, distance: "Unknown (Missing Edges)" };
        }
    });

    // Sort traversals from shortest to longest distance
    let validPaths = pathsWithDistances.filter(traversal => traversal.distance !== "Unknown (Missing Edges)");
    validPaths.sort((a, b) => a.distance - b.distance);

    console.log("Sorted Traversals (Shortest to Longest):");
    validPaths.forEach(traversal => {
        console.log(`Traversal: ${traversal.path} | Total Distance: ${traversal.distance.toFixed(2)}`);
    });

    return validPaths;
}



