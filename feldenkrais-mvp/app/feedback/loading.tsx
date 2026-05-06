export default function Loading() {
  return (
    <div className="page-container">
      <div className="page-header animate-fade-in-up">
        <div>
          <p className="section-eyebrow">我的</p>
          <h1 className="page-title">反馈记录</h1>
          <p className="page-subtitle">
            在时间轴中回看练习感受，看见自己的变化轨迹。
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card session-card" style={{ opacity: 0.5 }}>
            <div className="session-card-header">
              <div style={{ flex: 1 }}>
                <div style={{ height: 18, width: '40%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 14, width: '25%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              {[1, 2].map((j) => (
                <div key={j} style={{ background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', opacity: 0.6 }}>
                  <div style={{ height: 14, width: '20%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 12, width: '60%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.5 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
