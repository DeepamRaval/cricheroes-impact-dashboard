import { useState, useEffect, useRef } from "react";
import "./App.css";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line, ReferenceLine,
} from "recharts";

/* ── DATA ─────────────────────────────────────────────────────────── */
const COMMENTARY = {
    "Rohit Sharma": "An impact score of 80.4 with a surging trend is the clearest possible signal: this is a man peaking right now. The recency weighting heavily rewards his last few innings — 54 runs in his most recent outing caps a second half of the window that dwarfs the first. 433 T20 innings give this score statistical authority most players simply cannot match.\n\nThe last 10 tells a two-act story. The opening — 10, 7, 12, 8 — looks pedestrian, the kind of run that gets an opener dropped in selection meetings. Then: 38, 24, 4, 1, 23, 54. The back half outweighs the front by design of the recency model. The surge is real, not a statistical illusion.\n\nSelector's call — First name on the teamsheet. He's in the form of his life and the numbers demand it.",
    "AB de Villiers": "A 74.47 with a rising trend from a player who technically retired is a testament to how dominant his T20 peak was. The 72 innings here are a curated window into one of the game's most destructive middle-order batters — the formula rewards exactly his style: high strike rate, adaptable across all phases, performing when wickets had fallen.\n\nHis last 10 is brutally volatile: twin zeros, two single-digit scores, then a 35 at SR 233 that single-handedly rescues the window. That innings is the AB de Villiers special — fewer balls, maximum damage, death-over context.\n\nSelector's call — If available, non-negotiable. His floor is a concern but his ceiling is unmatched in this entire dataset.",
    "David Warner": "70.0 and falling is the most accurate two-word summary of David Warner's T20 career arc. The score reflects genuine historical excellence — 108 innings of aggressive opening batting across Tier-1 opposition — but the falling trend reveals a batter whose powers are waning.\n\nThe last 10 is damning: 44, then 0, then a recovery to 55, then three consecutive single-digit scores. Consistency has evaporated. The recency weighting punishes exactly this.\n\nSelector's call — A known quantity on his day, but the trend line is pointing the wrong way. Pick him with eyes open.",
    "Kane Williamson": "Stability is both Williamson's greatest asset and the reason 63.2 feels slightly underwhelming. The stable trend across 88 innings reflects a player who never truly collapses but also rarely explodes — a profile the phase and SR components assess fairly but not generously.\n\nHis last 10: 18, 42, 0, 11, 34, 22, 8, 51, 15, 7. Three scores above 30, three below 12, nothing above 55. His T20 strike rate has always been the question mark.\n\nSelector's call — Pick him for 50 overs without hesitation. In T20s, a middle-order luxury only if your power hitters are firing.",
    "Suryakumar Yadav": "The most alarming entry on this leaderboard. A score of 59.97 with a plummeting trend for 'Mr. 360' tells you exactly what the data is capturing — a genuine T20 superstar in freefall. The recency weighting ensures the model does not forgive recent failure on the basis of past glory.\n\nThe last 10 — 68, 14, 32, 0, 76, 9, 4, 12, 21, 3 — is a tale of two halves. The first five show the real Suryakumar. The second five show a player who has completely lost his way: four scores under 5.\n\nSelector's call — Do not pick on reputation alone. The data says crisis, and crisis batters in T20s can cost you a tournament.",
    "Hardik Pandya": "59.5 with a rising trend is the quiet confidence of a cricketer who has rebuilt himself. Across 131 innings, Pandya's score reflects unique value — death-over batting amplified by the phase multiplier, while winning-team contributions add win bonus points pure batters never accumulate.\n\nThe last 10 — 4, 22, 0, 31, 18, 46, 8, 12, 35, 42 — reads like a batter finding his feet. The back five considerably outperform the front five, exactly what the recency model rewards.\n\nSelector's call — Yes. Rising trend, death-over capability, and all-round value make him a high-impact pick with low downside.",
    "KL Rahul": "56.07 and stable feels like an underrating until you see his innings count: just 66. What this dataset has captured shows a batter with genuine quality — high average runs, adaptability, the ability to anchor while maintaining intent.\n\nHis last 10 — 51, 8, 0, 28, 14, 62, 7, 33, 19, 44 — contains two match-defining innings (51 and 62) bookended by inconsistency. But 62 and 44 in the back half explain stable rather than falling.\n\nSelector's call — Dependable in the right role. Most effective when given licence to play his natural game.",
    "MS Dhoni": "55.5 for a player who detested T20 chaos is, on reflection, exactly right. His impact was never about domination — it was about composure arriving when panic was spreading. Wickets-at-entry multiplier frequently at maximum.\n\nThe last 10 — 28, 0, 14, 36, 7, 18, 42, 11, 5, 22 — is vintage Dhoni: never spectacular, never catastrophic, occasionally match-winning. The 42, almost certainly a death-over finish with the equation tight, is the innings that matters.\n\nSelector's call — In his prime, automatic. Today, a specialist finisher who needs specific conditions.",
    "Virat Kohli": "The number that will surprise every fan: 52.03. The player who owns more T20 records than anyone in this dataset ranks 9th. The formula is not wrong — the data is telling the truth about a period in Kohli's T20 career that headline averages have been quietly concealing.\n\nHis last 10: 2, 11, 8, 8, 21, 1, 2, 6, 1, 0. A duck on his most recent innings receives the maximum recency weight of 10×. Only one score above 15 across ten innings. This is not noise — this is a genuine lean patch.\n\nSelector's call — His reputation demands selection; his recent data demands a frank conversation. The Impact Metric would not pick him on current form alone.",
    "Babar Azam": "47.5 and falling for a player many consider the world's best is the metric's most pointed statement about the difference between ODI excellence and T20 impact. Babar scores heavily, averages beautifully, and strikes at a rate that barely moves the match-average needle.\n\nThe last 10 — 44, 8, 0, 22, 31, 7, 18, 3, 14, 9 — best score is 44. The back half trends sharply downward.\n\nSelector's call — Difficult to omit on reputation, but the metric is clear. Current T20 form does not justify automatic selection in a team of impact players.",
    "Ben Stokes": "45.68 from just 39 innings is the most incomplete profile on this leaderboard. But 39 innings of Ben Stokes still means 39 innings of one of cricket's most dramatic match-winners. The innings count is simply too low for the recency model to fully reward him.\n\nHis last 10 — 0, 14, 47, 8, 22, 0, 31, 18, 9, 36 — has the distinctly Stokes quality: zeroes catastrophic, 47 and 36 match-defining.\n\nSelector's call — The model under-rates him on sample size. Stokes in a T20 knockout transcends data; his clutch performances exist in moments averages cannot encode.",
    "Andre Russell": "44.85 and falling for the most destructive hitter in this dataset is the story of a player whose peak has passed but whose floor remains extraordinary. Russell's impact was built on one superpower — a strike rate that made every ball a potential six.\n\nThe last 10 — 42, 0, 18, 7, 31, 14, 0, 22, 8, 11 — has two zeroes and nothing above 42. The problem is frequency: gaps between contributions have grown.\n\nSelector's call — Still a match-winner on the right day, but now a high-variance gamble. Pick him only if your team can absorb the cost of the zeroes.",
    "Glenn Maxwell": "44.05 and falling tells the Maxwell story with perfect precision. No cricketer in this dataset has a wider gap between highlight-reel genius and statistical reliability. The formula grades him on 123 innings, not the four matches that make the compilations.\n\nThe last 10: 0, 67, 0, 14, 8, 31, 0, 22, 7, 4. Three zeros. One extraordinary innings. The 67 arrives between two ducks — the definition of a player you cannot build a batting order around.\n\nSelector's call — A matchday decision, not a planning decision. If you need reliability, look to the top ten.",
    "Kieron Pollard": "43.0 and stable is honest recognition of a T20 journeyman whose value was always greater than his numbers suggested. 88 innings consistently entering in crisis, batting in death overs — but raw run-scoring never pushed him into the elite tier.\n\nHis last 10 — 18, 7, 0, 31, 22, 8, 14, 0, 28, 12 — stable oscillation between modest and quiet.\n\nSelector's call — A squad player rather than a first-choice pick. His value is in specific match-ups, not as an impact batter in his own right.",
    "Steve Smith": "39.13 and falling is the T20 verdict on a player who has spent his career being the wrong shape for the shortest format. Smith's genius rests on accumulation, rotation, and grinding — all qualities the T20 formula penalises through the SR index.\n\nHis last 10 — 22, 8, 31, 0, 14, 18, 7, 11, 4, 9 — nothing above 31, trending sharply downward. He is a square peg in a round format.\n\nSelector's call — Do not pick Smith for a T20 if any of the top 12 are available. The format does not suit his game and the numbers prove it.",
    "Shakib Al Hasan": "38.52 and falling is a reminder that batting alone undersells Shakib's true match impact. His T20 value has always been split between bat and ball — the 38.52 is batting impact only.\n\nHis last 10 — 14, 0, 22, 8, 7, 18, 4, 11, 3, 9 — back five average under 9 runs. A batter in clear decline even as his bowling remains elite.\n\nSelector's call — Pick Shakib for his bowling, consider batting a bonus. This score reflects the end of his effectiveness as a T20 batter, not the end of his cricketing value.",
    "Ravindra Jadeja": "32.75 and falling is the honest arithmetic of a lower-order T20 batter. Jadeja's value is almost entirely in bowling and fielding — this is the right tool applied to the wrong dimension of his game.\n\nHis last 10 — 8, 14, 0, 22, 7, 4, 11, 3, 9, 6 — a maximum of 22 across ten innings.\n\nSelector's call — Essential for bowling and fielding. His batting impact score should be entirely disregarded in the selection conversation.",
    "Jasprit Bumrah": "32.08 and stable for the best T20 bowler on this leaderboard is the most important score to explain. Bumrah bats at 10 or 11. The 32.08 is his batting impact only — his bowling, which makes him priceless, is not captured here at all.\n\nHis last 10 — 2, 0, 4, 8, 0, 6, 3, 0, 5, 1 — a maximum of 8. Three zeroes. Stable reflects consistent irrelevance with the bat.\n\nSelector's call — First name on the bowling attack, last on batting. This score is functionally meaningless for selection purposes.",
    "Chris Gayle": "30.78 and falling is the bittersweet arithmetic of a legendary career in its final chapter. Gayle invented the modern powerplay assault — but this dataset captures a player whose explosive phase has long passed.\n\nHis last 10 — 0, 47, 0, 0, 14, 8, 0, 22, 0, 3 — contains five zeros. Four of his final five innings are zeroes or single figures.\n\nSelector's call — Do not pick Gayle on the basis of 2012. The impact metric separates reputation from reality and the reality here is unambiguous.",
    "Jos Buttler": "28.54 and plummeting is the most surprising score for England fans. Buttler has been one of the defining T20 batters of his generation — but the recency window has caught him at his worst.\n\nHis last 10 — 14, 0, 8, 22, 7, 0, 11, 3, 0, 4 — three zeroes and nothing above 22. Plummeting is our most severe classification.\n\nSelector's call — Not on current form. The Impact Metric leaves him out of a high-stakes XI today regardless of reputation.",
};

const PLAYERS = [
    { name: "Rohit Sharma", score: 80.4, trend: "surging", innings: 433, last10: [10, 7, 12, 8, 38, 24, 4, 1, 23, 54], role: "Opener" },
    { name: "AB de Villiers", score: 74.47, trend: "rising", innings: 72, last10: [20, 1, 1, 2, 9, 35, 4, 0, 1, 1], role: "Middle Order" },
    { name: "David Warner", score: 71.98, trend: "falling", innings: 108, last10: [44, 0, 8, 31, 18, 12, 55, 3, 0, 17], role: "Opener" },
    { name: "Kane Williamson", score: 63.2, trend: "stable", innings: 88, last10: [18, 42, 0, 11, 34, 22, 8, 51, 15, 7], role: "Top Order" },
    { name: "Suryakumar Yadav", score: 59.97, trend: "plummeting", innings: 103, last10: [68, 14, 32, 0, 76, 9, 4, 12, 21, 3], role: "Middle Order" },
    { name: "Hardik Pandya", score: 59.5, trend: "rising", innings: 131, last10: [4, 22, 0, 31, 18, 46, 8, 12, 35, 42], role: "All-Rounder" },
    { name: "KL Rahul", score: 56.07, trend: "stable", innings: 66, last10: [51, 8, 0, 28, 14, 62, 7, 33, 19, 44], role: "Keeper-Batter" },
    { name: "MS Dhoni", score: 55.5, trend: "falling", innings: 82, last10: [28, 0, 14, 36, 7, 18, 42, 11, 5, 22], role: "Finisher" },
    { name: "Virat Kohli", score: 52.03, trend: "stable", innings: 113, last10: [2, 11, 8, 8, 21, 1, 2, 6, 1, 0], role: "Top Order" },
    { name: "Babar Azam", score: 47.5, trend: "falling", innings: 134, last10: [44, 8, 0, 22, 31, 7, 18, 3, 14, 9], role: "Opener" },
    { name: "Ben Stokes", score: 45.68, trend: "stable", innings: 39, last10: [0, 14, 47, 8, 22, 0, 31, 18, 9, 36], role: "All-Rounder" },
    { name: "Andre Russell", score: 44.85, trend: "falling", innings: 81, last10: [42, 0, 18, 7, 31, 14, 0, 22, 8, 11], role: "Finisher" },
    { name: "Glenn Maxwell", score: 44.05, trend: "falling", innings: 123, last10: [0, 67, 0, 14, 8, 31, 0, 22, 7, 4], role: "Middle Order" },
    { name: "Kieron Pollard", score: 43.0, trend: "stable", innings: 88, last10: [18, 7, 0, 31, 22, 8, 14, 0, 28, 12], role: "Finisher" },
    { name: "Steve Smith", score: 39.13, trend: "falling", innings: 59, last10: [22, 8, 31, 0, 14, 18, 7, 11, 4, 9], role: "Top Order" },
    { name: "Shakib Al Hasan", score: 38.52, trend: "falling", innings: 112, last10: [14, 0, 22, 8, 7, 18, 4, 11, 3, 9], role: "All-Rounder" },
    { name: "Ravindra Jadeja", score: 32.75, trend: "falling", innings: 70, last10: [8, 14, 0, 22, 7, 4, 11, 3, 9, 6], role: "All-Rounder" },
    { name: "Jasprit Bumrah", score: 32.08, trend: "stable", innings: 88, last10: [2, 0, 4, 8, 0, 6, 3, 0, 5, 1], role: "Bowler" },
    { name: "Chris Gayle", score: 30.78, trend: "falling", innings: 76, last10: [0, 47, 0, 0, 14, 8, 0, 22, 0, 3], role: "Opener" },
    { name: "Jos Buttler", score: 28.54, trend: "plummeting", innings: 138, last10: [14, 0, 8, 22, 7, 0, 11, 3, 0, 4], role: "Keeper-Batter" },
];

const TREND_CFG = {
    surging: { label: "Surging", icon: "↑↑", color: "#22c55e" },
    rising: { label: "Rising", icon: "↑", color: "#86efac" },
    stable: { label: "Stable", icon: "→", color: "#eab308" },
    falling: { label: "Falling", icon: "↓", color: "#f97316" },
    plummeting: { label: "Plummeting", icon: "↓↓", color: "#ef4444" },
};

function scoreColor(s) {
    if (s >= 70) return "#22c55e";
    if (s >= 55) return "#86efac";
    if (s >= 40) return "#eab308";
    if (s >= 28) return "#f97316";
    return "#ef4444";
}

function scoreCategory(s) {
    if (s >= 75) return "Match Winner";
    if (s >= 60) return "Impact Player";
    if (s >= 40) return "Average Contributor";
    return "Needs Form";
}

/* ── ANIMATED COUNTER ─────────────────────────────────────────────── */
function Counter({ to, duration = 1200 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start, raf;
        const tick = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setVal(ease * to);
            if (p < 1) raf = requestAnimationFrame(tick);
            else setVal(to);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to]);
    return <>{val.toFixed(1)}</>;
}

/* ── GAUGE ────────────────────────────────────────────────────────── */
function Gauge({ score }) {
    const [live, setLive] = useState(0);
    useEffect(() => {
        setLive(0);
        let start, raf;
        const tick = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 1200, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setLive(ease * score);
            if (p < 1) raf = requestAnimationFrame(tick);
            else setLive(score);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [score]);

    const R = 90;
    const circ = Math.PI * R;
    const offset = circ - (live / 100) * circ;
    const needleAngle = (live / 100) * 180 - 90;
    const col = scoreColor(live);

    return (
        <svg viewBox="0 0 220 130" style={{ width: 220, height: 130, overflow: "visible" }}>
            {/* track */}
            <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={14} strokeLinecap="round" />
            {/* fill */}
            <path
                d="M 20 110 A 90 90 0 0 1 200 110"
                fill="none"
                stroke={col}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ filter: `drop-shadow(0 0 6px ${col})`, transition: "stroke 0.15s" }}
            />
            {/* ticks */}
            {[0, 25, 50, 75, 100].map((v) => {
                const a = ((v / 100) * 180 - 90) * (Math.PI / 180);
                const ix = 110 + (R + 14) * Math.cos(a);
                const iy = 110 + (R + 14) * Math.sin(a);
                return <text key={v} x={ix} y={iy} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="rgba(255,255,255,0.2)" fontFamily="monospace">{v}</text>;
            })}
            {/* needle */}
            <g style={{ transformOrigin: "110px 110px", transform: `rotate(${needleAngle}deg)`, transition: "transform 0.05s" }}>
                <polygon points="107,110 113,110 110,32" fill={col} />
            </g>
            <circle cx={110} cy={110} r={6} fill={col} style={{ filter: `drop-shadow(0 0 6px ${col})` }} />
        </svg>
    );
}

/* ── MAIN APP ─────────────────────────────────────────────────────── */
export default function App() {
    const [screen, setScreen] = useState("landing");
    const [search, setSearch] = useState("");
    const [landingSearch, setLandingSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(PLAYERS[0]);
    const [compareA, setCompareA] = useState(null);
    const [compareB, setCompareB] = useState(null);
    const [reportOpen, setReportOpen] = useState(false);
    const [tab, setTab] = useState("profile");
    const [animKey, setAnimKey] = useState(0);
    const searchRef = useRef(null);

    /* landing autocomplete */
    useEffect(() => {
        if (!landingSearch.trim()) { setSuggestions([]); return; }
        const matches = PLAYERS.filter(p =>
            p.name.toLowerCase().includes(landingSearch.toLowerCase())
        ).slice(0, 6);
        setSuggestions(matches);
    }, [landingSearch]);

    const launch = (player) => {
        const p = player || PLAYERS.find(p => p.name.toLowerCase() === landingSearch.toLowerCase()) || PLAYERS[0];
        setSelected(p);
        setScreen("loading");
        setTimeout(() => { setScreen("dashboard"); setAnimKey(k => k + 1); }, 1900);
    };

    const selectPlayer = (p) => {
        setSelected(p);
        setReportOpen(false);
        setAnimKey(k => k + 1);
        setTab("profile");
    };

    const col = scoreColor(selected.score);
    const tc = TREND_CFG[selected.trend];
    const avg = (selected.last10.reduce((a, b) => a + b, 0) / 10).toFixed(1);
    const paras = (COMMENTARY[selected.name] || "").split("\n\n");
    const barData = selected.last10.map((r, i) => ({ n: `I${i + 1}`, r }));
    const lineData = selected.last10.map((r, i) => ({ n: i + 1, r }));
    const filtered = PLAYERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const pickLabel = selected.score >= 55 ? "✓ SELECT" : selected.score >= 40 ? "~ CONSIDER" : "✕ DOUBT";

    /* ── LANDING ──────────────────────────────────────────────────── */
    if (screen === "landing") return (
        <div className="landing">
            <div className="landing-grid-bg" />
            <div className="landing-glow" />

            <div className="landing-content">
                <div className="landing-badge">CRICHEROES · IMPACT ENGINE · T20</div>

                <h1 className="landing-title">
                    True Impact.
                    <span>Beyond Statistics.</span>
                </h1>

                <p className="landing-subtitle">10,000+ matches · Ball-by-ball context · 20 elite players</p>

                {/* Search box */}
                <div className="landing-search-wrap" ref={searchRef}>
                    <div className="landing-search-box">
                        <input
                            value={landingSearch}
                            onChange={e => setLandingSearch(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && launch()}
                            placeholder="Search a player (e.g. Rohit Sharma)..."
                            autoComplete="off"
                        />
                        <button onClick={() => launch()}>Analyse Impact</button>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="suggestions-drop">
                            {suggestions.map(p => (
                                <div key={p.name} className="sug-item" onClick={() => { setLandingSearch(p.name); setSuggestions([]); launch(p); }}>
                                    <span className="sug-name">{p.name}</span>
                                    <span className="sug-meta">Impact {p.score} · {p.innings} innings</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats row */}
                <div className="landing-stats">
                    {[["20", "PLAYERS"], ["10K+", "MATCHES"], ["T20", "FORMAT"], ["v4.0", "ENGINE"]].map(([v, l]) => (
                        <div className="landing-stat" key={l}>
                            <div className="landing-stat-val">{v}</div>
                            <div className="landing-stat-label">{l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ── LOADING ──────────────────────────────────────────────────── */
    if (screen === "loading") return (
        <div className="loader">
            <div className="cricket-ball" />
            <div className="loader-text">CALCULATING IMPACT FOR {selected.name.toUpperCase()}…</div>
            <div className="loader-bar-wrap"><div className="loader-bar" /></div>
        </div>
    );

    /* ── DASHBOARD ────────────────────────────────────────────────── */
    return (
        <div className="dashboard">

            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h1>CRICHEROES</h1>
                    <p>IMPACT METRIC ENGINE</p>
                </div>

                <div className="sidebar-search">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search players…"
                    />
                    <div className="sidebar-count">{filtered.length} / {PLAYERS.length} PLAYERS</div>
                </div>

                <div className="sidebar-list">
                    {filtered.length === 0 && <div className="no-players">NO PLAYERS FOUND</div>}
                    {filtered.map((p, i) => {
                        const active = selected.name === p.name;
                        const c = scoreColor(p.score);
                        const t = TREND_CFG[p.trend];
                        return (
                            <div
                                key={p.name}
                                className={`player-row${active ? " active" : ""}`}
                                style={{ borderLeftColor: active ? c : "transparent" }}
                                onClick={() => selectPlayer(p)}
                            >
                                <span className="player-row-rank">{i + 1}</span>
                                <div className="player-row-info">
                                    <div className="player-row-name">{p.name}</div>
                                    <div className="player-row-role">{p.role.toUpperCase()}</div>
                                </div>
                                <div className="player-row-right">
                                    <div className="player-row-score" style={{ color: c }}>{p.score}</div>
                                    <div className={`player-row-trend trend-${p.trend}`}>{t.icon}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="sidebar-footer">TRUE-IMPACT v4.0 · HACKAMINED 2026</div>
            </aside>

            {/* ── MAIN ────────────────────────────────────────────────── */}
            <div className="main">

                {/* Top bar */}
                <div className="topbar">
                    <div className="tabs">
                        {[["profile", "Player Profile"], ["momentum", "Impact Momentum"], ["compare", "Compare"]].map(([id, label]) => (
                            <button
                                key={id}
                                className={`tab-btn${tab === id ? " active" : ""}`}
                                style={{ borderBottomColor: tab === id ? col : "transparent" }}
                                onClick={() => setTab(id)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="topbar-meta">T20 · 10,000+ MATCHES</div>
                </div>

                {/* Content */}
                <div className="content" key={animKey} style={{ animation: "fadeUp 0.35s both" }}>

                    {/* ── PROFILE ─────────────────────────────────────────── */}
                    {tab === "profile" && (
                        <>
                            {/* Header */}
                            <div className="profile-header">
                                <div>
                                    <div className="profile-eyebrow">{selected.role.toUpperCase()} · {selected.innings} INNINGS</div>
                                    <h2 className="profile-name" style={{ color: "#f3f4f6" }}>{selected.name}</h2>
                                    <div className="profile-badges">
                                        <span className="badge" style={{ borderColor: `${col}50`, color: col, background: `${col}12` }}>
                                            {tc.icon} {tc.label.toUpperCase()}
                                        </span>
                                        <span className="badge" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}>
                                            {pickLabel}
                                        </span>
                                        <span className="badge" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}>
                                            {scoreCategory(selected.score).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Score + Stats */}
                            <div className="score-section">
                                <div className="card score-card">
                                    <div className="score-label">IMPACT SCORE</div>
                                    <Gauge score={selected.score} key={selected.name} />
                                    <div className="score-num" style={{ color: col, textShadow: `0 0 30px ${col}50` }}>
                                        <Counter to={selected.score} key={selected.score} />
                                    </div>
                                    <div className="score-sub">OUT OF 100</div>
                                </div>

                                <div className="stats-grid">
                                    {[
                                        { label: "10-INN AVG", val: `${avg} runs` },
                                        { label: "PEAK", val: `${Math.max(...selected.last10)} runs` },
                                        { label: "CONSISTENCY", val: (() => { const s = Math.sqrt(selected.last10.reduce((t, v) => t + (v - avg) ** 2, 0) / 10); return s < 15 ? "High" : s < 25 ? "Medium" : "Low"; })() },
                                        { label: "LAST INNINGS", val: `${selected.last10[9]} runs` },
                                    ].map(st => (
                                        <div key={st.label} className="card stat-card">
                                            <div className="stat-label">{st.label}</div>
                                            <div className="stat-val">{st.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="card chart-card">
                                <div className="card-title">IMPACT PER INNINGS — LAST 10 (OLDEST → NEWEST)</div>
                                <ResponsiveContainer width="100%" height={120}>
                                    <BarChart data={barData} barCategoryGap="25%">
                                        <XAxis dataKey="n" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)", fontFamily: "monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                                            labelStyle={{ color: "rgba(255,255,255,0.4)" }}
                                            itemStyle={{ color: col }}
                                            formatter={v => [`${v} runs`, ""]}
                                        />
                                        <Bar dataKey="r" radius={[4, 4, 0, 0]}>
                                            {barData.map((_, i) => (
                                                <Cell key={i} fill={i >= 7 ? col : "rgba(255,255,255,0.1)"} style={{ filter: i >= 7 ? `drop-shadow(0 0 5px ${col}60)` : "none" }} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Scout Report */}
                            <div>
                                <div className="report-toggle" onClick={() => setReportOpen(v => !v)}>
                                    <div className="card-title" style={{ marginBottom: 0 }}>SCOUT REPORT</div>
                                    <span style={{ color: "rgba(255,255,255,0.35)", transition: "transform 0.2s", display: "inline-block", transform: reportOpen ? "rotate(180deg)" : "none" }}>▼</span>
                                </div>
                                {reportOpen && (
                                    <div className="report-body">
                                        {paras.map((p, i) => (
                                            <p key={i} className={`report-para${i === 0 ? " highlight" : i === paras.length - 1 ? " selector" : ""}`}
                                                style={{ animationDelay: `${i * 0.08}s`, animation: "fadeUp 0.3s both" }}>
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── MOMENTUM ────────────────────────────────────────── */}
                    {tab === "momentum" && (
                        <>
                            <div className="momentum-header">
                                <div className="profile-eyebrow">IMPACT MOMENTUM</div>
                                <div className="momentum-title">{selected.name}</div>
                            </div>

                            <div className="card chart-card" style={{ marginBottom: 16 }}>
                                <div className="card-title">RUN TRAJECTORY — LAST 10 INNINGS (OLDEST → NEWEST)</div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={lineData}>
                                        <XAxis dataKey="n" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)", fontFamily: "monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                                        <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)", fontFamily: "monospace" }} axisLine={false} tickLine={false} width={28} />
                                        <Tooltip
                                            contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                                            labelStyle={{ color: "rgba(255,255,255,0.4)" }}
                                            itemStyle={{ color: col }}
                                            formatter={v => [`${v} runs`, ""]}
                                        />
                                        <ReferenceLine y={parseFloat(avg)} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
                                        <Line type="monotone" dataKey="r" stroke={col} strokeWidth={2.5}
                                            dot={{ r: 4, fill: col, strokeWidth: 0 }}
                                            activeDot={{ r: 7, fill: col, stroke: `${col}40`, strokeWidth: 4 }}
                                            style={{ filter: `drop-shadow(0 0 6px ${col}50)` }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                                {[
                                    { label: "TREND", val: tc.label, color: tc.color },
                                    { label: "AVG RUNS", val: `${avg} runs` },
                                    { label: "PEAK", val: `${Math.max(...selected.last10)} runs` },
                                    { label: "ZEROES", val: selected.last10.filter(v => v === 0).length },
                                    { label: "50+ SCORES", val: selected.last10.filter(v => v >= 50).length },
                                    { label: "LAST 3 FORM", val: selected.last10.slice(-3).join(", ") },
                                ].map(s => (
                                    <div key={s.label} className="card stat-card">
                                        <div className="stat-label">{s.label}</div>
                                        <div className="stat-val" style={{ color: s.color || "#f3f4f6" }}>{s.val}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── COMPARE ─────────────────────────────────────────── */}
                    {tab === "compare" && (
                        <>
                            <div className="profile-eyebrow" style={{ marginBottom: 20 }}>PLAYER COMPARISON</div>

                            <div className="compare-selects">
                                {[["A", compareA, setCompareA], ["B", compareB, setCompareB]].map(([label, val, setter]) => (
                                    <div key={label}>
                                        <div className="compare-select-label">PLAYER {label}</div>
                                        <select
                                            className="compare-select-box"
                                            value={val?.name || ""}
                                            onChange={e => setter(PLAYERS.find(p => p.name === e.target.value) || null)}
                                        >
                                            <option value="">Select player…</option>
                                            {PLAYERS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {compareA && compareB ? (
                                <div style={{ animation: "fadeUp 0.3s both" }}>
                                    {[
                                        { label: "IMPACT SCORE", a: compareA.score, b: compareB.score, max: 100 },
                                        { label: "AVG RUNS (LAST 10)", a: parseFloat((compareA.last10.reduce((x, y) => x + y, 0) / 10).toFixed(1)), b: parseFloat((compareB.last10.reduce((x, y) => x + y, 0) / 10).toFixed(1)), max: 80 },
                                        { label: "PEAK INNINGS", a: Math.max(...compareA.last10), b: Math.max(...compareB.last10), max: 100 },
                                    ].map(row => {
                                        const ca = scoreColor(compareA.score), cb = scoreColor(compareB.score);
                                        return (
                                            <div key={row.label} className="card compare-row">
                                                <div className="compare-row-label">{row.label}</div>
                                                {[[compareA.name, row.a, ca], [compareB.name, row.b, cb]].map(([name, val, c]) => (
                                                    <div key={name} className="compare-bar-row">
                                                        <div className="compare-bar-name">{name.split(" ")[0]}</div>
                                                        <div className="compare-bar-track">
                                                            <div className="compare-bar-fill" style={{ width: `${(val / row.max) * 100}%`, background: c, boxShadow: `0 0 8px ${c}50` }} />
                                                        </div>
                                                        <div className="compare-bar-val" style={{ color: c }}>{val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}

                                    <div className="verdict-card">
                                        <div className="verdict-label">VERDICT</div>
                                        <div className="verdict-text">
                                            {(() => {
                                                const winner = compareA.score > compareB.score ? compareA : compareB;
                                                const loser = compareA.score > compareB.score ? compareB : compareA;
                                                const diff = Math.abs(compareA.score - compareB.score).toFixed(1);
                                                return `${winner.name} leads with a ${diff}-point advantage. ${TREND_CFG[winner.trend].label} trend vs ${loser.name}'s ${TREND_CFG[loser.trend].label.toLowerCase()} form makes the gap wider in context.`;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-compare">SELECT TWO PLAYERS TO COMPARE</div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
