'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Phone, ChevronRight, Star, Shield, Heart } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "حجز مواعيد سهل",
      description: "احجز موعدك في ثوانٍ معدودة عبر نظامنا السهل والمريح"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "مواعيد مرنة",
      description: "اختر الوقت المناسب لك من بين العديد من الخيارات المتاحة"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "أطباء متخصصون",
      description: "فريق من أفضل الأطباء المتخصصين في رعاية الأسنان"
    },
    {
      icon: <Shield className="w-6 h-6" />,
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
              <Heart className="w-6 h-6 text-white" />
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
              <Star className="w-4 h-4 fill-current" />
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
                <Calendar className="w-5 h-5" />
                <span>احجز موعدك الآن</span>
              </button>
              <button 
                onClick={() => router.push('/lookup')}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-border hover:border-primary text-text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                <Clock className="w-5 h-5" />
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
              <Calendar className="w-5 h-5" />
              <span>حجز موعد جديد</span>
            </button>
            <a 
              href="tel:+201234567890"
              className="inline-flex items-center justify-center gap-2 bg-primary-dark text-white hover:bg-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <Phone className="w-5 h-5" />
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
                  <Heart className="w-6 h-6 text-white" />
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
                  <Phone className="w-4 h-4" />
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
