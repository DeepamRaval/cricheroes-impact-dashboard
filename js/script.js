let playerData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/final_scores.json")
        .then(response => response.json())
        .then(data => {
            playerData = data;
            initApp();
        });
});

function initApp() {
    // 1. Setup Hero Search (Landing Page)
    const landingInput = document.getElementById("landing-player-search");
    const landingSuggestions = document.getElementById("landing-suggestions");
    const analyzeBtn = document.getElementById("analyze-btn");

    setupAutoComplete(landingInput, landingSuggestions, (name) => {
        startImpactAnalysis(name);
    });

    analyzeBtn.addEventListener("click", () => {
        startImpactAnalysis(landingInput.value);
    });

    // 2. Setup Nav Search (Dashboard)
    const navInput = document.getElementById("nav-player-search");
    const navSuggestions = document.getElementById("nav-suggestions");

    setupAutoComplete(navInput, navSuggestions, (name) => {
        const player = playerData.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (player) updateDashboard(player);
    });

    // 3. Setup Comparison as usual
    setupComparison();
}

function setupAutoComplete(input, suggestionsDiv, onSelect) {
    input.addEventListener("input", () => {
        const value = input.value.toLowerCase();
        if (!value) {
            suggestionsDiv.style.display = "none";
            return;
        }

        const matches = playerData.filter(p =>
            p.name.toLowerCase().includes(value)
        ).slice(0, 6);

        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(p => `
                <div class="suggestion-item" data-name="${p.name}">
                    <span class="player-name">${p.name}</span>
                    <span class="player-meta">Impact: ${p.impact_score} | ${p.matches_played} matches</span>
                </div>
            `).join("");
            suggestionsDiv.style.display = "block";
        } else {
            suggestionsDiv.style.display = "none";
        }
    });

    suggestionsDiv.addEventListener("click", (e) => {
        const item = e.target.closest(".suggestion-item");
        if (item) {
            input.value = item.dataset.name;
            suggestionsDiv.style.display = "none";
            onSelect(item.dataset.name);
        }
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") onSelect(input.value);
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".hero-search-container") && !e.target.closest(".nav-search")) {
            suggestionsDiv.style.display = "none";
        }
    });
}

function startImpactAnalysis(playerName) {
    const player = playerData.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (!player) return;

    const landing = document.getElementById("landing-screen");
    const loader = document.getElementById("loader-wrapper");
    const dashboard = document.getElementById("dashboard-main");

    // Phase 1: Fade out landing
    landing.classList.add("fade-out");

    setTimeout(() => {
        landing.classList.add("hidden");
        // Phase 2: Show loader
        loader.classList.remove("hidden");
        loader.classList.add("fade-in");

        // Artificial delay for "calculating" feel
        setTimeout(() => {
            loader.classList.remove("fade-in");
            loader.classList.add("fade-out");

            setTimeout(() => {
                loader.classList.add("hidden");
                // Phase 3: Reveal Dashboard
                dashboard.classList.remove("hidden");
                dashboard.classList.add("fade-in");
                updateDashboard(player);

                // Set Navbar search value
                const navInput = document.getElementById("nav-player-search");
                navInput.value = "";
                navInput.value = player.name;
            }, 600);
        }, 2200);
    }, 500);
}

function updateDashboard(player) {
    const grid = document.querySelector(".dashboard-grid");

    // Smooth transition between players if already on dashboard
    grid.style.opacity = "0";
    grid.style.transform = "translateY(10px)";
    grid.style.transition = "all 0.5s ease";

    setTimeout(() => {
        renderImpactGauge(player.impact_score);
        renderImpactChart(player.last_10_innings);
        renderMomentumChart(player.last_10_innings);
        renderPlayerCard(player);

        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
    }, 500);
}

function renderPlayerCard(player) {
    const container = document.getElementById("player-card-container");
    let category = "";
    if (player.impact_score >= 75) category = "Match Winner";
    else if (player.impact_score >= 60) category = "Impact Player";
    else if (player.impact_score >= 40) category = "Average Contributor";
    else category = "Needs Form";

    let clutch = player.impact_score >= 80 ? `<div class="clutch-badge">🔥 CLUTCH PLAYER</div>` : "";

    container.innerHTML = `
        <h2>Player Profile</h2>
        <div class="player-card">
            <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: var(--primary-accent)">${player.name}</h3>
            ${clutch}
            <div class="comp-stat-row"><span>Impact Score</span> <strong>${player.impact_score}</strong></div>
            <div class="comp-stat-row"><span>Trend</span> <strong class="trend-${player.trend.toLowerCase()}">${player.trend.toUpperCase()}</strong></div>
            <div class="comp-stat-row"><span>Matches Played</span> <strong>${player.matches_played}</strong></div>
            <div class="comp-stat-row"><span>Class</span> <strong>${category}</strong></div>
        </div>
    `;
}

function setupComparison() {
    const a = document.getElementById("player-a-select");
    const b = document.getElementById("player-b-select");

    // Clear and refill with unique values
    a.innerHTML = '<option value="">Select Player A</option>';
    b.innerHTML = '<option value="">Select Player B</option>';

    playerData.forEach(player => {
        const opt1 = document.createElement("option");
        opt1.value = player.name;
        opt1.textContent = player.name;
        const opt2 = opt1.cloneNode(true);
        a.appendChild(opt1);
        b.appendChild(opt2);
    });

    a.addEventListener("change", compare);
    b.addEventListener("change", compare);
}

function compare() {
    const aVal = document.getElementById("player-a-select").value;
    const bVal = document.getElementById("player-b-select").value;
    const p1 = playerData.find(p => p.name === aVal);
    const p2 = playerData.find(p => p.name === bVal);
    if (!p1 || !p2) return;
    renderComparison(p1, p2);
}

function renderComparison(a, b) {
    const wrap = document.getElementById("comparison-cards-wrapper");
    let statusMsg = "";
    let winnerName = null;

    if (a.name === b.name) {
        statusMsg = `<div class="comp-status">Comparing same player results in identical impact.</div>`;
    } else if (a.impact_score === b.impact_score) {
        statusMsg = `<div class="comp-status">Both players have identical impact scores!</div>`;
    } else {
        winnerName = a.impact_score > b.impact_score ? a.name : b.name;
    }

    const card = (p) => {
        const isWinner = winnerName && p.name === winnerName;
        return `
            <div class="compare-card ${isWinner ? 'winner' : ''}">
                ${isWinner ? '<div class="winner-badge">Better Impact</div>' : ''}
                <h3>${p.name}</h3>
                <div class="comp-stat-row"><span>Impact Score</span> <strong>${p.impact_score}</strong></div>
                <div class="comp-stat-row"><span>Matches</span> <strong>${p.matches_played}</strong></div>
                <div class="comp-stat-row"><span>Trend</span> <strong class="trend-${p.trend.toLowerCase()}">${p.trend}</strong></div>
            </div>
        `;
    };

    wrap.innerHTML = `
        ${statusMsg}
        ${card(a)}
        ${card(b)}
    `;
}