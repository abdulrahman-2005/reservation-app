'use client';

import { useRouter } from 'next/navigation';

// Inline SVG Icons
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <CalendarIcon className="w-6 h-6" />,
      title: "حجز مواعيد سهل",
      description: "احجز موعدك في ثوانٍ معدودة عبر نظامنا السهل والمريح"
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "مواعيد مرنة",
      description: "اختر الوقت المناسب لك من بين العديد من الخيارات المتاحة"
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "أطباء متخصصون",
      description: "فريق من أفضل الأطباء المتخصصين في رعاية الأسنان"
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "تعقيم وأمان",
      description: "نلتزم بأعلى معايير التعقيم والسلامة لحماية صحتك"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">عيادة الخطوة</h1>
              <p className="text-xs text-text-muted">للأسنان والعناية الفموية</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <StarIcon className="w-4 h-4 fill-current" />
              <span>الأفضل في العريش</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              رعاية أسنان متكاملة<br />
              <span className="text-primary">بأيدي خبراء</span>
            </h2>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              نقدم خدمات طب الأسنان الشاملة بأحدث التقنيات وأفضل المعايير الطبية. 
              احجز موعدك الآن واحصل على رعاية استثنائية.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/book')}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <CalendarIcon className="w-5 h-5" />
                <span>احجز موعدك الآن</span>
              </button>
              <button 
                onClick={() => router.push('/lookup')}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-border hover:border-primary text-text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                <ClockIcon className="w-5 h-5" />
                <span>متابعة الحجز</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-text-primary mb-4">لماذا تختار عيادة الخطوة؟</h3>
            <p className="text-text-muted max-w-2xl mx-auto">
              نوفر تجربة علاجية متميزة تجمع بين الخبرة الطبية والتكنولوجيا الحديثة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h4>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">جاهز لابتسامة صحية؟</h3>
          <p className="text-white/80 mb-8 text-lg">
            احجز موعدك اليوم واحصل على استشارة مجانية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/book')}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>حجز موعد جديد</span>
            </button>
            <a 
              href="tel:+201234567890"
              className="inline-flex items-center justify-center gap-2 bg-primary-dark text-white hover:bg-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>اتصل بنا</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">عيادة الخطوة</h4>
                  <p className="text-xs text-slate-400">للأسنان والعناية الفموية</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                نقدم خدمات طب الأسنان الشاملة بأحدث التقنيات وأفضل المعايير الطبية.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">روابط سريعة</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => router.push('/book')} className="hover:text-white transition-colors">حجز موعد</button></li>
                <li><button onClick={() => router.push('/lookup')} className="hover:text-white transition-colors">متابعة الحجز</button></li>
                <li><button onClick={() => router.push('/login')} className="hover:text-white transition-colors">تسجيل الدخول</button></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">معلومات التواصل</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>+20 123 456 7890</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4">📍</span>
                  <span>العريش، شمال سيناء</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} عيادة الخطوة للأسنان. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
