'use client';

import { useState } from 'react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container-custom mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 2.03.76 3.87 2 5.28V20a2 2 0 002 2h8a2 2 0 002-2v-4.72c1.24-1.41 2-3.25 2-5.28 0-4.42-3.58-8-8-8z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <div>
                <h1 className="text-xl font-bold text-text-primary">عيادة خطوة</h1>
                <p className="text-xs text-text-muted">Khatwah Clinic</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-text-primary hover:text-primary transition-colors font-medium">الخدمات</a>
              <a href="#about" className="text-text-primary hover:text-primary transition-colors font-medium">عن العيادة</a>
              <a href="#contact" className="text-text-primary hover:text-primary transition-colors font-medium">اتصل بنا</a>
              <a href="/login" className="btn btn-primary px-6 py-2">دخول الموظفين</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12"/>
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
              <a href="#features" className="block text-text-primary hover:text-primary font-medium py-2">الخدمات</a>
              <a href="#about" className="block text-text-primary hover:text-primary font-medium py-2">عن العيادة</a>
              <a href="#contact" className="block text-text-primary hover:text-primary font-medium py-2">اتصل بنا</a>
              <a href="/login" className="block btn btn-primary text-center py-2">دخول الموظفين</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <div className="container-custom mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              عيادة أسنان متخصصة في العريش
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
              رعاية أسنانك تبدأ من<br/>
              <span className="text-primary">خطوة واحدة</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              احجز موعدك بسهولة وسرعة في عيادة خطوة للأسنان. نخدمكم بأحدث التقنيات وأفضل الأطباء المتخصصين
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/book" className="btn btn-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5 inline-block ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                احجز موعدك الآن
              </a>
              <a href="/lookup" className="btn bg-white text-text-primary border-2 border-gray-200 hover:border-primary hover:text-primary px-8 py-4 text-lg font-semibold transition-all">
                <svg className="w-5 h-5 inline-block ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                ابحث عن حجزك
              </a>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="container-custom mx-auto px-6 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">+5000</div>
              <div className="text-text-muted">مريض سعيد</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">+15</div>
              <div className="text-text-muted">سنة خبرة</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">%98</div>
              <div className="text-text-muted">نسبة الرضا</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-custom mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">خدماتنا المتميزة</h2>
            <p className="text-text-muted max-w-2xl mx-auto">نقدم مجموعة شاملة من خدمات طب الأسنان بأعلى معايير الجودة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🦷', title: 'تنظيف وتبييض', desc: 'إزالة البلاك والجير وتبييض الأسنان بأحدث التقنيات' },
              { icon: '🔧', title: 'حشو وعلاج', desc: 'علاج التسوس والحشو بمواد عالية الجودة' },
              { icon: '🎯', title: 'تقويم أسنان', desc: 'تقويم الأسنان للأطفال والكبار بأنواعه المختلفة' },
              { icon: '👶', title: 'طب أسنان الأطفال', desc: 'رعاية خاصة لأسنان أطفالكم في جو مريح' },
              { icon: '🦷', title: 'زراعة الأسنان', desc: 'تعويض الأسنان المفقودة بأفضل مواد الزراعة' },
              { icon: '✨', title: 'جراحة الفم', desc: 'عمليات خلع الأسنان وجراحات الفم المختلفة' }
            ].map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز لابتسامة صحية؟</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">احجز موعدك الآن واحصل على استشارة مجانية مع أفضل أطباء الأسنان</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/book" className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              احجز موعد جديد
            </a>
            <a href="tel:+201234567890" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
              اتصل بنا الآن
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-bg-main">
        <div className="container-custom mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">تواصل معنا</h2>
            <p className="text-text-muted">نحن هنا للإجابة على جميع استفساراتكم</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">العنوان</h3>
              <p className="text-text-muted">العريش، شمال سيناء، مصر</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">الهاتف</h3>
              <p className="text-text-muted">+20 123 456 7890</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <h3 className="font-bold text-text-primary mb-2">ساعات العمل</h3>
              <p className="text-text-muted">يومياً 9 ص - 9 م</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-12">
        <div className="container-custom mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 2.03.76 3.87 2 5.28V20a2 2 0 002 2h8a2 2 0 002-2v-4.72c1.24-1.41 2-3.25 2-5.28 0-4.42-3.58-8-8-8z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <span className="text-xl font-bold">عيادة خطوة</span>
              </div>
              <p className="text-gray-400 leading-relaxed">رعاية أسنان متكاملة بأحدث التقنيات وأفضل الأطباء</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/book" className="hover:text-primary transition-colors">حجز موعد</a></li>
                <li><a href="/lookup" className="hover:text-primary transition-colors">البحث عن حجز</a></li>
                <li><a href="/login" className="hover:text-primary transition-colors">دخول الموظفين</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">تابعنا</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 عيادة خطوة للأسنان. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
