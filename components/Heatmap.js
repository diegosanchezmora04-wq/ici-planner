'use client'
import { useState } from 'react'
import { WEEKS, weekStart, getWeekN, isPast, heatClass, nivelInfo, fDate, fRango } from '@/lib/utils'
import { Card } from './Card'
import { NivelBadge } from './Badge'

const HEAT_STYLES = {
  c0: { background: '#EDF7F0', color: '#2D6A4F' },
  c1: { background: '#D1FAE5', color: '#065F46' },
  c2: { background: '#FEF9C3', color: '#854D0E' },
  c3: { background: '#FED7AA', color: '#9A3412' },
  c4: { background: '#FEE2E2', color: '#991B1B' },
  cp: { background: '#F7F6F3', color: '#C4C2BC' },
}

const LEGEND = [
  { bg: '#F7F6F3', label: 'Pasada'       },
  { bg: '#EDF7F0', label: 'Libre'        },
  { bg: '#D1FAE5', label: 'Baja (1)'     },
  { bg: '#FEF9C3', label: 'Moderada (2)' },
  { bg: '#FED7AA', label: 'Alta (3)'     },
  { bg: '#FEE2E2', label: 'Crítica (4+)' },
]

export function Heatmap({ evals, rColor }) {
  const [sel, setSel] = useState(null)
  const evalsForWeek = n => evals.filter(e => getWeekN(e.fecha) === n)

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
          const evs  = evalsForWeek(n)
          const past = isPast(n)
          const cls  = heatClass(n, evs.length)
          const st   = HEAT_STYLES[cls]
          const isSel = sel === n
          return (
            <button
              key={n}
              onClick={() => handleClick(n)}
              disabled={past}
              style={{
                ...st,
                aspectRatio: '1',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 4px',
                border: isSel ? '2px solid #1A1916' : '2px solid transparent',
                cursor: past ? 'default' : 'pointer',
                opacity: past ? 0.45 : 1,
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: isSel ? '0 0 0 3px rgba(26,25,22,0.1)' : 'none',
              }}
              onMouseEnter={e => { if (!past) e.currentTarget.style.transform = 'scale(1.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
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
          borderTop: '1px solid #EBEBEA',
          padding: '20px',
          background: '#FAFAF8',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A1916' }}>
              Semana {sel} — {fRango(sel)}
            </span>
            <NivelBadge nivel={nivel} />
          </div>
          {selEvs.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#9B9A97' }}>
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
                    <div style={{ fontSize: '12px', color: '#9B9A97' }}>
                      {e.tipo}{e.peso ? ' · ' + e.peso + '%' : ''} · {fDate(e.fecha)}
                    </div>
                    {e.cont && (
                      <div style={{ fontSize: '12px', color: '#6B6860', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.5 }}>
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
        borderTop: '1px solid #EBEBEA',
        background: '#FAFAF8',
      }}>
        {LEGEND.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: l.bg, border: '1px solid rgba(0,0,0,0.06)' }} />
            <span style={{ fontSize: '11px', color: '#9B9A97' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}