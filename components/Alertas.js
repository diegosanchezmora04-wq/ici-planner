import { getWeekN, nivelInfo, fRango, fDateLong } from '@/lib/utils'
import { Card } from './Card'

export function Alertas({ evals }) {
  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const bySem = {}
  evals.filter(e=>e.fecha>=hoy&&e.fecha<=en14).forEach(e=>{
    const n=getWeekN(e.fecha)
    if(!bySem[n]) bySem[n]=[]
    bySem[n].push(e)
  })
  const semanas = Object.keys(bySem).map(Number).sort((a,b)=>a-b)

  if (semanas.length===0) return (
    <Card>
      <div style={{ padding: '48px', textAlign: 'center', fontSize: '13px', color: '#9B9A97' }}>
        Sin evaluaciones en los próximos 14 días. ✓
      </div>
    </Card>
  )

  return (
    <Card>
      {semanas.map(n=>{
        const evs=bySem[n].sort((a,b)=>a.fecha-b.fecha)
        const nivel=nivelInfo(evs.length)
        return (
          <div key={n} style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            padding: '16px 20px', borderBottom: '1px solid #F3F3F1',
            transition: 'background 0.1s',
          }}
            onMouseEnter={e=>e.currentTarget.style.background='#FAFAF8'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0, background: nivel.bg,
            }}>
              {nivel.ico}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                Semana {n} — {fRango(n)}
                <span style={{ fontWeight: '400', color: '#9B9A97' }}> · {evs.length} evaluación(es)</span>
              </div>
              {evs.map((e,i)=>(
                <div key={i} style={{ fontSize: '12px', color: '#6B6860', lineHeight: 1.7 }}>
                  <span style={{ fontWeight: '600', color: '#1A1916' }}>{e.ramo}</span>
                  {' — '}{e.tipo}
                  {e.cont ? ': ' + e.cont.slice(0,70) + '…' : ' · ' + fDateLong(e.fecha)}
                </div>
              ))}
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '500',
              padding: '3px 10px', borderRadius: '20px',
              background: nivel.bg, color: nivel.tc,
              flexShrink: 0, marginTop: '2px',
            }}>
              {nivel.lbl}
            </span>
          </div>
        )
      })}
    </Card>
  )
}