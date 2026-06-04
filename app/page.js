'use client'
import { useState } from 'react'
import { useData } from '@/lib/useData'
import { Sidebar } from '@/components/Sidebar'
import { Heatmap } from '@/components/Heatmap'
import { EvalList } from '@/components/EvalList'
import { RamoGrid } from '@/components/RamoGrid'
import { Alertas } from '@/components/Alertas'
import { getWeekN, daysTo, WEEKS, isPast, fDate } from '@/lib/utils'
import { Documentos } from '@/components/Documentos'

function Metrics({ evals, ramos }) {
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  let crit = 0
  for (let n=1; n<=WEEKS; n++)
    if (!isPast(n) && evals.filter(e=>getWeekN(e.fecha)===n).length>=4) crit++
  const up = [...evals].filter(e=>e.fecha>=hoy).sort((a,b)=>a.fecha-b.fecha)
  const nx = up[0]

  const cards = [
    {
      label: 'Evaluaciones registradas',
      value: evals.length,
      sub: 'en el semestre',
      color: '#1A1916',
    },
    {
      label: 'Semanas críticas',
      value: crit,
      sub: 'con 4+ evaluaciones',
      color: crit > 0 ? '#C73A1F' : '#1A1916',
    },
    {
      label: 'Próxima evaluación',
      value: nx ? nx.tipo : 'Sin próximas',
      sub: nx ? `${nx.ramo} · ${fDate(nx.fecha)}` : '—',
      color: '#1A1916',
      small: true,
    },
    {
      label: 'Ramos activos',
      value: ramos.length,
      sub: 'este semestre',
      color: '#1A1916',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '12px', marginBottom: '24px' }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: '#FFFFFF',
          border: '1px solid #EBEBEA',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '12px', color: '#9B9A97', marginBottom: '8px', fontWeight: '500' }}>
            {c.label}
          </div>
          <div style={{
            fontSize: c.small ? '16px' : '30px',
            fontWeight: c.small ? '600' : '300',
            letterSpacing: c.small ? '-0.3px' : '-1px',
            color: c.color,
            lineHeight: 1.1,
            marginBottom: '6px',
          }}>
            {c.value}
          </div>
          <div style={{ fontSize: '12px', color: '#9B9A97' }}>{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

const PAGES = {
  overview:     { title: 'Vista general',   sub: 'Semestre 2026-1 · datos en vivo desde Google Sheets' },
  evaluaciones: { title: 'Evaluaciones',    sub: 'Todas las evaluaciones con contenidos registrados'    },
  ramos:        { title: 'Por ramo',        sub: 'Carga y evaluaciones desglosadas por asignatura'      },
  alertas:      { title: 'Alertas',         sub: 'Evaluaciones en los próximos 14 días'                 },
  documentos:   { title: 'Documentos',      sub: 'Pautas, certámenes anteriores y material de estudio'  },
}

export default function Home() {
  const [page, setPage] = useState('overview')
  const { evals, docs, ramos, ramosAll, ramosActivos, toggleRamo, seleccionarTodos, loading, error, synced, reload, rColor } = useData()

  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const alertCount = evals.filter(e=>e.fecha>=hoy&&e.fecha<=en14).length

  const handleNav = id => {
    if (id === 'reload') { reload(); return }
    setPage(id)
  }

  const current = PAGES[page]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAF8' }}>
      <Sidebar active={page} onNav={handleNav} alertCount={alertCount} synced={synced} ramosAll={ramosAll} ramosActivos={ramosActivos} toggleRamo={toggleRamo} seleccionarTodos={seleccionarTodos} />
      <main style={{ flex: 1, minWidth: 0, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', width: '100%' }}>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FFF0F0', border: '1px solid #FCA5A5',
              borderRadius: '8px', padding: '12px 16px',
              fontSize: '13px', color: '#C73A1F', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#9B9A97', fontSize: '14px', gap: '10px' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '18px' }}>↻</span>
              Cargando datos del curso...
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '4px', color: '#1A1916' }}>
                    {current.title}
                  </h1>
                  <p style={{ fontSize: '13px', color: '#9B9A97', margin: 0 }}>{current.sub}</p>
                </div>
                <button
                  onClick={reload}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px',
                    border: '1px solid #EBEBEA', background: '#FFFFFF',
                    fontSize: '13px', fontWeight: '500', color: '#6B6860',
                    cursor: 'pointer', transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F6F3'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  ↻ Actualizar
                </button>
              </div>

              {/* Contenido por página */}
              {page === 'overview' && (
                <>
                  <Metrics evals={evals} ramos={ramos} />
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1916', marginBottom: '12px' }}>
                    Mapa de carga semanal
                  </div>
                  <Heatmap evals={evals} rColor={rColor} />
                </>
              )}
              {page === 'evaluaciones' && <EvalList evals={evals} rColor={rColor} />}
              {page === 'ramos'        && <RamoGrid evals={evals} ramos={ramos} rColor={rColor} />}
              {page === 'alertas'      && <Alertas evals={evals} />}
              {page === 'documentos' && <Documentos docs={docs} ramos={ramos} rColor={rColor} />}
            </>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}