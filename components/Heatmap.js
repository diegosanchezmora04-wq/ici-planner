'use client'
import { useState } from 'react'
import { WEEKS, weekStart, getWeekN, isPast, heatClass, nivelInfo, fDate, fRango } from '@/lib/utils'
import { Card } from './Card'
import { NivelBadge } from './Badge'

const HEAT_STYLES = {
  c0: { background: '#1A2D22', color: '#6EE7B7' },
  c1: { background: '#0F2E1A', color: '#4ADE80' },
  c2: { background: '#2C2200', color: '#FDE68A' },
  c3: { background: '#2C1400', color: '#FDBA74' },
  c4: { background: '#2C0A0A', color: '#FCA5A5' },
  cp: { background: '#1E1E1E', color: '#444444' },
}

const LEGEND = [
  { bg: '#1E1E1E', label: 'Pasada'       },
  { bg: '#1A2D22', label: 'Libre'        },
  { bg: '#0F2E1A', label: 'Baja (1)'     },
  { bg: '#2C2200', label: 'Moderada (2)' },
  { bg: '#2C1400', label: 'Alta (3)'     },
  { bg: '#2C0A0A', label: 'Crítica (4+)' },
]

export function Heatmap({ evals, rColor }) {
  const [sel, setSel] = useState(null)
  const [hoveredWeek, setHoveredWeek] = useState(null)
  const [pressedWeek, setPressedWeek] = useState(null)
  const evalsForWeek = n => evals.filter(e => getWeekN(e.fecha) === n)
  const currentWeek  = getWeekN(new Date())

  const handleClick = n => {
    if (isPast(n)) return
    setSel(sel === n ? null : n)
  }

  const selEvs = sel ? evalsForWeek(sel) : []
  const nivel  = sel ? nivelInfo(selEvs.length) : null

  return (
    <Card>
      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
        gap: '6px',
        padding: '20px',
      }}>
        {Array.from({ length: WEEKS }, (_, i) => i + 1).map(n => {
          const evs       = evalsForWeek(n)
          const past      = isPast(n)
          const cls       = heatClass(n, evs.length)
          const st        = HEAT_STYLES[cls]
          const isSel     = sel === n
          const isHovered = hoveredWeek === n
          const isPressed = pressedWeek === n
          const isCurrent = n === currentWeek
          return (
            <button
              key={n}
              onClick={() => handleClick(n)}
              disabled={past}
              onMouseEnter={() => { if (!past) setHoveredWeek(n) }}
              onMouseLeave={() => { setHoveredWeek(null); setPressedWeek(null) }}
              onMouseDown={() => { if (!past) setPressedWeek(n) }}
              onMouseUp={() => setPressedWeek(null)}
              style={{
                ...st,
                aspectRatio: '1',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 4px',
                border: isSel ? '2px solid #F0F0F0' : '2px solid transparent',
                outline: isCurrent ? '2px solid #F0F0F0' : 'none',
                outlineOffset: isCurrent ? '2px' : undefined,
                cursor: past ? 'default' : 'pointer',
                opacity: past ? 0.45 : 1,
                transition: 'transform 150ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 150ms ease-out',
                transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.04)' : 'scale(1)',
                boxShadow: isHovered && !isPressed
                  ? '0 4px 20px rgba(0,0,0,0.5)'
                  : isSel ? '0 0 0 3px rgba(255,255,255,0.08)' : 'none',
                animation: `fadeInUp 220ms cubic-bezier(0.23, 1, 0.32, 1) ${(n - 1) * 30}ms both`,
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '600', lineHeight: 1 }}>S{n}</span>
              <span style={{ fontSize: '9px', marginTop: '3px', opacity: 0.75, fontFamily: 'monospace' }}>
                {past ? '—' : evs.length + ' ev'}
              </span>
              <span style={{ fontSize: '8px', marginTop: '2px', opacity: 0.55 }}>
                {fDate(weekStart(n))}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detalle */}
      {sel && (
        <div style={{
          borderTop: '1px solid #2A2A2A',
          padding: '20px',
          background: '#161616',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#F0F0F0' }}>
              Semana {sel} — {fRango(sel)}
            </span>
            <NivelBadge nivel={nivel} />
          </div>
          {selEvs.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888888' }}>
              Sin evaluaciones. Semana ideal para adelantar contenidos.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selEvs.sort((a, b) => a.fecha - b.fecha).map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '3px', borderRadius: '3px',
                    alignSelf: 'stretch', minHeight: '40px', flexShrink: 0,
                    background: rColor(e.ramo),
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: rColor(e.ramo), marginBottom: '2px' }}>
                      {e.ramo}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888888' }}>
                      {e.tipo}{e.peso ? ' · ' + e.peso + '%' : ''} · {fDate(e.fecha)}
                    </div>
                    {e.cont && (
                      <div style={{ fontSize: '12px', color: '#888888', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.5 }}>
                        {e.cont}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leyenda */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px',
        padding: '12px 20px',
        borderTop: '1px solid #2A2A2A',
        background: '#161616',
      }}>
        {LEGEND.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: l.bg, border: '1px solid rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '11px', color: '#888888' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
