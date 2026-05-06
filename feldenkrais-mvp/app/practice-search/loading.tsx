export default function Loading() {
  return (
    <div className="search-page">
      <div className="search-page-inner">
        <div className="search-header animate-fade-in-up">
          <p className="section-eyebrow">费登奎斯</p>
          <h1 className="search-title">找练习</h1>
          <p className="search-subtitle">选择一个身体部位，发现适合你的练习内容。</p>
        </div>
        <div className="search-grid">
          <div className="card search-map-panel">
            <div className="body-map-toggle" style={{ opacity: 0.4 }}>
              <button className="body-map-toggle-btn body-map-toggle-btn--active">正面</button>
              <button className="body-map-toggle-btn">背面</button>
            </div>
            <div style={{ height: 320, background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-md)', opacity: 0.5 }} />
          </div>
          <div className="search-results-panel">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="practice-card" style={{ opacity: 0.5 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ height: 18, width: '60%', background: 'var(--color-border)', borderRadius: 4 }} />
                    <div style={{ height: 14, width: '30%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6 }} />
                    <div style={{ height: 14, width: '80%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.4, marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
