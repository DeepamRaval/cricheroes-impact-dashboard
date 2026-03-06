let playerData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/final_scores.json")
        .then(response => response.json())
        .then(data => {
            playerData = data;

            // Artificial delay for premium feel
            setTimeout(() => {
                const loader = document.getElementById("loader-wrapper");
                loader.style.opacity = "0";
                setTimeout(() => loader.style.visibility = "hidden", 800);

                // Initialize features
                setupSearch();
                setupComparison(data);

                // Show landing state (no auto-load as requested)
                showLandingState();
            }, 2000);
        });
});

function showLandingState() {
    const playerCategory = document.querySelector(".player-category");
    if (playerCategory) playerCategory.innerText = "Select a player to begin";

    // Clear dynamic sections
    document.getElementById("gauge-container").innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--text-muted)">
            <p>Ready to calculate impact metrics.</p>
            <p style="font-size: 0.8rem">Search for a player above.</p>
        </div>
    `;

    document.getElementById("innings-chart-container").innerHTML = `<h2>Impact per Inning</h2><div class="empty-chart-msg">Awaiting player selection...</div>`;
    document.getElementById("momentum-chart-container").innerHTML = `<h2>Impact Momentum</h2><div class="empty-chart-msg">Awaiting player selection...</div>`;
}


function setupSearch() {
    const searchInput = document.getElementById("player-search");
    const searchBtn = document.getElementById("search-btn");
    const suggestionsDiv = document.getElementById("search-suggestions");

    const performSearch = (playerName) => {
        const name = (playerName || searchInput.value).toLowerCase();
        const player = playerData.find(p => p.name.toLowerCase() === name);
        if (player) {
            updateDashboard(player);
            suggestionsDiv.style.display = "none";
            searchInput.value = player.name;
        }
    };

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();
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
            performSearch(item.dataset.name);
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-bar")) {
            suggestionsDiv.style.display = "none";
        }
    });

    searchBtn.addEventListener("click", () => performSearch());

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}



function updateDashboard(player) {
    const dashboard = document.querySelector(".dashboard-grid");

    // Fade out and slide up
    dashboard.style.transition = 'all 400ms ease-out';
    dashboard.style.opacity = '0';
    dashboard.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        renderImpactGauge(player.impact_score);
        renderImpactChart(player.last_10_innings);
        renderMomentumChart(player.last_10_innings);
        renderPlayerCard(player);

        // Fade in and slide to original position
        dashboard.style.opacity = '1';
        dashboard.style.transform = 'translateY(0)';

    }, 400); // Trigger re-render and fade-in after 400ms fade out
}



function renderPlayerCard(player) {

    const container = document.getElementById("player-card-container");

    let category = "";

    if (player.impact_score >= 75) category = "Match Winner";
    else if (player.impact_score >= 60) category = "Impact Player";
    else if (player.impact_score >= 40) category = "Average Contributor";
    else category = "Needs Form";

    let clutch = "";

    if (player.impact_score >= 80) {

        clutch = `<div class="clutch-badge">🔥 CLUTCH PLAYER</div>`;

    }

    container.innerHTML = `

<h2>Player Profile</h2>

<div class="player-card">

<h3>${player.name}</h3>

${clutch}

<p>Impact Score: ${player.impact_score}</p>

<p>Matches Played: ${player.matches_played}</p>

<p>Trend: ${player.trend}</p>

<p>Category: ${category}</p>

</div>

`;

}



function setupComparison() {

    const a = document.getElementById("player-a-select");

    const b = document.getElementById("player-b-select");

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

    const a = document.getElementById("player-a-select").value;

    const b = document.getElementById("player-b-select").value;

    const p1 = playerData.find(p => p.name === a);

    const p2 = playerData.find(p => p.name === b);

    if (!p1 || !p2) return;

    renderComparison(p1, p2);

}



function renderComparison(a, b) {

    const wrap = document.getElementById("comparison-cards-wrapper");

    const winner = a.impact_score > b.impact_score ? a : b;

    const card = (p) => {

        return `

<div class="compare-card ${p.name === winner.name ? 'winner' : ''}">

<h3>${p.name}</h3>

<p>Impact Score: ${p.impact_score}</p>

<p>Matches: ${p.matches_played}</p>

<p>Trend: ${p.trend}</p>

</div>

`;

    };

    wrap.innerHTML = card(a) + card(b);

}