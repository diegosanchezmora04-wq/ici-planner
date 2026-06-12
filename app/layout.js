import './globals.css'

export const metadata = {
  title: 'ICI Planner',
  description: 'Dashboard académico colaborativo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" style={{ height: '100%' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        height: '100%',
        margin: 0,
        background: '#0F0F0F',
        color: '#F0F0F0',
      }}>
        {children}
      </body>
    </html>
  )
}