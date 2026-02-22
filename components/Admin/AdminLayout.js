import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/AdminLayout.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/projects', label: 'Projects', icon: '◆' },
  { href: '/admin/logs', label: 'Dev Logs', icon: '▣' },
  { href: '/admin/media', label: 'Media', icon: '▤' },
  { href: '/admin/social', label: 'Social Generator', icon: '◩' },
  { href: '/admin/sphere', label: 'Sphere Config', icon: '◎' },
  { href: '/admin/cv', label: 'CV Generator', icon: '▧', disabled: true },
];

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token
    fetch('/api/admin/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          router.push('/admin/login');
        } else {
          setUser(userData ? JSON.parse(userData) : { username: 'admin' });
          setLoading(false);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Initializing...</span>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Link href="/admin" className={styles.logo}>
            <span className={styles.logoIcon}>&#9654;</span>
            {!sidebarCollapsed && (
              <span className={styles.logoText}>DEVLOG</span>
            )}
          </Link>
          <button 
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '»' : '«'}
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.disabled && <span className={styles.comingSoon}>soon</span>}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userIcon}>&#9679;</span>
            {!sidebarCollapsed && (
              <span className={styles.userName}>{user?.username}</span>
            )}
          </div>
          <button 
            className={styles.logoutBtn} 
            onClick={handleLogout}
            title="Logout"
          >
            {sidebarCollapsed ? '⏻' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <div className={styles.headerActions}>
            <Link href="/" className={styles.viewSiteBtn} target="_blank">
              View Site
              <span className={styles.externalIcon}>↗</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
