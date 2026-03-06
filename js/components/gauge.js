function renderImpactGauge(score) {
    const container = document.getElementById("gauge-container");
    if (!container) return;

    const safeScore = parseFloat(Math.max(0, Math.min(100, score)).toFixed(1));

    let color, category;

    container.classList.remove("gauge-glow-high", "gauge-glow-medium", "gauge-glow-low");

    if (safeScore <= 33) {
        color = "var(--danger-red)";
        category = "Low Impact";
        container.classList.add("gauge-glow-low");
    }
    else if (safeScore <= 66) {
        color = "var(--secondary-accent)";
        category = "Average Impact";
        container.classList.add("gauge-glow-medium");
    }
    else {
        color = "var(--primary-accent)";
        category = "High Impact";
        container.classList.add("gauge-glow-high");
    }

    const radius = 90;
    const circumference = Math.PI * radius;
    const offset = circumference - (safeScore / 100) * circumference;
    const angle = (safeScore / 100) * 180 - 90;

    container.innerHTML = `
        <h2>Impact Score</h2>
        <div style="position:relative;width:240px;height:140px;margin:2rem auto">
        <svg viewBox="0 0 220 120" style="width:100%;height:100%">
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#1f2937" stroke-width="15" stroke-linecap="round"/>
        <path class="gauge-value" d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="${color}" stroke-width="15" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" style="transition:stroke-dashoffset 1.6s ease"/>
        <circle cx="110" cy="110" r="6" fill="#e5e7eb"/>
        <g class="needle" style="transform-origin:110px 110px;transform:rotate(-90deg);transition:transform 1.8s cubic-bezier(.34,1.56,.64,1)">
        <polygon points="106,110 114,110 110,35" fill="#e5e7eb"/>
        </g>
        </svg>
        <div style="position:absolute;bottom:-55px;width:100%;text-align:center">
        <div class="count-up-score" style="font-size:2.2rem;font-weight:800;letter-spacing:-1px">0</div>
        <div style="font-size:0.85rem;color:${color};font-weight:600;opacity:0.9">${category}</div>
        </div>
        </div>
    `;

    setTimeout(() => {
        const arc = container.querySelector(".gauge-value");
        const needle = container.querySelector(".needle");
        const scoreDisplay = container.querySelector(".count-up-score");

        if (arc) arc.style.strokeDashoffset = offset;
        if (needle) needle.style.transform = `rotate(${angle}deg)`;

        // Count up animation
        let current = 0;
        const duration = 1500;
        const stepTime = 20;
        const increment = safeScore / (duration / stepTime);

        const counter = setInterval(() => {
            current += increment;
            if (current >= safeScore) {
                scoreDisplay.innerText = safeScore;
                clearInterval(counter);
            } else {
                scoreDisplay.innerText = current.toFixed(1);
            }
        }, stepTime);
    }, 60);
}

window.renderImpactGauge = renderImpactGauge;
