import { useState } from "react";

export default function ResultCard({ result }) {
  const [openSkill, setOpenSkill] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .rc-stack { display: flex; flex-direction: column; gap: 12px; }

        /* ── Summary card ── */
        .rc-summary {
          background: #11121A;
          border: 1px solid #23243A;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .rc-summary:hover {
          border-color: #2E3050;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .rc-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.1rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px solid #23243A;
        }
        .rc-meta-count {
          font-size: 0.8rem;
          color: #8A8AA3;
          font-family: 'DM Sans', sans-serif;
        }
        .rc-role-badge {
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #7C5CFF;
          background: rgba(124,92,255,0.12);
          border: 1px solid rgba(124,92,255,0.28);
          padding: 0.22rem 0.7rem;
          border-radius: 100px;
          letter-spacing: 0.01em;
        }

        /* Skill groups */
        .rc-skill-group { margin-bottom: 1rem; }
        .rc-skill-group:last-child { margin-bottom: 0; }

        .rc-group-title {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.55rem;
          font-family: 'DM Sans', sans-serif;
        }
        .rc-group-title--green { color: #22C55E; }
        .rc-group-title--red   { color: #EF4444; }

        .rc-tags { display: flex; flex-wrap: wrap; gap: 6px; }

        .rc-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.26rem 0.65rem;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid;
        }
        .rc-pill--green {
          background: rgba(34,197,94,0.12);
          border-color: rgba(34,197,94,0.35);
          color: #22C55E;
        }
        .rc-pill--red {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.35);
          color: #EF4444;
        }
        .rc-pill-score {
          font-weight: 700;
          font-size: 0.68rem;
          opacity: 0.85;
        }

        /* ── Roadmap ── */
        .rc-roadmap-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .rc-roadmap-item {
          background: #11121A;
          border: 1px solid #23243A;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 8px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .rc-roadmap-item:hover {
          border-color: #2E3050;
          box-shadow: 0 4px 18px rgba(0,0,0,0.35);
        }
        .rc-roadmap-item:last-child { margin-bottom: 0; }

        .rc-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.1rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .rc-toggle:hover { background: rgba(255,255,255,0.025); }

        .rc-toggle-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #FFFFFF;
          font-family: 'DM Sans', sans-serif;
        }

        .rc-toggle-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(124,92,255,0.1);
          border: 1px solid rgba(124,92,255,0.22);
          display: flex; align-items: center; justify-content: center;
          color: #7C5CFF;
          font-size: 0.65rem;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .rc-toggle-icon.open {
          background: rgba(124,92,255,0.22);
          transform: rotate(180deg);
        }

        .rc-roadmap-body {
          padding: 0 1.1rem 1.1rem;
          border-top: 1px solid #23243A;
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rc-sub-title {
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .rc-sub-title--blue   { color: #60A5FA; }
        .rc-sub-title--purple { color: #7C5CFF; }

        .rc-steps { display: flex; flex-direction: column; gap: 7px; }
        .rc-step {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.83rem;
          color: #B3B3C6;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.55;
        }
        .rc-step-num {
          font-size: 0.65rem;
          font-weight: 700;
          color: #7C5CFF;
          background: rgba(124,92,255,0.1);
          border: 1px solid rgba(124,92,255,0.2);
          border-radius: 50%;
          width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .rc-projects { display: flex; flex-direction: column; gap: 7px; }
        .rc-project {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.83rem;
          color: #B3B3C6;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.55;
        }
        .rc-arrow {
          color: #7C5CFF;
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 0.85rem;
        }

        /* ── Similar roles ── */
        .rc-similar {
          background: #11121A;
          border: 1px solid #23243A;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .rc-similar:hover {
          border-color: #2E3050;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .rc-similar-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .rc-similar-row {
          margin-bottom: 12px;
        }
        .rc-similar-row:last-child { margin-bottom: 0; }

        .rc-similar-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 5px;
          font-family: 'DM Sans', sans-serif;
        }
        .rc-similar-name {
          font-size: 0.83rem;
          font-weight: 500;
          color: #FFFFFF;
        }
        .rc-similar-pct {
          font-size: 0.78rem;
          font-weight: 600;
          color: #8A8AA3;
        }

        .rc-similar-track {
          height: 4px;
          background: #2A2C3F;
          border-radius: 100px;
          overflow: hidden;
        }
        .rc-similar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .rc-similar-fill--green  { background: linear-gradient(90deg, #16A34A, #22C55E); }
        .rc-similar-fill--yellow { background: linear-gradient(90deg, #B45309, #F59E0B); }
        .rc-similar-fill--red    { background: linear-gradient(90deg, #B91C1C, #EF4444); }
      `}</style>

      <div className="rc-stack">

        {/* Summary */}
        <div className="rc-summary">
          <div className="rc-meta">
            <span className="rc-meta-count">
              {result.total_matched} of {result.total_required} skills matched
            </span>
            <span className="rc-role-badge">{result.role}</span>
          </div>

          {result.matched_skills.length > 0 && (
            <div className="rc-skill-group">
              <h3 className="rc-group-title rc-group-title--green">✓ Matched skills</h3>
              <div className="rc-tags">
                {result.matched_skills.map((s) => (
                  <span key={s.required} className="rc-pill rc-pill--green">
                    {s.required}
                    <span className="rc-pill-score">{Math.round(s.score * 100)}%</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.missing_skills.length > 0 && (
            <div className="rc-skill-group">
              <h3 className="rc-group-title rc-group-title--red">✕ Missing skills</h3>
              <div className="rc-tags">
                {result.missing_skills.map((skill) => (
                  <span key={skill} className="rc-pill rc-pill--red">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Roadmap */}
        {result.recommendations.length > 0 && (
          <div>
            <h3 className="rc-roadmap-title">Learning roadmap</h3>
            {result.recommendations.map((rec) => (
              <div key={rec.skill} className="rc-roadmap-item">
                <button
                  onClick={() => setOpenSkill(openSkill === rec.skill ? null : rec.skill)}
                  className="rc-toggle"
                >
                  <span className="rc-toggle-label">{rec.skill}</span>
                  <span className={`rc-toggle-icon ${openSkill === rec.skill ? 'open' : ''}`}>▾</span>
                </button>

                {openSkill === rec.skill && (
                  <div className="rc-roadmap-body">
                    <div>
                      <h4 className="rc-sub-title rc-sub-title--blue">Roadmap</h4>
                      <div className="rc-steps">
                        {rec.roadmap.map((step, i) => (
                          <div key={i} className="rc-step">
                            <span className="rc-step-num">{i + 1}</span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="rc-sub-title rc-sub-title--purple">Project ideas</h4>
                      <div className="rc-projects">
                        {rec.projects.map((project, i) => (
                          <div key={i} className="rc-project">
                            <span className="rc-arrow">→</span>
                            {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Similar roles */}
        {result.similar_roles?.length > 0 && (
          <div className="rc-similar">
            <h3 className="rc-similar-title">You also match these roles</h3>
            {result.similar_roles.map((r) => (
              <div key={r.role} className="rc-similar-row">
                <div className="rc-similar-header">
                  <span className="rc-similar-name">{r.role}</span>
                  <span className="rc-similar-pct">{r.match_percentage}%</span>
                </div>
                <div className="rc-similar-track">
                  <div
                    className={`rc-similar-fill rc-similar-fill--${r.match_percentage >= 70 ? 'green' : r.match_percentage >= 40 ? 'yellow' : 'red'}`}
                    style={{ width: `${r.match_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}