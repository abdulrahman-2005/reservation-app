'use client';

import { useState } from 'react';
import Link from 'next/link';

const Icons = {
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Tooth: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3c-1.5 0-3 1.5-3 3.5S5.5 12 7 14c1.5-2 3-5.5 3-7.5S9 3 7 3z"/>
      <path d="M17 3c1.5 0 3 1.5 3 3.5S18.5 12 17 14c-1.5-2-3-5.5-3-7.5S16 3 17 3z"/>
      <path d="M12 3c-2 0-4 2-4 5s2 9 4 12c2-3 4-9 4-12s-2-5-4-5z"/>
    </svg>
  )
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      setIsLoading(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        window.location.href = '/dashboard';
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Link */}
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8">
          <Icons.ArrowLeft />
          <span>العودة للرئيسية</span>
        </Link>

        {/* Login Card */}
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-2xl text-primary mb-4">
              <Icons.Tooth />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">تسجيل دخول الموظفين</h1>
            <p className="text-text-muted">عيادة خطوة للأسنان</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">اسم المستخدم</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Icons.User />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pr-12"
                  placeholder="أدخل اسم المستخدم"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="label">كلمة المرور</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Icons.Lock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12 pl-12"
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-bg-surface-alt rounded-xl">
            <p className="text-sm text-text-muted text-center mb-2">بيانات تجريبية:</p>
            <p className="text-sm text-text-secondary text-center">
              المستخدم: <code className="bg-bg-surface px-2 py-1 rounded">admin</code>
            </p>
            <p className="text-sm text-text-secondary text-center">
              كلمة المرور: <code className="bg-bg-surface px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
