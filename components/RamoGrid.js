import { daysTo, fDate } from '@/lib/utils'
import { Card } from './Card'
import { DaysBadge } from './Badge'

export function RamoGrid({ evals, ramos, rColor }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '12px' }}>
      {ramos.map(r => {
        const evs = [...evals].filter(e=>e.ramo===r.name).sort((a,b)=>a.fecha-b.fecha)
        const tot = evs.reduce((s,e)=>s+(parseFloat(e.peso)||0),0)
        return (
          <Card key={r.name}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '16px 20px', borderBottom: '1px solid #EBEBEA',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
              <div style={{ fontSize: '14px', fontWeight: '600', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.name}
              </div>
              <div style={{ fontSize: '12px', color: '#9B9A97', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                {evs.length} ev{tot ? ' · ' + tot + '%' : ''}
              </div>
            </div>
            {evs.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#9B9A97' }}>
                Sin evaluaciones registradas.
              </div>
            ) : evs.map((e, i) => {
              const days = daysTo(e.fecha)
              return (
                <div key={i} style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #F3F3F1',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{e.tipo}</div>
                    <div style={{ fontSize: '11px', color: '#9B9A97', marginTop: '2px' }}>
                      {e.peso ? e.peso + '% · ' : ''}{fDate(e.fecha)}
                    </div>
                    {e.cont && (
                      <div style={{ fontSize: '11px', color: '#6B6860', marginTop: '4px', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {e.cont.slice(0,80)}{e.cont.length>80?'…':''}
                      </div>
                    )}
                  </div>
                  {days >= 0 && <DaysBadge days={days} />}
                </div>
              )
            })}
          </Card>
        )
      })}
    </div>
  )
}