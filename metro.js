class MetroGraph {
    constructor() {
        this.adjList = new Map();
        this.stations = new Set();
        this.initializeGraph();
    }

    normalize(str) {
        return str.trim().toLowerCase();
    }

    addEdge(station1, station2, distance, line) {
        const s1 = this.normalize(station1);
        const s2 = this.normalize(station2);
        const normalizedLine = this.normalize(line);

        this.stations.add(s1);
        this.stations.add(s2);

        if (!this.adjList.has(s1)) this.adjList.set(s1, []);
        if (!this.adjList.has(s2)) this.adjList.set(s2, []);

        this.adjList.get(s1).push({ station: s2, distance, line: normalizedLine });
        this.adjList.get(s2).push({ station: s1, distance, line: normalizedLine });
    }

    findShortestPath(source, destination) {
        const src = this.normalize(source);
        const dest = this.normalize(destination);

        if (!this.adjList.has(src) || !this.adjList.has(dest)) return null;

        const distances = new Map();
        const previous = new Map();
        const pq = new PriorityQueue();

        for (const [station] of this.adjList) distances.set(station, Infinity);
        distances.set(src, 0);
        pq.enqueue(src, 0);

        while (!pq.isEmpty()) {
            const [currentStation, currentDist] = pq.dequeue();
            if (currentStation === dest) break;

            for (const neighbor of this.adjList.get(currentStation)) {
                const newDist = currentDist + neighbor.distance;
                if (newDist < distances.get(neighbor.station)) {
                    distances.set(neighbor.station, newDist);
                    previous.set(neighbor.station, { station: currentStation, line: neighbor.line });
                    pq.enqueue(neighbor.station, newDist);
                }
            }
        }

        const path = [];
        let current = dest;
        while (current && previous.has(current)) {
            const prev = previous.get(current);
            path.unshift({ station: current, line: prev.line });
            current = prev.station;
        }
        if (current === src) path.unshift({ station: current, line: "" });

        if (path.length === 0 || path[0].station !== src) return null;

        return { path, totalDistance: distances.get(dest) };
    }

    calculateFare(distance) {
        const baseFare = 10;
        const perKmCharge = 2;
        const totalFare = baseFare + distance * perKmCharge;
        return Math.min(totalFare, 60);
    }

    initializeGraph() {
        // Red Line (Miyapur to LB Nagar)
        this.addEdge("Miyapur", "JNTU College", 2, "Red Line");
        this.addEdge("JNTU College", "KPHB Colony", 2, "Red Line");
        this.addEdge("KPHB Colony", "Miyapur 2", 1.5, "Red Line");
        this.addEdge("Miyapur 2", "Ameerpet", 2, "Red Line");
        this.addEdge("Ameerpet", "MG Bus Station", 2, "Red Line");
        this.addEdge("MG Bus Station", "Mettuguda", 2, "Red Line");
        this.addEdge("Mettuguda", "Malakpet", 2, "Red Line");
        this.addEdge("Malakpet", "Dilsukhnagar", 2, "Red Line");
        this.addEdge("Dilsukhnagar", "LB Nagar", 2, "Red Line");

        // Blue Line (Nagole to Raidurg)
        this.addEdge("Nagole", "Habsiguda", 2, "Blue Line");
        this.addEdge("Habsiguda", "NGRI", 1.5, "Blue Line");
        this.addEdge("NGRI", "Secunderabad East", 2, "Blue Line");
        this.addEdge("Secunderabad East", "Ameerpet", 2, "Blue Line");
        this.addEdge("Ameerpet", "Panjagutta", 2, "Blue Line");
        this.addEdge("Panjagutta", "Madhapur", 2, "Blue Line");
        this.addEdge("Madhapur", "Raidurg", 2, "Blue Line");

        // Green Line (JBS to MGBS)
        this.addEdge("JBS", "MG Bus Station", 2.5, "Green Line");
        this.addEdge("MG Bus Station", "Punjagutta", 2, "Green Line");
        this.addEdge("Punjagutta", "Madhapur", 2, "Green Line");
        this.addEdge("Madhapur", "HITEC City", 2, "Green Line");
        this.addEdge("HITEC City", "Raidurg", 2, "Green Line");

        // Magenta Line (Falaknuma to Jubilee Bus Station)
        this.addEdge("Falaknuma", "MGBS", 2, "Magenta Line");
        this.addEdge("MGBS", "New Malakpet", 1.5, "Magenta Line");
        this.addEdge("New Malakpet", "Ameerpet", 2, "Magenta Line");
        this.addEdge("Ameerpet", "Jubilee Bus Station", 2.5, "Magenta Line");

        // Add more edges for all Hyderabad Metro stations & branches similarly
        // Distances are approximate and can be updated as per official data
    }
}

class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(val, priority) { this.values.push({ val, priority });
        this.sort(); }
    dequeue() { const item = this.values.shift(); return [item.val, item.priority]; }
    sort() { this.values.sort((a, b) => a.priority - b.priority); }
    isEmpty() { return this.values.length === 0; }
}

// Swap source and destination
function swapStations() {
    const sourceInput = document.getElementById('source');
    const destinationInput = document.getElementById('destination');
    const tempValue = sourceInput.value;
    sourceInput.value = destinationInput.value;
    destinationInput.value = tempValue;
}

// Create metro graph instance
const metro = new MetroGraph();

// Autocomplete
function autocomplete(input, itemsContainer) {
    input.addEventListener("input", function() {
        const val = this.value.toLowerCase();
        itemsContainer.innerHTML = "";
        itemsContainer.style.display = "none";
        if (val.length < 2) return;

        const matches = Array.from(metro.stations)
            .filter(station => station.includes(val))
            .slice(0, 5);

        if (matches.length > 0) {
            const inputRect = input.getBoundingClientRect();
            itemsContainer.style.width = `${inputRect.width}px`;
            itemsContainer.style.left = '0';
            itemsContainer.style.display = "block";

            matches.forEach(match => {
                const div = document.createElement("div");
                div.innerHTML = capitalizeWords(match);
                div.addEventListener("click", function() {
                    input.value = capitalizeWords(match);
                    itemsContainer.style.display = "none";
                });
                itemsContainer.appendChild(div);
            });
        }
    });

    document.addEventListener("click", function(e) {
        if (e.target !== input) itemsContainer.style.display = "none";
    });
}

// Capitalize words helper
function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Initialize autocomplete
document.addEventListener("DOMContentLoaded", function() {
    const sourceInput = document.getElementById("source");
    const destinationInput = document.getElementById("destination");
    const sourceItems = document.getElementById("sourceItems");
    const destinationItems = document.getElementById("destinationItems");

    autocomplete(sourceInput, sourceItems);
    autocomplete(destinationInput, destinationItems);
});

// Find path function
function findPath(event) {
    event.preventDefault();
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;

    if (!source || !destination) {
        alert('Please enter both source and destination stations');
        return false;
    }

    window.location.href = `results.html?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`;
    return false;
}