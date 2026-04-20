import './globals.css'

export const metadata = {
  title: 'عيادة خطوة | Khatwah Clinic',
  description: 'نظام حجز المواعيد والإدارة الطبية',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'عيادة خطوة',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#06B6D4',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
