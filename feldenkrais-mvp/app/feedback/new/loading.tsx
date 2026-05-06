export default function Loading() {
  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ height: 20, width: 80, background: 'var(--color-border)', borderRadius: 4, marginBottom: 24, opacity: 0.5 }} />
      <div style={{ marginBottom: 24, opacity: 0.5 }}>
        <div style={{ height: 32, width: '50%', background: 'var(--color-border)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 14, width: '35%', background: 'var(--color-border)', borderRadius: 4, opacity: 0.6 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, opacity: 0.5 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 28, width: 80, background: 'var(--color-border)', borderRadius: 999, opacity: 0.6 }} />
        ))}
      </div>
      <div style={{ height: 48, background: 'var(--color-border)', borderRadius: 12, marginBottom: 32, opacity: 0.4 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: 16, width: `${55 + (i % 4) * 12}%`, background: 'var(--color-border)', borderRadius: 4 }} />
        ))}
      </div>
    </div>
  );
}
