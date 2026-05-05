export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
    }}>
      <div
        aria-label="Cargando"
        style={{
          width: '44px',
          height: '44px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2b7bb8',
          borderRadius: '50%',
          animation: 'qcSpin 0.9s linear infinite',
        }}
      />
      <style>{`@keyframes qcSpin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
