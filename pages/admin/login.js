import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/AdminLogin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem('admin_token', data.data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.data.user));

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | DevLog Pipeline</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        {/* Background effects */}
        <div className={styles.gridOverlay} />
        <div className={styles.scanLines} />

        <div className={styles.loginBox}>
          {/* Terminal header */}
          <div className={styles.terminalHeader}>
            <div className={styles.terminalTitle}>
              <span className={styles.terminalIcon}>&#9654;</span>
              ADMIN CONSOLE
              <span className={styles.terminalVersion}>v1.0.0</span>
            </div>
            <div className={styles.windowButtons}>
              <span className={styles.windowBtn} />
              <span className={styles.windowBtn} />
              <span className={styles.windowBtn} />
            </div>
          </div>

          {/* Login form */}
          <div className={styles.terminalContent}>
            <div className={styles.prompt}>
              <span className={styles.promptSymbol}>&gt;</span>
              <span className={styles.promptText}>AUTHENTICATION REQUIRED</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>&#9632;</span>
                  USERNAME
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  placeholder="enter username"
                  autoComplete="username"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>&#9632;</span>
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="enter password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>&#9888;</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loading}>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span className={styles.btnIcon}>[</span>
                    LOGIN
                    <span className={styles.btnIcon}>]</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.footer}>
              <span className={styles.footerText}>
                DevLog Pipeline Admin Console
              </span>
              <span className={styles.footerDivider}>|</span>
              <a href="/" className={styles.footerLink}>
                Back to site
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
