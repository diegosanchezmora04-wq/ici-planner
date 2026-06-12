'use client'
import { useState } from 'react'
import { Card } from './Card'

const TIPO_ICONS = {
  'Pauta':              '📋',
  'Certamen anterior':  '📝',
  'Guia de ejercicios': '📚',
  'Apunte':             '📄',
  'Otro':               '📎',
}

export function Documentos({ docs, ramos, rColor }) {
  const [openRamos, setOpenRamos] = useState(new Set())

  const toggle = ramo => {
    setOpenRamos(prev => {
      const next = new Set(prev)
      if (next.has(ramo)) next.delete(ramo)
      else next.add(ramo)
      return next
    })
  }

  if (docs.length === 0) {
    return (
      <Card>
        <div style={{ padding: '48px', textAlign: 'center', fontSize: '13px', color: '#888888' }}>
          Sin documentos aun. Se el primero en agregar uno!
        </div>
      </Card>
    )
  }

  const porRamo = {}
  docs.forEach(d => {
    if (!porRamo[d.ramo]) porRamo[d.ramo] = []
    porRamo[d.ramo].push(d)
  })

  const ramosOrdenados = ramos
    .map(r => r.name)
    .filter(name => porRamo[name])

  Object.keys(porRamo).forEach(name => {
    if (!ramosOrdenados.includes(name)) ramosOrdenados.push(name)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {ramosOrdenados.map(ramo => {
        const isOpen = openRamos.has(ramo)
        return (
          <Card key={ramo}>
            {/* Header colapsable */}
            <button
              onClick={() => toggle(ramo)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 20px',
                width: '100%', border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left',
                borderBottom: isOpen ? '1px solid #2A2A2A' : 'none',
              }}
            >
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: rColor(ramo), flexShrink: 0,
              }} />
              <div style={{ fontSize: '14px', fontWeight: '600', flex: 1, color: '#F0F0F0' }}>
                {ramo}
              </div>
              <div style={{ fontSize: '12px', color: '#888888', marginRight: '8px' }}>
                {porRamo[ramo].length} documento{porRamo[ramo].length !== 1 ? 's' : ''}
              </div>
              <span style={{
                fontSize: '10px', color: '#888888',
                display: 'inline-block',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}>▶</span>
            </button>

            {/* Lista desplegable */}
            <div style={{
              overflow: 'hidden',
              maxHeight: isOpen ? '2000px' : '0',
              transition: isOpen
                ? 'max-height 300ms cubic-bezier(0.23, 1, 0.32, 1)'
                : 'max-height 200ms ease-out',
            }}>
              {porRamo[ramo].map((doc, i) => (
                <a
                  key={i}
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '13px 20px',
                    borderBottom: i < porRamo[ramo].length - 1 ? '1px solid #2A2A2A' : 'none',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'background 120ms ease-out',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#222222'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    background: '#252525',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '17px', flexShrink: 0,
                  }}>
                    {TIPO_ICONS[doc.tipo] || '📎'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#F0F0F0', marginBottom: '2px' }}>
                      {doc.titulo}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888888' }}>
                      {doc.tipo}{doc.autor ? ' · ' + doc.autor : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', color: '#888888', flexShrink: 0 }}>↗</div>
                </a>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
