import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Force dark bg all the way up */
        html, body { background: #07050f !important; height: 100%; }

        .login-page {
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
        .lp-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .lp-star {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          animation: lp-twinkle var(--dur) ease-in-out infinite alternate;
          animation-delay: var(--delay);
          opacity: 0;
        }
        @keyframes lp-twinkle {
          from { opacity: 0.04; }
          to   { opacity: var(--max-op); }
        }

        /* Nebula */
        .lp-nebula { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
        .lp-n1 {
          width: 550px; height: 550px;
          background: radial-gradient(circle, rgba(109,40,217,0.5) 0%, transparent 70%);
          top: -140px; left: -140px;
          animation: lp-d1 18s ease-in-out infinite alternate;
        }
        .lp-n2 {
          width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%);
          bottom: -100px; right: -100px;
          animation: lp-d2 14s ease-in-out infinite alternate;
        }
        .lp-n3 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%);
          top: 45%; left: 55%;
          animation: lp-d3 22s ease-in-out infinite alternate;
        }
        @keyframes lp-d1 { to { transform: translate(60px,40px) scale(1.1); } }
        @keyframes lp-d2 { to { transform: translate(-40px,-50px) scale(1.08); } }
        @keyframes lp-d3 { to { transform: translate(-30px,30px); } }

        /* Card — dark semi-opaque, NOT transparent */
        .lp-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
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
          animation: lp-slide 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0;
          transform: translateY(28px);
        }
        @keyframes lp-slide { to { opacity: 1; transform: translateY(0); } }

        /* Logo */
        .lp-logo {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.6rem;
          box-shadow: 0 0 24px rgba(139,92,246,0.55);
        }

        /* Heading */
        .lp-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          color: #f5f0ff;
          letter-spacing: -0.035em;
          margin-bottom: 0.4rem;
        }
        .lp-sub {
          font-size: 0.9rem;
          color: #b8a9d9;
          font-weight: 400;
          margin-bottom: 2.25rem;
        }

        /* Error */
        .lp-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          font-size: 0.82rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.25rem;
        }

        /* Fields */
        .lp-field { margin-bottom: 1.2rem; }
        .lp-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .lp-input {
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
        .lp-input::placeholder { color: rgba(196,181,253,0.45); }
        .lp-input:focus {
          border-color: rgba(139,92,246,0.75);
          background: rgba(139,92,246,0.12);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
        }

        /* Button */
        .lp-btn {
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
        .lp-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .lp-btn:hover::before { opacity: 1; }
        .lp-btn:hover { box-shadow: 0 8px 36px rgba(124,58,237,0.6); transform: translateY(-1px); }
        .lp-btn:active { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* Footer */
        .lp-footer {
          text-align: center;
          font-size: 0.82rem;
          color: #9b8fc0;
          margin-top: 1.75rem;
        }
        .lp-link { color: #a78bfa; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .lp-link:hover { color: #c4b5fd; }

        /* Spinner */
        @keyframes lp-spin { to { transform: rotate(360deg); } }
        .lp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lp-spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
      `}</style>

      <div className="login-page">

        {/* Stars */}
        <div className="lp-stars" aria-hidden="true">
          {stars.map((s) => (
            <div key={s.id} className="lp-star" style={{
              width: s.size + 'px', height: s.size + 'px',
              top: s.top + '%', left: s.left + '%',
              '--dur': s.dur + 's',
              '--max-op': s.maxOp,
              '--delay': s.delay + 's',
            }} />
          ))}
        </div>

        <div className="lp-nebula lp-n1" />
        <div className="lp-nebula lp-n2" />
        <div className="lp-nebula lp-n3" />

        {/* Centered card */}
        <div className="lp-card">
          <div className="lp-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="lp-heading">Welcome back</h1>
          <p className="lp-sub">Sign in to continue your journey</p>

          {error && <div className="lp-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="lp-field">
              <label className="lp-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="lp-input"
                required
              />
            </div>
            <div className="lp-field">
              <label className="lp-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="lp-input"
                required
              />
            </div>
            <button type="submit" className="lp-btn" disabled={loading}>
              {loading && <span className="lp-spinner" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="lp-footer">
            No account?{" "}
            <Link to="/register" className="lp-link">Create one</Link>
          </p>
        </div>

      </div>
    </>
  );
}