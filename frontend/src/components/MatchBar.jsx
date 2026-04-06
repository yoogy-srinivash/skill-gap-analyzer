export default function MatchBar({ percentage }) {
  const tier =
    percentage >= 70 ? "green" :
    percentage >= 40 ? "yellow" :
    "red";

  const label =
    percentage >= 70 ? "Strong match" :
    percentage >= 40 ? "Partial match" :
    "Low match";

  const tierStyles = {
    green:  { fill: "linear-gradient(90deg, #16A34A, #22C55E)", glow: "rgba(34,197,94,0.35)",  badge: { color: "#22C55E", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)"  } },
    yellow: { fill: "linear-gradient(90deg, #B45309, #F59E0B)", glow: "rgba(245,158,11,0.35)", badge: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" } },
    red:    { fill: "linear-gradient(90deg, #B91C1C, #EF4444)", glow: "rgba(239,68,68,0.35)",  badge: { color: "#EF4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)"  } },
  };

  const ts = tierStyles[tier];

  return (
    <>
      <style>{`
        .mb-card {
          background: #11121A;
          border: 1px solid #23243A;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .mb-card:hover {
          border-color: #2E3050;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .mb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .mb-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8A8AA3;
          font-family: 'DM Sans', sans-serif;
        }

        .mb-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.22rem 0.65rem;
          border-radius: 100px;
          border: 1px solid;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }

        .mb-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mb-track {
          flex: 1;
          height: 7px;
          background: #2A2C3F;
          border-radius: 100px;
          overflow: hidden;
        }

        .mb-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .mb-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
          animation: mb-shimmer 2.4s ease-in-out infinite;
        }
        @keyframes mb-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }

        .mb-pct {
          font-family: 'Syne', sans-serif;
          font-size: 1.85rem;
          font-weight: 700;
          color: #FFFFFF;
          min-width: 60px;
          text-align: right;
          letter-spacing: -0.05em;
          line-height: 1;
        }
      `}</style>

      <div className="mb-card">
        <div className="mb-header">
          <span className="mb-label">Match score</span>
          <span
            className="mb-badge"
            style={{ color: ts.badge.color, background: ts.badge.bg, borderColor: ts.badge.border }}
          >
            {label}
          </span>
        </div>
        <div className="mb-row">
          <div className="mb-track">
            <div
              className="mb-fill"
              style={{
                width: `${percentage}%`,
                background: ts.fill,
                boxShadow: `0 0 10px ${ts.glow}`,
              }}
            />
          </div>
          <span className="mb-pct">{percentage}%</span>
        </div>
      </div>
    </>
  );
}