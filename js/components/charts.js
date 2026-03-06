function renderImpactChart(data) {
    const container = document.getElementById("innings-chart-container");
    container.innerHTML = `<h2>Impact per Inning</h2><canvas id="impactChart"></canvas>`;
    const ctx = document.getElementById("impactChart").getContext("2d");

    // Dynamic background colors
    const backgroundColors = data.map(val => val > 100 ? "rgba(59, 130, 246, 0.7)" : "rgba(34, 197, 94, 0.6)");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: "#22c55e",
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            animation: { duration: 2000, easing: "easeOutQuart" },
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderMomentumChart(data) {
    const container = document.getElementById("momentum-chart-container");
    container.innerHTML = `<h2>Impact Momentum (3-Match SMA)</h2><canvas id="momentumChart"></canvas>`;

    const movingAverage = data.map((val, index, arr) => {
        const start = Math.max(0, index - 2);
        return (arr.slice(start, index + 1).reduce((a, b) => a + b, 0) / (index - start + 1)).toFixed(2);
    });

    const ctx = document.getElementById("momentumChart").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.4)");
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [{
                label: "Moving Average",
                data: movingAverage,
                borderColor: "#22c55e",
                borderWidth: 4,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient,
                pointRadius: 6,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#22c55e",
                pointBorderWidth: 2
            }]
        },
        options: {
            animation: { duration: 2500, easing: "easeInOutBack" },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (c) => `SMA: ${c.raw}` } }
            },
            scales: { y: { beginAtZero: true } },
            maintainAspectRatio: true
        }
    });
}

window.renderImpactChart = renderImpactChart;
window.renderMomentumChart = renderMomentumChart;