import { createClient } from '@/lib/supabase/server'
import RevenueCards from '@/components/admin/RevenueCards'
import RecentTransactions from '@/components/admin/RecentTransactions'

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Get today's date range
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  // Get week start (Sunday)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]
  
  // Get month start
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthStartStr = monthStart.toISOString().split('T')[0]
  
  // Fetch all transactions for calculations
  const { data: allTransactions } = await supabase
    .from('transactions')
    .select('*, appointments(date, status), patients(full_name)')
    .order('created_at', { ascending: false })
  
  // Calculate revenue metrics
  const todayRevenue = calculateRevenue(allTransactions, todayStr, todayStr)
  const weekRevenue = calculateRevenue(allTransactions, weekStartStr, todayStr)
  const monthRevenue = calculateRevenue(allTransactions, monthStartStr, todayStr)
  const pendingBalance = calculatePendingBalance(allTransactions)
  
  // Get recent transactions (last 10)
  const recentTransactions = allTransactions?.slice(0, 10) || []
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">لوحة المحاسبة</h1>
        <p className="text-slate-600">نظرة عامة على الإيرادات والمدفوعات</p>
      </div>
      
      {/* Revenue Cards */}
      <RevenueCards
        today={todayRevenue}
        week={weekRevenue}
        month={monthRevenue}
        pending={pendingBalance}
      />
      
      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
    </div>
  )
}

function calculateRevenue(transactions, startDate, endDate) {
  if (!transactions) return 0
  
  return transactions
    .filter(t => {
      const date = t.appointments?.date
      return date && date >= startDate && date <= endDate && t.appointments.status === 'completed'
    })
    .reduce((sum, t) => sum + (parseFloat(t.amount_paid) || 0), 0)
}

function calculatePendingBalance(transactions) {
  if (!transactions) return 0
  
  return transactions
    .filter(t => t.appointments?.status !== 'canceled')
    .reduce((sum, t) => {
      const expected = parseFloat(t.amount_expected) || 0
      const paid = parseFloat(t.amount_paid) || 0
      return sum + (expected - paid)
    }, 0)
}
