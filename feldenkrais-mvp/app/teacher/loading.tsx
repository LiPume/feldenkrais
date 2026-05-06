export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-2">
        <div style={{ height: 28, width: 120, background: 'var(--color-border)', borderRadius: 6 }} />
        <div style={{ height: 16, width: 200, background: 'var(--color-border)', borderRadius: 4, opacity: 0.6, marginTop: 8 }} />
      </div>
      <div style={{ height: 48, background: 'var(--color-border)', borderRadius: 12, opacity: 0.4 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 20, opacity: 0.5 }}>
            <div style={{ height: 14, width: '60%', background: 'var(--color-border)', borderRadius: 4 }} />
            <div style={{ height: 32, width: '40%', background: 'var(--color-border)', borderRadius: 4, marginTop: 8 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 20, opacity: 0.5 }}>
            <div style={{ height: 20, width: '50%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 16 }} />
            {[1, 2, 3].map((j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ height: 14, width: '60%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6 }} />
                <div style={{ height: 14, width: 20, background: 'var(--color-border)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
