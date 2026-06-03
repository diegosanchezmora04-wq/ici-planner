export function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        border: '1px solid #EBEBEA',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}