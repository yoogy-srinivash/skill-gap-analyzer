import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MatchBar from "../components/MatchBar";
import ResultCard from "../components/ResultCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [categories, setCategories] = useState({});
  const [skills, setSkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState("manual");
  const [resumeText, setResumeText] = useState("");
  const [resumeSkills, setResumeSkills] = useState([]);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    API.get("/roles").then((res) => setRoles(res.data.roles));
  }, []);

  useEffect(() => {
    if (!selectedRole) return;
    API.get(`/roles/${encodeURIComponent(selectedRole)}/skills`).then((res) => {
      setCategories(res.data.categories || {});
    });
    setSkills([]); setResumeSkills([]); setResumeText(""); setResult(null); setError("");
  }, [selectedRole]);

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleExtractAndAnalyze = async () => {
    if (!selectedRole) return setError("Select a role first");
    if (!resumeText.trim()) return setError("Paste your resume text");
    setExtracting(true); setError(""); setResult(null);
    try {
      const extractRes = await API.post("/resume/extract", { resume_text: resumeText });
      const extracted = extractRes.data.extracted_skills;
      setResumeSkills(extracted);
      if (extracted.length === 0) { setError("No skills found in resume."); return; }
      const analyzeRes = await API.post("/analyze", { role: selectedRole, skills: extracted });
      setResult(analyzeRes.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); navigate("/login"); }
      setError(err.response?.data?.detail || "Failed to process resume");
    } finally { setExtracting(false); }
  };

  const handleAnalyze = async () => {
    if (!selectedRole) return setError("Select a role first");
    if (skills.length === 0) return setError("Select at least one skill");
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await API.post("/analyze", { role: selectedRole, skills });
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); navigate("/login"); }
      setError(err.response?.data?.detail || "Analysis failed");
    } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };

  /* Per-category color accents — varied, not all purple */
  const catAccents = [
    {
      label: "#7C5CFF",
      active:   { background: "rgba(124,92,255,0.18)", borderColor: "rgba(124,92,255,0.55)", color: "#FFFFFF" },
      inactive: { background: "rgba(124,92,255,0.06)", borderColor: "#23243A", color: "#B3B3C6" },
    },
    {
      label: "#60A5FA",
      active:   { background: "rgba(96,165,250,0.18)",  borderColor: "rgba(96,165,250,0.55)",  color: "#FFFFFF" },
      inactive: { background: "rgba(96,165,250,0.06)",  borderColor: "#23243A", color: "#B3B3C6" },
    },
    {
      label: "#34D399",
      active:   { background: "rgba(52,211,153,0.15)",  borderColor: "rgba(52,211,153,0.5)",   color: "#FFFFFF" },
      inactive: { background: "rgba(52,211,153,0.05)",  borderColor: "#23243A", color: "#B3B3C6" },
    },
    {
      label: "#F59E0B",
      active:   { background: "rgba(245,158,11,0.15)",  borderColor: "rgba(245,158,11,0.5)",   color: "#FFFFFF" },
      inactive: { background: "rgba(245,158,11,0.05)",  borderColor: "#23243A", color: "#B3B3C6" },
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-main:        #0B0B12;
          --bg-card:        #11121A;
          --bg-panel:       #151726;
          --text-primary:   #FFFFFF;
          --text-secondary: #B3B3C6;
          --text-muted:     #8A8AA3;
          --accent-purple:  #7C5CFF;
          --accent-green:   #22C55E;
          --accent-red:     #EF4444;
          --accent-yellow:  #F59E0B;
          --border:         #23243A;
        }

        .dash-root {
          height: 100vh;
          background: var(--bg-main);
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Subtle dot-grid texture */
        .dash-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(124,92,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient glow blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(130px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(124,92,255,0.13) 0%, transparent 65%);
          top: -180px; left: -120px;
          animation: blob1 24s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%);
          bottom: -80px; right: -80px;
          animation: blob2 19s ease-in-out infinite alternate;
        }
        @keyframes blob1 { 0% { transform: translate(0,0); } 100% { transform: translate(55px,45px); } }
        @keyframes blob2 { 0% { transform: translate(0,0); } 100% { transform: translate(-45px,-35px); } }

        /* ── Nav ── */
        .dash-nav {
          position: relative; z-index: 20;
          height: 54px;
          background: rgba(11,11,18,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          flex-shrink: 0;
        }

        .nav-brand { display: flex; align-items: center; gap: 9px; }
        .nav-logo {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: linear-gradient(135deg, #7C5CFF, #5B3BFF);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 14px rgba(124,92,255,0.45);
          flex-shrink: 0;
        }
        .nav-logo svg { width: 14px; height: 14px; }
        .nav-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .nav-role-badge {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--accent-purple);
          background: rgba(124,92,255,0.1);
          border: 1px solid rgba(124,92,255,0.25);
          padding: 0.18rem 0.6rem;
          border-radius: 100px;
        }
        .nav-logout {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          background: none;
          border: 1px solid var(--border);
          padding: 0.28rem 0.75rem;
          border-radius: 7px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .nav-logout:hover {
          color: var(--accent-red);
          border-color: rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.06);
        }

        /* ── 50/50 layout ── */
        .dash-body {
          position: relative; z-index: 10;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          min-height: 0;
        }

        /* Divider line */
        .dash-body::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0; left: 50%;
          width: 1px;
          background: var(--border);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Left panel ── */
        .left-panel {
          display: flex;
          flex-direction: column;
          background: var(--bg-panel);
          overflow: hidden;
          min-width: 0;
        }

        .left-panel-inner {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
          min-height: 0;
        }

        /* ── Right panel ── */
        .right-panel {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 1.5rem;
          background: var(--bg-main);
          min-width: 0;
        }

        /* Thin scrollbars */
        .left-panel-inner::-webkit-scrollbar,
        .right-panel::-webkit-scrollbar { width: 3px; }
        .left-panel-inner::-webkit-scrollbar-track,
        .right-panel::-webkit-scrollbar-track { background: transparent; }
        .left-panel-inner::-webkit-scrollbar-thumb,
        .right-panel::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }

        /* ── Section label ── */
        .section-label {
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 0.45rem;
        }

        /* ── Panel heading ── */
        .panel-heading {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .panel-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent-purple);
          box-shadow: 0 0 8px rgba(124,92,255,0.7);
        }

        /* ── Role select ── */
        .role-select {
          width: 100%;
          background: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.65rem 2rem 0.65rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8AA3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        .role-select:focus {
          border-color: var(--accent-purple);
          box-shadow: 0 0 0 3px rgba(124,92,255,0.12);
        }
        .role-select option { background: #151726; color: #FFFFFF; }

        /* ── Mode tabs ── */
        .mode-tabs {
          display: flex;
          gap: 3px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 3px;
        }
        .mode-tab {
          flex: 1;
          padding: 0.42rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          background: none;
          color: var(--text-muted);
        }
        .mode-tab.active {
          background: rgba(124,92,255,0.18);
          color: var(--text-primary);
          border-color: rgba(124,92,255,0.3);
        }
        .mode-tab.inactive:hover {
          color: var(--text-secondary);
          background: rgba(255,255,255,0.04);
        }

        /* ── Category group ── */
        .cat-label {
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 0.5rem;
        }
        .cat-chips { display: flex; flex-wrap: wrap; gap: 5px; }

        /* ── Skill chip ── */
        .skill-chip {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.26rem 0.65rem;
          border-radius: 7px;
          border: 1px solid;
          cursor: pointer;
          transition: filter 0.15s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
          display: inline-block;
          line-height: 1.4;
        }
        .skill-chip:hover { filter: brightness(1.18); transform: translateY(-1px); }
        .skill-chip:active { transform: translateY(0); }

        /* ── Section divider ── */
        .section-divider {
          height: 1px;
          background: var(--border);
        }

        /* ── Custom input ── */
        .custom-input {
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 400;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          border-radius: 9px;
          padding: 0.52rem 0.8rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .custom-input::placeholder { color: var(--text-muted); }
        .custom-input:focus {
          border-color: var(--accent-purple);
          box-shadow: 0 0 0 3px rgba(124,92,255,0.1);
        }

        /* ── Resume textarea ── */
        .resume-textarea {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          border-radius: 10px;
          padding: 0.85rem 1rem;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          line-height: 1.65;
        }
        .resume-textarea::placeholder { color: var(--text-muted); }
        .resume-textarea:focus {
          border-color: var(--accent-purple);
          box-shadow: 0 0 0 3px rgba(124,92,255,0.1);
        }

        /* ── Extracted skill pills ── */
        .extracted-skill {
          font-size: 0.72rem;
          font-weight: 500;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          background: rgba(124,92,255,0.1);
          border: 1px solid rgba(124,92,255,0.22);
          color: var(--accent-purple);
        }

        /* ── Empty hint ── */
        .empty-hint {
          font-size: 0.82rem;
          color: var(--text-muted);
          text-align: center;
          padding: 2rem 0 1rem;
        }

        /* ── Bottom action strip ── */
        .left-bottom {
          flex-shrink: 0;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          background: var(--bg-panel);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skill-count-note {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          text-align: center;
        }

        .error-msg {
          font-size: 0.78rem;
          font-weight: 500;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.22);
          color: var(--accent-red);
          padding: 0.5rem 0.85rem;
          border-radius: 9px;
        }

        /* ── Analyze button ── */
        .analyze-btn {
          width: 100%;
          background: linear-gradient(135deg, #7C5CFF 0%, #5B3BFF 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          padding: 0.78rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: box-shadow 0.2s, transform 0.15s, filter 0.2s;
          box-shadow: 0 4px 20px rgba(124,92,255,0.35);
          position: relative;
          overflow: hidden;
        }
        .analyze-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .analyze-btn:hover::after { opacity: 1; }
        .analyze-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 28px rgba(124,92,255,0.5);
          filter: brightness(1.08);
        }
        .analyze-btn:active { transform: scale(0.99); }
        .analyze-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
          filter: none;
          box-shadow: none;
        }

        /* ── Right: empty state ── */
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .empty-icon {
          width: 48px; height: 48px;
          border-radius: 13px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
        }
        .empty-state-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .empty-state-sub {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.65;
        }

        /* ── Result area ── */
        .result-area {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fadeUp 0.4s ease forwards;
        }

        /* ── Skeleton loaders ── */
        @keyframes skel {
          0%   { background-position: -500px 0; }
          100% { background-position:  500px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, var(--bg-card) 25%, #1C1D2B 50%, var(--bg-card) 75%);
          background-size: 500px 100%;
          animation: skel 1.6s infinite;
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        /* ── Spinner ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 7px;
          vertical-align: middle;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .dash-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            overflow-y: auto;
          }
          .dash-body::after { display: none; }
          .left-panel { max-height: 60vh; border-bottom: 1px solid var(--border); }
          .right-panel { min-height: 50vh; }
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="dash-root">

        {/* NAV */}
        <nav className="dash-nav">
          <div className="nav-brand">
            <div className="nav-logo">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="nav-title">SkillGap</span>
          </div>
          <div className="nav-actions">
            {selectedRole && <span className="nav-role-badge">{selectedRole}</span>}
            <button className="nav-logout" onClick={handleLogout}>Sign out</button>
          </div>
        </nav>

        {/* BODY */}
        <div className="dash-body">

          {/* ── LEFT ── */}
          <div className="left-panel">
            <div className="left-panel-inner">

              <div className="panel-heading">
                <span className="panel-dot" />
                Configure Analysis
              </div>

              {/* Target role */}
              <div>
                <p className="section-label">Target role</p>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="role-select"
                >
                  <option value="">Select a role…</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Input method */}
              <div>
                <p className="section-label">Input method</p>
                <div className="mode-tabs">
                  <button
                    className={`mode-tab ${inputMode === "manual" ? "active" : "inactive"}`}
                    onClick={() => setInputMode("manual")}
                  >
                    Select skills
                  </button>
                  <button
                    className={`mode-tab ${inputMode === "resume" ? "active" : "inactive"}`}
                    onClick={() => setInputMode("resume")}
                  >
                    Paste résumé
                  </button>
                </div>
              </div>

              {/* Manual skill picker */}
              {inputMode === "manual" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.keys(categories).length > 0 ? (
                    Object.entries(categories).map(([cat, catSkills], idx) => {
                      const accent = catAccents[idx % catAccents.length];
                      return (
                        <div key={cat}>
                          <p className="cat-label" style={{ color: accent.label }}>{cat}</p>
                          <div className="cat-chips">
                            {catSkills.map((skill) => (
                              <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className="skill-chip"
                                style={skills.includes(skill) ? accent.active : accent.inactive}
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="empty-hint">Select a role above to see available skills</p>
                  )}

                  {Object.keys(categories).length > 0 && (
                    <>
                      <div className="section-divider" />
                      <div>
                        <p className="section-label">Custom skill</p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            id="custom-skill-input"
                            placeholder="Type a skill + Enter"
                            className="custom-input"
                            style={{ flex: 1 }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const val = e.target.value.trim();
                                if (val && !skills.includes(val)) setSkills((p) => [...p, val]);
                                e.target.value = "";
                              }
                            }}
                          />
                          <button
                            className="custom-input"
                            style={{ cursor: 'pointer', padding: '0.5rem 0.85rem', fontWeight: 600 }}
                            onClick={() => {
                              const el = document.getElementById("custom-skill-input");
                              const val = el.value.trim();
                              if (val && !skills.includes(val)) setSkills((p) => [...p, val]);
                              el.value = "";
                            }}
                          >+</button>
                        </div>
                        {skills.filter(s => !Object.values(categories).flat().includes(s)).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                            {skills.filter(s => !Object.values(categories).flat().includes(s)).map(skill => (
                              <span
                                key={skill}
                                className="skill-chip"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                                  background: 'rgba(124,92,255,0.1)',
                                  borderColor: 'rgba(124,92,255,0.3)',
                                  color: '#B3B3C6',
                                }}
                              >
                                {skill}
                                <button
                                  onClick={() => setSkills(skills.filter(s2 => s2 !== skill))}
                                  style={{ background: 'none', border: 'none', color: '#8A8AA3', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
                                >×</button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Resume paste */}
              {inputMode === "resume" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder={"Paste your résumé text here…\n\nSkills will be extracted automatically."}
                    className="resume-textarea"
                    style={{ height: "220px" }}
                  />
                  {resumeSkills.length > 0 && (
                    <div>
                      <p className="section-label" style={{ color: 'rgba(34,197,94,0.7)', marginBottom: '6px' }}>
                        {resumeSkills.length} skills extracted
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {resumeSkills.map((skill) => (
                          <span key={skill} className="extracted-skill">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom action strip */}
            <div className="left-bottom">
              {skills.length > 0 && inputMode === "manual" && (
                <p className="skill-count-note">{skills.length} skill{skills.length !== 1 ? 's' : ''} selected</p>
              )}
              {error && <p className="error-msg">⚠ {error}</p>}
              <button
                className="analyze-btn"
                onClick={inputMode === "manual" ? handleAnalyze : handleExtractAndAnalyze}
                disabled={loading || extracting || !selectedRole}
              >
                {(loading || extracting) ? (
                  <><span className="spinner" />Analyzing…</>
                ) : (
                  inputMode === "manual"
                    ? `Run Analysis${skills.length > 0 ? ` · ${skills.length}` : ''}`
                    : "Analyze Résumé"
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="right-panel">

            {!result && !loading && !extracting && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#8A8AA3" strokeWidth="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <p className="empty-state-title">No analysis yet</p>
                <p className="empty-state-sub">
                  Choose a role, select your skills,<br />then hit Run Analysis
                </p>
              </div>
            )}

            {(loading || extracting) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton" style={{ height: '86px' }} />
                <div className="skeleton" style={{ height: '176px' }} />
                <div className="skeleton" style={{ height: '116px' }} />
              </div>
            )}

            {result && !loading && !extracting && (
              <div className="result-area">
                <MatchBar percentage={result.match_percentage} />
                <ResultCard result={result} />
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}