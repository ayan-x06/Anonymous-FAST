'use client'

import { useState } from 'react'

interface PendingItem {
  id: string
  title?: string
  content?: string
  teacherName?: string
  courseCode?: string
  reviewText?: string
  rating?: number
}

export default function AdminDashboard() {
  const [token, setToken] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [questions, setQuestions] = useState<PendingItem[]>([])
  const [reviews, setReviews] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
    fetchPendingData(token)
  }

  const fetchPendingData = async (adminToken: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions)
        setReviews(data.reviews)
      } else {
        alert('Invalid Admin Secret Token')
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, type: 'question' | 'review', action: 'approve' | 'delete') => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, type, action }),
      })

      if (res.ok) {
        fetchPendingData(token)
      } else {
        alert('Action failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-md w-full space-y-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Moderator Login</h2>
          <input
            type="password"
            placeholder="Admin Secret Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
            required
          />
          <button type="submit" className="w-full h-12 rounded-xl bg-[#0052FF] text-white font-medium text-sm">
            Access Dashboard
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl font-bold">Moderation Queue</h1>
        <button
          onClick={() => fetchPendingData(token)}
          className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium hover:bg-[#F1F5F9]"
        >
          Refresh Queue
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading pending items...</p>
      ) : (
        <div className="space-y-10">
          {/* Pending Questions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0052FF]">Pending Questions ({questions.length})</h2>
            {questions.length === 0 ? (
              <p className="text-xs text-[#64748B]">No pending questions.</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-3 shadow-sm">
                  <h3 className="font-semibold text-base">{q.title}</h3>
                  <p className="text-sm text-[#64748B]">{q.content}</p>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleAction(q.id, 'question', 'approve')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium">Approve</button>
                    <button onClick={() => handleAction(q.id, 'question', 'delete')} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-medium">Reject & Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pending Reviews */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0052FF]">Pending Teacher Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-[#64748B]">No pending reviews.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-base">{r.teacherName} <span className="text-xs text-[#64748B]">({r.courseCode})</span></h3>
                    <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">Rating: {r.rating}/5</span>
                  </div>
                  <p className="text-sm text-[#64748B]">{r.reviewText}</p>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleAction(r.id, 'review', 'approve')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium">Approve</button>
                    <button onClick={() => handleAction(r.id, 'review', 'delete')} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-medium">Reject & Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}