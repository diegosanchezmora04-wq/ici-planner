// components/ResumenIA.js
// Generación manual: el usuario hace clic cuando tiene sus ramos listos.
// Evita llamadas automáticas por cada toggle de ramo.

'use client'
import { useState } from 'react'

export default function ResumenIA({ ramos: ramosProp }) {
  const [resumen,  setResumen]  = useState('')
  const [cargando, setCargando] = useState(false)
  const [esError,  setEsError]  = useState(false)
  const [generado, setGenerado] = useState(false)

  const getRamos = () =>
    ramosProp !== undefined
      ? ramosProp
      : JSON.parse(localStorage.getItem('ici-ramos-activos') || '[]')

  const generar = () => {
    const ramos = getRamos()

    if (!ramos.length) {
      setResumen('Selecciona tus ramos activos primero.')
      setGenerado(true)
      return
    }

    setCargando(true)
    setEsError(false)

    const params = new URLSearchParams({ ramos: ramos.join(',') })

    fetch(`/api/resumen?${params}`)
      .then(r => r.json())
      .then(data => {
        setResumen(data.resumen || 'Sin resumen disponible.')
        setEsError(!!data.error)
        setGenerado(true)
      })
      .catch(() => {
        setResumen('No se pudo cargar el resumen. Intenta más tarde.')
        setEsError(true)
        setGenerado(true)
      })
      .finally(() => setCargando(false))
  }

  return (
    <div style={{ marginTop: '24px' }}>

      {/* Título + botón en la misma fila */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1916' }}>
          ✨ Resumen IA
        </div>
        <button
          onClick={generar}
          disabled={cargando}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            border: '1px solid #EBEBEA', background: '#FFFFFF',
            fontSize: '12px', fontWeight: '500', color: '#6B6860',
            cursor: cargando ? 'not-allowed' : 'pointer',
            opacity: cargando ? 0.6 : 1,
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { if (!cargando) e.currentTarget.style.background = '#F7F6F3' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF' }}
        >
          {cargando
            ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>↻</span> Generando…</>
            : generado ? '↻ Regenerar' : '✨ Generar resumen'
          }
        </button>
      </div>

      {/* Tarjeta de contenido */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EBEBEA',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {!generado && !cargando ? (
          <p style={{ fontSize: '13px', color: '#9B9A97', margin: 0 }}>
            Selecciona tus ramos activos y haz clic en <strong>Generar resumen</strong> para recibir recomendaciones personalizadas de priorización.
          </p>
        ) : cargando ? (
          <div style={{ fontSize: '13px', color: '#9B9A97', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>↻</span>
            Analizando tu carga académica…
          </div>
        ) : (
          <p style={{
            fontSize: '13px',
            color: esError ? '#C73A1F' : '#1A1916',
            lineHeight: '1.7',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {resumen}
          </p>
        )}
      </div>

    </div>
  )
}