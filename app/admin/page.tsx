'use client'

import React, { useState, useEffect } from 'react'

interface Question {
  id: string
  title: string
  content: string
  tags: string
  answers?: { id: string; content: string }[]
}

interface TeacherReview {
  id: string
  teacherName: string
  courseCode: string
  rating: number
  gradingEase: number
  reviewText: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])
  const [reviews, setReviews] = useState<TeacherReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput.trim() === 'pheonxzvanguard2007') {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  const fetchAllAdminData = async () => {
    setLoading(true)
    try {
      const [qRes, rRes] = await Promise.all([
        fetch('/api/admin/questions'),
        fetch('/api/admin/reviews'),
      ])
      
      if (qRes.ok) {
        const qData = await qRes.json()
        if (Array.isArray(qData)) setQuestions(qData)
      }
      if (rRes.ok) {
        const rData = await rRes.json()
        if (Array.isArray(rData)) setReviews(rData)
      }
    } catch (err) {
      console.error('Failed to load admin data', err)
    } finally {
      setLoading(false)
    }
  }

  // Instant UI State update without full page reloads or dialog boxes
  const handleDelete = async (endpoint: 'questions' | 'answers' | 'reviews', id: string) => {
    // Optimistically update frontend state immediately for zero latency
    if (endpoint === 'questions') {
      setQuestions(prev => prev.filter(q => q.id !== id))
    } else if (endpoint === 'answers') {
      setQuestions(prev => prev.map(q => ({
        ...q,
        answers: q.answers?.filter(a => a.id !== id)
      })))
    } else if (endpoint === 'reviews') {
      setReviews(prev => prev.filter(r => r.id !== id))
    }

    try {
      const res = await fetch(`/api/admin/${endpoint}?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        console.error('Server failed to delete item, refetching...')
        fetchAllAdminData() // Rollback/refetch if server errored
      }
    } catch (err) {
      console.error('Network error while deleting', err)
      fetchAllAdminData()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">Admin Authentication</h1>
            <p className="text-xs text-[#64748B] mt-1">Enter master password to access control panel.</p>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center">
              Incorrect password. Please try again.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-[#FAFAFA]"
              required
            />
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#0052FF] text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-sm"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  const allAnswers = questions.flatMap(q => (q.answers || []).map(a => ({ ...a, questionTitle: q.title })))

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Master Admin Control Panel</h1>
            <p className="text-xs text-[#64748B] mt-1">Manage, moderate, or remove user-submitted content instantly.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAllAdminData}
              className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-medium hover:bg-black transition-all"
            >
              Refresh All
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-all"
            >
              Lock Out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-sm text-[#64748B]">Loading admin dashboard...</div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. QUESTIONS SECTION */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">Questions ({questions.length})</h2>

              {questions.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No questions found.</p>
              ) : (
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
                      <div>
                        <h3 className="text-sm font-semibold text-[#0F172A]">{q.title}</h3>
                        <p className="text-xs text-[#64748B] mt-1">{q.content}</p>
                        <span className="inline-block mt-2 font-mono text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                          #{q.tags}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete('questions', q.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. ANSWERS SECTION */}
            <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Answers ({allAnswers.length})</h2>

              {allAnswers.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No answers found.</p>
              ) : (
                <div className="space-y-3">
                  {allAnswers.map((a) => (
                    <div key={a.id} className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
                      <div>
                        <p className="text-sm text-[#0F172A]">{a.content}</p>
                        <span className="block mt-1 font-mono text-[10px] text-[#64748B]">
                          On Question: {a.questionTitle}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete('answers', a.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. TEACHER REVIEWS SECTION */}
            <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Teacher Reviews ({reviews.length})</h2>

              {reviews.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No teacher reviews found.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-[#0F172A]">{r.teacherName}</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{r.courseCode}</span>
                        </div>
                        <p className="text-xs text-[#64748B]">{r.reviewText}</p>
                        <div className="mt-2 flex gap-3 text-[10px] font-mono text-emerald-700">
                          <span>Rating: {r.rating}/5</span>
                          <span>Grading Ease: {r.gradingEase}/5</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete('reviews', r.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}