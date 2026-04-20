'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Inline SVG Icons to avoid external dependencies
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials check
    if (formData.username === 'admin' && formData.password === 'admin123') {
      router.push('/dashboard');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <HeartIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">عيادة الخطوة</h1>
          <p className="text-text-muted">تسجيل دخول الموظفين</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <UserIcon className="w-4 h-4 inline-block ml-1" />
                اسم المستخدم
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="أدخل اسم المستخدم"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <LockIcon className="w-4 h-4 inline-block ml-1" />
                كلمة المرور
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="أدخل كلمة المرور"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-error-bg border border-error/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircleIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <LockIcon className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-text-muted">
              للتجربة استخدم: admin / admin123
            </p>
          </div>
        </div>

        {/* Back Link */}
        <button
          onClick={() => router.push('/')}
          className="w-full mt-6 text-center text-text-muted hover:text-primary transition-colors text-sm"
        >
          ← العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
