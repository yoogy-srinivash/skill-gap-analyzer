import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const stars = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    size: (Math.random() * 2 + 0.5).toFixed(1),
    top: (Math.random() * 100).toFixed(2),
    left: (Math.random() * 100).toFixed(2),
    dur: (Math.random() * 4 + 2).toFixed(1),
    maxOp: (Math.random() * 0.5 + 0.15).toFixed(2),
    delay: (Math.random() * 6).toFixed(1),
  }));

  const filled = [form.username, form.email, form.password].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { background: #07050f !important; height: 100%; }

        .rp-page {
          min-height: 100vh;
          width: 100%;
          background: #07050f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Stars */
        .rp-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .rp-star {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          animation: rp-twinkle var(--dur) ease-in-out infinite alternate;
          animation-delay: var(--delay);
          opacity: 0;
        }
        @keyframes rp-twinkle {
          from { opacity: 0.04; }
          to   { opacity: var(--max-op); }
        }

        /* Nebula */
        .rp-nebula { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
        .rp-n1 {
          width: 550px; height: 550px;
          background: radial-gradient(circle, rgba(109,40,217,0.5) 0%, transparent 70%);
          top: -140px; right: -100px;
          animation: rp-d1 18s ease-in-out infinite alternate;
        }
        .rp-n2 {
          width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(139,92,246,0.38) 0%, transparent 70%);
          bottom: -100px; left: -80px;
          animation: rp-d2 14s ease-in-out infinite alternate;
        }
        @keyframes rp-d1 { to { transform: translate(-50px, 40px) scale(1.1); } }
        @keyframes rp-d2 { to { transform: translate(40px, -40px) scale(1.08); } }

        /* Card */
        .rp-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: rgba(18, 8, 36, 0.82);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(139,92,246,0.4);
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 32px 80px rgba(0,0,0,0.8),
            0 0 80px rgba(109,40,217,0.25);
          animation: rp-slide 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0;
          transform: translateY(28px);
        }
        @keyframes rp-slide { to { opacity: 1; transform: translateY(0); } }

        /* Logo */
        .rp-logo {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.6rem;
          box-shadow: 0 0 24px rgba(139,92,246,0.55);
        }

        /* Heading */
        .rp-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          color: #f5f0ff;
          letter-spacing: -0.035em;
          margin-bottom: 0.4rem;
        }
        .rp-sub {
          font-size: 0.9rem;
          color: #b8a9d9;
          margin-bottom: 1.6rem;
        }

        /* Progress dots */
        .rp-progress {
          display: flex;
          gap: 6px;
          margin-bottom: 1.75rem;
        }
        .rp-dot {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(139,92,246,0.2);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .rp-dot.on {
          background: #8b5cf6;
          box-shadow: 0 0 8px rgba(139,92,246,0.55);
        }

        /* Error */
        .rp-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          font-size: 0.82rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.25rem;
        }

        /* Fields */
        .rp-field { margin-bottom: 1.2rem; }
        .rp-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .rp-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          color: #f0e8ff;
          border: 1px solid rgba(139,92,246,0.4);
          border-radius: 12px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .rp-input::placeholder { color: rgba(196,181,253,0.45); }
        .rp-input:focus {
          border-color: rgba(139,92,246,0.75);
          background: rgba(139,92,246,0.12);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
        }

        /* Button */
        .rp-btn {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 55%, #a855f7 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          font-size: 0.93rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 0.6rem;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 28px rgba(124,58,237,0.5), 0 0 0 1px rgba(168,85,247,0.4);
          position: relative; overflow: hidden;
        }
        .rp-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .rp-btn:hover::before { opacity: 1; }
        .rp-btn:hover { box-shadow: 0 8px 36px rgba(124,58,237,0.6); transform: translateY(-1px); }
        .rp-btn:active { transform: translateY(0); }
        .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* Footer */
        .rp-footer {
          text-align: center;
          font-size: 0.82rem;
          color: #9b8fc0;
          margin-top: 1.75rem;
        }
        .rp-link { color: #a78bfa; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .rp-link:hover { color: #c4b5fd; }

        /* Spinner */
        @keyframes rp-spin { to { transform: rotate(360deg); } }
        .rp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: rp-spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
      `}</style>

      <div className="rp-page">

        {/* Stars */}
        <div className="rp-stars" aria-hidden="true">
          {stars.map((s) => (
            <div key={s.id} className="rp-star" style={{
              width: s.size + 'px', height: s.size + 'px',
              top: s.top + '%', left: s.left + '%',
              '--dur': s.dur + 's',
              '--max-op': s.maxOp,
              '--delay': s.delay + 's',
            }} />
          ))}
        </div>

        <div className="rp-nebula rp-n1" />
        <div className="rp-nebula rp-n2" />

        {/* Centered card */}
        <div className="rp-card">
          <div className="rp-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="rp-heading">Create account</h1>
          <p className="rp-sub">Start bridging your skill gaps today</p>

          {/* Progress indicator */}
          <div className="rp-progress">
            <div className={`rp-dot ${filled >= 1 ? 'on' : ''}`} />
            <div className={`rp-dot ${filled >= 2 ? 'on' : ''}`} />
            <div className={`rp-dot ${filled >= 3 ? 'on' : ''}`} />
          </div>

          {error && <div className="rp-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="rp-field">
              <label className="rp-label">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="rp-input"
                required
              />
            </div>
            <div className="rp-field">
              <label className="rp-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rp-input"
                required
              />
            </div>
            <div className="rp-field">
              <label className="rp-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="rp-input"
                required
              />
            </div>
            <button type="submit" className="rp-btn" disabled={loading}>
              {loading && <span className="rp-spinner" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="rp-footer">
            Already have an account?{" "}
            <Link to="/login" className="rp-link">Sign in</Link>
          </p>
        </div>

      </div>
    </>
  );
}