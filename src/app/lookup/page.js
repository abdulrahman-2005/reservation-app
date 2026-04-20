'use client';

import { useState } from 'react';
import Link from 'next/link';

const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Tooth: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3c-1.5 0-3 1.5-3 3.5S5.5 12 7 14c1.5-2 3-5.5 3-7.5S9 3 7 3z"/>
      <path d="M17 3c1.5 0 3 1.5 3 3.5S18.5 12 17 14c-1.5-2-3-5.5-3-7.5S16 3 17 3z"/>
      <path d="M12 3c-2 0-4 2-4 5s2 9 4 12c2-3 4-9 4-12s-2-5-4-5z"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  XCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  )
};

const mockAppointments = [
  { id: 'APT12345678', patientName: 'محمد أحمد محمد', phone: '01234567890', treatment: 'تنظيف الأسنان', date: '2025-01-15', time: '10:00 ص', status: 'confirmed', notes: '' },
  { id: 'APT87654321', patientName: 'فاطمة علي حسن', phone: '01123456789', treatment: 'حشو الأسنان', date: '2025-01-16', time: '04:30 م', status: 'pending', notes: 'حساسية من البنج' }
];

const statusConfig = {
  pending: { label: 'قيد الانتظار', class: 'badge-pending', icon: <Icons.Clock /> },
  confirmed: { label: 'مؤكد', class: 'badge-confirmed', icon: <Icons.CheckCircle /> },
  completed: { label: 'مكتمل', class: 'badge-completed', icon: <Icons.CheckCircle /> },
  cancelled: { label: 'ملغي', class: 'badge-cancelled', icon: <Icons.XCircle /> }
};

export default function LookupPage() {
  const [searchPhone, setSearchPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const results = mockAppointments.filter(apt => apt.phone === searchPhone);
      setAppointments(results);
      setHasSearched(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <header className="bg-bg-surface border-b border-border sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
              <Icons.ArrowLeft />
              <span>العودة للرئيسية</span>
            </Link>
            <h1 className="text-xl font-bold text-text-primary">متابعة الحجز</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="card p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4 text-center">ابحث عن حجزك</h2>
            <p className="text-text-secondary text-center mb-6">أدخل رقم هاتفك المسجل في الحجز لعرض مواعيدك</p>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="label">رقم الهاتف</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"><Icons.Phone /></span>
                  <input type="tel" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} className="input pr-12" placeholder="01234567890" required />
                </div>
              </div>
              
              <button type="submit" disabled={!searchPhone || isLoading} className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <span>جاري البحث...</span> : <><Icons.Search /> بحث</>}
              </button>
            </form>
          </div>

          {hasSearched && (
            <div className="animate-fade-in">
              {appointments.length === 0 ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 bg-bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Calendar /></div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد حجوزات</h3>
                  <p className="text-text-secondary mb-6">لم يتم العثور على أي حجوزات بهذا الرقم</p>
                  <Link href="/book" className="btn btn-primary">احجز موعد جديد</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-text-primary mb-4">الحجوزات ({appointments.length})</h2>
                  {appointments.map((apt) => (
                    <div key={apt.id} className="card p-6">
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                        <div>
                          <p className="text-sm text-text-muted mb-1">رقم الحجز</p>
                          <p className="font-bold text-primary">{apt.id}</p>
                        </div>
                        <span className={`badge ${statusConfig[apt.status].class}`}>{statusConfig[apt.status].icon}{statusConfig[apt.status].label}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted"><Icons.User /></span>
                          <div><p className="text-sm text-text-muted">المريض</p><p className="font-semibold text-text-primary">{apt.patientName}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted"><Icons.Phone /></span>
                          <div><p className="text-sm text-text-muted">الهاتف</p><p className="font-semibold text-text-primary">{apt.phone}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted"><Icons.Tooth /></span>
                          <div><p className="text-sm text-text-muted">العلاج</p><p className="font-semibold text-text-primary">{apt.treatment}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted"><Icons.Calendar /></span>
                          <div><p className="text-sm text-text-muted">التاريخ</p><p className="font-semibold text-text-primary">{apt.date}</p></div>
                        </div>
                        <div className="flex items-center gap-3 sm:col-span-2">
                          <span className="text-text-muted"><Icons.Clock /></span>
                          <div><p className="text-sm text-text-muted">الوقت</p><p className="font-semibold text-text-primary">{apt.time}</p></div>
                        </div>
                      </div>
                      {apt.notes && (<div className="bg-bg-surface-alt rounded-lg p-3 mt-4"><p className="text-sm text-text-muted mb-1">ملاحظات:</p><p className="text-text-secondary">{apt.notes}</p></div>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
