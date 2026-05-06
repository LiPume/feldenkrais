import Link from 'next/link';

const highlights = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    label: '随时练习',
    text: '按身体部位查找，随时开始',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
      </svg>
    ),
    label: '记录觉察',
    text: '记录每个部位的练习感受',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    label: '追踪变化',
    text: '回顾练习历史与反馈轨迹',
  },
];

export default function PublicHome() {
  return (
    <div className="public-home">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="section-eyebrow hero-eyebrow">身体觉察</p>
            <h1 className="hero-title">
              感知身体<br />
              <em>觉察当下</em>
            </h1>
            <p className="hero-desc">
              费登奎斯练习与反馈记录。按身体部位查找练习，记录每个部位的感知变化，在历史中看见自己的成长轨迹。
            </p>
            <div className="hero-actions">
              <Link href="/login" className="btn-primary">
                开始使用
              </Link>
              <Link href="/practice-search" className="btn-secondary">
                浏览练习
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-card--float-1">
              <div className="hero-card-dot" />
              <span>肩颈</span>
            </div>
            <div className="hero-card hero-card--float-2">
              <div className="hero-card-dot" />
              <span>脊柱</span>
            </div>
            <div className="hero-card hero-card--float-3">
              <div className="hero-card-dot" />
              <span>髋部</span>
            </div>
          </div>
        </div>

        {/* Decorative background */}
        <div className="hero-bg-circle hero-bg-circle--1" />
        <div className="hero-bg-circle hero-bg-circle--2" />
      </section>

      {/* ── Highlights ───────────────────────────────────────────────── */}
      <section className="highlights-section">
        <div className="container-main">
          <div className="highlights-grid stagger-children">
            {highlights.map((item) => (
              <div key={item.label} className="highlight-card card animate-fade-in-up">
                <div className="highlight-icon">{item.icon}</div>
                <h3 className="highlight-label">{item.label}</h3>
                <p className="highlight-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container-main">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">准备好开始了吗</h2>
              <p className="cta-desc">
                使用学号注册，开始记录你的练习与觉察之旅。
              </p>
            </div>
            <Link href="/login" className="btn-primary cta-btn">
              登录 / 注册
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
