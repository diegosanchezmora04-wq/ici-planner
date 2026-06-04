'use client'

const NAV = [
  { id: 'overview',     emoji: '⊞', label: 'Vista general'  },
  { id: 'evaluaciones', emoji: '☰', label: 'Evaluaciones'   },
  { id: 'ramos',        emoji: '⊟', label: 'Por ramo'       },
  { id: 'alertas',      emoji: '◎', label: 'Alertas'        },
  { id: 'documentos',   emoji: '📄', label: 'Documentos'     },
]

export function Sidebar({ active, onNav, alertCount, synced, ramosAll, ramosActivos, toggleRamo, seleccionarTodos }) {
  const todosActivos = ramosActivos === null;

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: '#FFFFFF',
      borderRight: '1px solid #EBEBEA',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #EBEBEA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #2D6A4F, #40916C)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: 'white', fontWeight: '600',
          }}>I</div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1A1916', letterSpacing: '-0.3px' }}>
            ICI Planner
          </span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#9B9A97', paddingLeft: '38px' }}>
          Semestre 2026-1
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B9A97', padding: '0 8px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Vistas
        </div>
        {NAV.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', padding: '7px 10px', borderRadius: '6px',
                border: 'none',
                background: isActive ? '#F1F0EF' : 'transparent',
                color: isActive ? '#1A1916' : '#6B6860',
                fontSize: '14px', fontWeight: isActive ? '500' : '400',
                cursor: 'pointer', textAlign: 'left', marginBottom: '2px',
                transition: 'background 0.1s, color 0.1s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F7F6F3' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '16px', opacity: 0.7 }}>{item.emoji}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'alertas' && alertCount > 0 && (
                <span style={{
                  fontSize: '10px', fontWeight: '600',
                  background: '#FFDDD8', color: '#C73A1F',
                  padding: '1px 7px', borderRadius: '10px',
                }}>
                  {alertCount}
                </span>
              )}
            </button>
          )
        })}

        <div style={{ height: '1px', background: '#EBEBEA', margin: '12px 8px' }} />

        {/* Filtro de ramos */}
        {ramosAll && ramosAll.length > 0 && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 8px 6px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '500', color: '#9B9A97', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Mis ramos
              </span>
              {!todosActivos && (
                <button
                  onClick={seleccionarTodos}
                  style={{
                    fontSize: '10px', color: '#2D6A4F', fontWeight: '500',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  Ver todos
                </button>
              )}
            </div>
            {ramosAll.map(r => {
              const activo = todosActivos || (ramosActivos && ramosActivos.includes(r.name));
              return (
                <button
                  key={r.name}
                  onClick={() => toggleRamo(r.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '6px 10px', borderRadius: '6px',
                    border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', marginBottom: '1px',
                    transition: 'background 0.1s',
                    opacity: activo ? 1 : 0.4,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F6F3'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: activo ? r.color : '#C4C2BC',
                    flexShrink: 0, transition: 'background 0.1s',
                  }} />
                  <span style={{
                    fontSize: '12.5px',
                    color: activo ? '#1A1916' : '#9B9A97',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    transition: 'color 0.1s',
                  }}>
                    {r.name}
                  </span>
                </button>
              )
            })}

            <div style={{ height: '1px', background: '#EBEBEA', margin: '12px 8px' }} />
          </>
        )}

        <div style={{ fontSize: '11px', fontWeight: '500', color: '#9B9A97', padding: '0 8px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Datos
        </div>
        <button
          onClick={() => onNav('reload')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: '7px 10px', borderRadius: '6px',
            border: 'none', background: 'transparent',
            color: '#6B6860', fontSize: '14px', cursor: 'pointer',
            textAlign: 'left', transition: 'background 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F7F6F3'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '16px', opacity: 0.7 }}>↻</span>
          Actualizar datos
        </button>
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #EBEBEA', fontSize: '11.5px', color: '#9B9A97' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <span style={{
            display: 'inline-block', width: '6px', height: '6px',
            borderRadius: '50%', background: '#2D6A4F',
          }} />
          En vivo desde Sheets
        </div>
        {synced && (
          <div style={{ fontFamily: 'monospace', fontSize: '10.5px' }}>
            Sync {synced.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </aside>
  )
}