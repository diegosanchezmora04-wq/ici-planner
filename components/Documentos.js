import { Card } from './Card'

const TIPO_ICONS = {
  'Pauta':              '📋',
  'Certamen anterior':  '📝',
  'Guia de ejercicios': '📚',
  'Apunte':             '📄',
  'Otro':               '📎',
}

export function Documentos({ docs, ramos, rColor }) {
  if (docs.length === 0) {
    return (
      <Card>
        <div style={{ padding: '48px', textAlign: 'center', fontSize: '13px', color: '#9B9A97' }}>
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
      {ramosOrdenados.map(ramo => (
        <Card key={ramo}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 20px', borderBottom: '1px solid #EBEBEA',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: rColor(ramo), flexShrink: 0,
            }} />
            <div style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{ramo}</div>
            <div style={{ fontSize: '12px', color: '#9B9A97' }}>
              {porRamo[ramo].length} documento{porRamo[ramo].length !== 1 ? 's' : ''}
            </div>
          </div>

          {porRamo[ramo].map((doc, i) => (
            <a
              key={i}
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '13px 20px',
                borderBottom: i < porRamo[ramo].length - 1 ? '1px solid #F3F3F1' : 'none',
                textDecoration: 'none', color: 'inherit',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px',
                background: '#F5F4F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '17px', flexShrink: 0,
              }}>
                {TIPO_ICONS[doc.tipo] || '📎'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#1A1916', marginBottom: '2px' }}>
                  {doc.titulo}
                </div>
                <div style={{ fontSize: '11px', color: '#9B9A97' }}>
                  {doc.tipo}{doc.autor ? ' · ' + doc.autor : ''}
                </div>
              </div>
              <div style={{ fontSize: '16px', color: '#9B9A97', flexShrink: 0 }}>↗</div>
            </a>
          ))}
        </Card>
      ))}
    </div>
  )
}