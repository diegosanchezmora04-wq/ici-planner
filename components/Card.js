export function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: '#1A1A1A',
        border: '1px solid #2A2A2A',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
