'use client'

import { useState, useEffect } from 'react'

interface Question {
  id: string
  title: string
  content: string
  tags: string
  createdAt: string
}

interface Answer {
  id: string
  content: string
  createdAt: string
  question?: {
    title: string
  }
}

export default function AdminDashboard() {
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([])
  const [pendingAnswers, setPendingAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch pending review items on load
  const fetchPendingItems = async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      if (res.ok) {
        setPendingQuestions(data.pendingQuestions || [])
        setPendingAnswers(data.pendingAnswers || [])
      }
    } catch (error) {
      console.error('Failed to load review queue', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingItems()
  }, [])

  // Handle Approve or Reject Action
  const handleAction = async (id: string, type: 'question' | 'answer', action: 'approve' | 'reject') => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action }),
      })

      if (res.ok) {
        // Remove item from state locally so UI updates instantly
        if (type === 'question') {
          setPendingQuestions(prev => prev.filter(q => q.id !== id))
        } else {
          setPendingAnswers(prev => prev.filter(a => a.id !== id))
        }
      } else {
        alert('Action failed. Please try again.')
      }
    } catch (error) {
      console.error('Error processing action:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm font-medium text-gray-500">Loading admin moderation queue...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Moderation Dashboard</h1>
            <p className="text-xs text-gray-500 mt-1">Review and approve user-submitted questions and answers.</p>
          </div>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
              Questions: {pendingQuestions.length}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
              Answers: {pendingAnswers.length}
            </span>
          </div>
        </div>

        {/* Pending Questions Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Pending Questions</h2>
          {pendingQuestions.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
              No pending questions to review. 🎉
            </div>
          ) : (
            pendingQuestions.map((q) => (
              <div key={q.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#0052FF] bg-blue-50 px-2 py-0.5 rounded-md">
                      {q.tags || 'general'}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">{q.title}</h3>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{q.content}</p>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleAction(q.id, 'question', 'reject')}
                    disabled={actionLoading === q.id}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    Reject & Delete
                  </button>
                  <button
                    onClick={() => handleAction(q.id, 'question', 'approve')}
                    disabled={actionLoading === q.id}
                    className="px-4 py-2 rounded-xl bg-[#0052FF] text-white text-xs font-medium hover:bg-[#0052FF]/90 transition-all disabled:opacity-50"
                  >
                    {actionLoading === q.id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pending Answers Section */}
        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-800">Pending Answers</h2>
          {pendingAnswers.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
              No pending answers to review. 🎉
            </div>
          ) : (
            pendingAnswers.map((a) => (
              <div key={a.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-medium text-gray-500">Replying to question:</span>
                    <h4 className="text-xs font-bold text-gray-800">{a.question?.title || 'Unknown Question'}</h4>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{a.content}</p>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleAction(a.id, 'answer', 'reject')}
                    disabled={actionLoading === a.id}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    Reject & Delete
                  </button>
                  <button
                    onClick={() => handleAction(a.id, 'answer', 'approve')}
                    disabled={actionLoading === a.id}
                    className="px-4 py-2 rounded-xl bg-[#0052FF] text-white text-xs font-medium hover:bg-[#0052FF]/90 transition-all disabled:opacity-50"
                  >
                    {actionLoading === a.id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

      </div>
    </main>
  )
}