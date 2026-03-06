# CricHeroes Impact Dashboard

A high-performance cricket analytics dashboard visualizing the **Ultimate Impact Metric**. Built to identify the real "Match Winners" in T20 cricket using advanced algorithmic weighting.

## 🚀 Features
- **Impact Gauge**: Instant visualization of a player's overall impact score (0-100).
- **Impact per Inning**: Raw performance data for the last 10 innings.
- **Impact Momentum**: 3-match Moving Average (SMA) to track current form.
- **Smart Autocomplete**: Google-style search suggestions for fast player lookup.
- **Premium UI**: Glassmorphic dark theme designed for clarity and visual appeal.

## 📊 The Algorithm
The impact score is calculated by the **Ultimate Impact Engine**, merging three advanced cricket analytics models. Key factors include:
- **SR/Economy Index**: Relative performance against match averages.
- **Chasing Multipliers**: Extra weight for pressure-cooker 2nd innings.
- **Bowling Discipline**: Penalties for wides and no-balls.
- **Momentum Tracking**: 5-tier regression analysis of recent form.

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Data Engine**: Python 3.x (Preprocessing)

## 📦 Deployment
Deploy as a static site on **Vercel** or any static hosting provider.
1. Run the Python engine to generate `data/final_scores.json`.
2. Push the `Cricheroes 2` folder to GitHub.
3. Link the repository to Vercel.

---
© 2026 CricHeroes Analytics | Built by Antigravity
