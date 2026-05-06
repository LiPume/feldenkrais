export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div style={{ height: 20, width: 80, background: 'var(--color-border)', borderRadius: 4, marginBottom: 24, opacity: 0.5 }} />
      <div style={{ marginBottom: 32, opacity: 0.5 }}>
        <div style={{ height: 32, width: '35%', background: 'var(--color-border)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 14, width: '20%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6, marginBottom: 4 }} />
        <div style={{ height: 14, width: '25%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.4 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card session-card" style={{ opacity: 0.5 }}>
            <div className="session-card-header">
              <div style={{ flex: 1 }}>
                <div style={{ height: 18, width: '45%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 14, width: '25%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              {[1, 2].map((j) => (
                <div key={j} style={{ background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', opacity: 0.6 }}>
                  <div style={{ height: 14, width: '20%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 12, width: '65%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.5 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
