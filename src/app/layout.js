import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Khatwah Clinic - Dental Reservation',
  description: 'Professional dental care reservation system in Arish, Egypt',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-bg-main">
          {children}
        </main>
      </body>
    </html>
  );
}
