function renderImpactChart(data) {

    const container = document.getElementById("innings-chart-container");

    container.innerHTML = `<h2>Impact per Inning</h2><canvas id="impactChart"></canvas>`;

    const ctx = document.getElementById("impactChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [{
                data: data,
                backgroundColor: "rgba(34, 197, 94, 0.6)",
                borderColor: "#22c55e",
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

}


function renderMomentumChart(data) {

    const container = document.getElementById("momentum-chart-container");

    container.innerHTML = `<h2>Impact Momentum (3-Match SMA)</h2><canvas id="momentumChart"></canvas>`;

    // Calculate 3-match simple moving average
    const movingAverage = data.map((val, index, arr) => {
        const start = Math.max(0, index - 2);
        const subset = arr.slice(start, index + 1);
        const sum = subset.reduce((a, b) => a + b, 0);
        return (sum / subset.length).toFixed(2);
    });

    const ctx = document.getElementById("momentumChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [{
                label: "Moving Average",
                data: movingAverage,
                borderColor: "#22c55e",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                pointRadius: 4,
                pointBackgroundColor: "#22c55e"
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `SMA: ${context.raw}`
                    }
                }
            },
            scales: { y: { beginAtZero: true } },
            maintainAspectRatio: true
        }
    });

}

window.renderImpactChart = renderImpactChart;
window.renderMomentumChart = renderMomentumChart;