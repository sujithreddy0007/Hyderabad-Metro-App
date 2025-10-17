document.addEventListener('DOMContentLoaded', function() {
    // Map functionality
    const metroMapImage = document.getElementById('metroMapImage');
    const mapContainer = document.querySelector('.map-responsive-container');
    const mapLoading = document.querySelector('.map-loading');

    // Zoom controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');

    // Line filter buttons
    const allLinesBtn = document.getElementById('allLinesBtn');
    const lineButtons = document.querySelectorAll('.control-btn:not(#allLinesBtn)');

    // Station search
    const stationSearch = document.getElementById('stationSearch');
    const searchResults = document.getElementById('searchResults');

    // Hyderabad Metro stations data (simplified)
    const stations = [
        { name: "Raidurg", x: 10, y: 20, lines: ["Blue Line"] },
        { name: "Madhapur", x: 15, y: 25, lines: ["Blue Line"] },
        { name: "HITEC City", x: 20, y: 30, lines: ["Blue Line"] },
        { name: "Ameerpet", x: 35, y: 50, lines: ["Blue Line", "Red Line"] },
        { name: "Begumpet", x: 40, y: 40, lines: ["Red Line"] },
        { name: "MG Bus Station", x: 50, y: 60, lines: ["Red Line"] },
        { name: "LB Nagar", x: 80, y: 80, lines: ["Red Line"] },
        { name: "JBS Parade Ground", x: 60, y: 70, lines: ["Green Line"] },
        { name: "Ameerpet", x: 35, y: 50, lines: ["Blue Line", "Red Line"] },
        { name: "Jubilee Hills Check Post", x: 25, y: 35, lines: ["Blue Line"] },
        { name: "Secunderabad", x: 55, y: 30, lines: ["Green Line"] },
        { name: "Hyderabad Deccan", x: 45, y: 50, lines: ["Red Line"] }
        // Add more stations as needed
    ];

    // Map variables
    let currentZoom = 1;
    let isDragging = false;
    let startPosX, startPosY, startScrollLeft, startScrollTop;

    // Show loading spinner until map loads
    metroMapImage.onload = function() {
        mapLoading.style.display = 'none';
    };

    metroMapImage.onerror = function() {
        mapLoading.innerHTML = '<p>Failed to load map. Please try again.</p>';
    };

    // Zoom functionality
    zoomInBtn.addEventListener('click', function() {
        if (currentZoom < 2.5) {
            currentZoom += 0.2;
            metroMapImage.style.transform = `scale(${currentZoom})`;
        }
    });

    zoomOutBtn.addEventListener('click', function() {
        if (currentZoom > 0.6) {
            currentZoom -= 0.2;
            metroMapImage.style.transform = `scale(${currentZoom})`;
        }
    });

    resetZoomBtn.addEventListener('click', function() {
        currentZoom = 1;
        metroMapImage.style.transform = 'scale(1)';
        mapContainer.scrollTo(0, 0);
    });

    // Map dragging functionality
    mapContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        mapContainer.classList.add('grabbing');
        startPosX = e.pageX;
        startPosY = e.pageY;
        startScrollLeft = mapContainer.scrollLeft;
        startScrollTop = mapContainer.scrollTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.pageX - startPosX;
        const dy = e.pageY - startPosY;
        mapContainer.scrollLeft = startScrollLeft - dx;
        mapContainer.scrollTop = startScrollTop - dy;
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        mapContainer.classList.remove('grabbing');
    });

    // Line filter functionality
    lineButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset all buttons
            allLinesBtn.classList.remove('active');
            lineButtons.forEach(btn => btn.classList.remove('active'));

            // Activate current button
            this.classList.add('active');

            const lineName = this.textContent.trim();
            console.log(`Filtered to show: ${lineName}`);

            // Change the map image based on line selection
            metroMapImage.src = 'images/hyderabad_metro_map.jpg'; // Replace with Hyderabad map image
        });
    });

    allLinesBtn.addEventListener('click', function() {
        lineButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        metroMapImage.src = 'images/hyderabad_metro_map.jpg';
        console.log('Showing all lines');
    });

    // Station search functionality
    stationSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        searchResults.innerHTML = '';

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const matches = stations.filter(station =>
            station.name.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            searchResults.style.display = 'block';
            matches.forEach(station => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.textContent = station.name;

                // Create line indicators
                const lineIndicators = document.createElement('div');
                lineIndicators.className = 'line-indicators';

                station.lines.forEach(line => {
                    const lineClass = line.toLowerCase().replace(' ', '-') + '-indicator';
                    const indicator = document.createElement('span');
                    indicator.className = lineClass;
                    lineIndicators.appendChild(indicator);
                });

                resultItem.appendChild(lineIndicators);

                resultItem.addEventListener('click', function() {
                    console.log(`Selected station: ${station.name}`);
                    stationSearch.value = station.name;
                    searchResults.style.display = 'none';
                    highlightStation(station);
                });

                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.style.display = 'block';
            searchResults.innerHTML = '<div class="no-results">No stations found</div>';
        }
    });

    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== stationSearch) {
            searchResults.style.display = 'none';
        }
    });

    function highlightStation(station) {
        const existingHighlights = document.querySelectorAll('.station-highlight');
        existingHighlights.forEach(el => el.remove());

        const highlight = document.createElement('div');
        highlight.className = 'station-highlight';
        highlight.style.left = `${station.x}%`;
        highlight.style.top = `${station.y}%`;

        mapContainer.appendChild(highlight);

        setTimeout(() => {
            highlight.classList.add('fade-out');
            setTimeout(() => highlight.remove(), 500);
        }, 3000);
    }
});