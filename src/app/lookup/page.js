'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Inline SVG Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const statusConfig = {
  confirmed: {
    label: 'مؤكد',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircleIcon
  },
  pending: {
    label: 'قيد الانتظار',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: AlertCircleIcon
  },
  cancelled: {
    label: 'ملغي',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircleIcon
  },
  completed: {
    label: 'مكتمل',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: CheckCircleIcon
  }
};

// Mock data for demo
const mockAppointments = [
  { id: 'BK123456', name: 'محمد أحمد', phone: '01234567890', date: '2025-01-20', time: '10:00', service: 'فحص عام', status: 'confirmed' },
  { id: 'BK789012', name: 'فاطمة محمود', phone: '01123456789', date: '2025-01-18', time: '16:30', service: 'تنظيف الأسنان', status: 'pending' },
  { id: 'BK345678', name: 'أحمد علي', phone: '01023456789', date: '2025-01-15', time: '09:00', service: 'حشو ضرس', status: 'completed' },
  { id: 'BK901234', name: 'سارة حسن', phone: '01523456789', date: '2025-01-14', time: '17:00', service: 'خلع ضرس', status: 'cancelled' }
];

export default function LookupPage() {
  const router = useRouter();
  const [searchPhone, setSearchPhone] = useState('');
  const [searchId, setSearchId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchPhone.trim() && !searchId.trim()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = mockAppointments.filter(apt => {
      const matchPhone = searchPhone && apt.phone.includes(searchPhone.replace(/\s/g, ''));
      const matchId = searchId && apt.id.toLowerCase().includes(searchId.toLowerCase());
      return (searchPhone && matchPhone) || (searchId && matchId);
    });
    
    setAppointments(results);
    setHasSearched(true);
    setIsLoading(false);
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
            <span className="text-sm font-medium">عودة للرئيسية</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">متابعة الحجز</h1>
          <p className="text-text-muted">ابحث عن حجزك باستخدام رقم الهاتف أو رقم الحجز</p>
        </div>

        {/* Search Form */}
        <div className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="01234567890"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-4 text-sm text-text-muted">أو</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                رقم الحجز
              </label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="BK123456"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading || (!searchPhone.trim() && !searchId.trim())}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري البحث...</span>
                </>
              ) : (
                <>
                  <SearchIcon className="w-5 h-5" />
                  <span>بحث</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {appointments.length === 0 ? (
              <div className="bg-surface rounded-2xl p-8 border border-border text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد نتائج</h3>
                <p className="text-text-muted text-sm">لم يتم العثور على أي حجوزات تطابق بحثك</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">الحجوزات found ({appointments.length})</h2>
                </div>
                
                {appointments.map((apt) => {
                  const statusInfo = statusConfig[apt.status] || statusConfig.pending;
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={apt.id} className="bg-surface rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-text-primary text-lg">{apt.name}</h3>
                          <p className="text-sm text-text-muted">{apt.service}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4 text-text-muted" />
                          <span className="text-text-secondary">{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="w-4 h-4 text-text-muted" />
                          <span className="text-text-secondary">{apt.time}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-text-muted font-mono">{apt.id}</span>
                        <span className="text-xs text-text-muted">{apt.phone}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
