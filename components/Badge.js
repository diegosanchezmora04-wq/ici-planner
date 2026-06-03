import { badge } from '@/lib/utils'

export function DaysBadge({ days }) {
  const b = badge(days)
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: '500',
      padding: '2px 8px',
      borderRadius: '20px',
      marginTop: '4px',
      background: b.bg,
      color: b.tc,
      fontFamily: 'monospace',
    }}>
      {b.txt}
    </span>
  )
}

export function NivelBadge({ nivel }) {
  return (
    <span style={{
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px 12px',
      borderRadius: '20px',
      background: nivel.bg,
      color: nivel.tc,
    }}>
      {nivel.ico} {nivel.lbl}
    </span>
  )
}