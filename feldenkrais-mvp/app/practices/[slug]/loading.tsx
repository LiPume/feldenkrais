export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div style={{ height: 20, width: 80, background: 'var(--color-border)', borderRadius: 4, marginBottom: 24, opacity: 0.5 }} />
      <div style={{ marginBottom: 24, opacity: 0.5 }}>
        <div style={{ height: 32, width: '70%', background: 'var(--color-border)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 14, width: '30%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, opacity: 0.5 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 28, width: 80, background: 'var(--color-border)', borderRadius: 999, opacity: 0.6 }} />
        ))}
      </div>
      <div style={{ height: 56, background: 'var(--color-border)', borderRadius: 12, marginBottom: 32, opacity: 0.4 }} />
      <div style={{ background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-xl)', padding: '1rem', marginBottom: 24, opacity: 0.5 }}>
        <div style={{ height: 16, width: '45%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 14, width: '80%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.5 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ height: 14, width: `${60 + (i % 3) * 15}%`, background: 'var(--color-border)', borderRadius: 4 }} />
        ))}
      </div>
    </div>
  );
}
