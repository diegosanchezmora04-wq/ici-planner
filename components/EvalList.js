'use client'
import { useState } from 'react'
import { getWeekN, isPast, daysTo, fDate, WEEKS } from '@/lib/utils'
import { Card } from './Card'
import { DaysBadge } from './Badge'

const TABS = [
  { id: 'todas',    label: 'Todas'            },
  { id: 'proximas', label: 'Próximas 14 días' },
  { id: 'criticas', label: 'Semanas críticas' },
]

function EvalItem({ e, rColor }) {
  const days = daysTo(e.fecha)
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '10px 1fr auto',
      gap: '14px',
      alignItems: 'start',
      padding: '14px 20px',
      borderBottom: '1px solid #2A2A2A',
      transition: 'background 120ms ease-out',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#222222'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        marginTop: '4px', flexShrink: 0,
        background: rColor(e.ramo),
      }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: rColor(e.ramo), marginBottom: '2px' }}>
          {e.ramo}
        </div>
        <div style={{ fontSize: '12px', color: '#888888' }}>
          {e.tipo}{e.peso ? ' · ' + e.peso + '%' : ''}
        </div>
        {e.cont && (
          <div style={{ fontSize: '12px', color: '#888888', marginTop: '5px', fontStyle: 'italic', lineHeight: 1.5 }}>
            {e.cont}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#888888' }}>{fDate(e.fecha)}</div>
        <DaysBadge days={days} />
      </div>
    </div>
  )
}

export function EvalList({ evals, rColor }) {
  const [tab, setTab] = useState('todas')
  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const todas = [...evals].sort((a,b) => a.fecha - b.fecha)
  const critNs = new Set()
  for (let n=1; n<=WEEKS; n++)
    if (!isPast(n) && evals.filter(e=>getWeekN(e.fecha)===n).length>=4) critNs.add(n)
  const lists = {
    todas,
    proximas: todas.filter(e => e.fecha >= hoy && e.fecha <= en14),
    criticas: todas.filter(e => critNs.has(getWeekN(e.fecha))),
  }
  const current = lists[tab]

  return (
    <Card>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2A2A2A', padding: '0 4px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: tab === t.id ? '500' : '400',
              color: tab === t.id ? '#F0F0F0' : '#888888',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid #F0F0F0' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'color 120ms ease-out, border-color 120ms ease-out',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {current.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#888888', fontSize: '13px' }}>
          Sin evaluaciones en esta vista.
        </div>
      ) : (
        current.map((e, i) => <EvalItem key={i} e={e} rColor={rColor} />)
      )}
    </Card>
  )
}
