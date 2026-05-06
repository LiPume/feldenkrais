export default function Loading() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 4rem - 5rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--color-text-muted)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '0.875rem' }}>正在验证身份...</span>
      </div>
    </div>
  );
}
