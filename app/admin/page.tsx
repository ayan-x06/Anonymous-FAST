'use client'

import React, { useState, useEffect } from 'react'

interface Answer {
  id: string
  content: string
  isApproved: boolean
  createdAt: string
}

interface Question {
  id: string
  title: string
  content: string
  tags: string
  isApproved: boolean
  createdAt: string
  answers: Answer[]
}

interface TeacherReview {
  id: string
  teacherName: string
  courseCode: string
  rating: number
  reviewText: string
  gradingEase: number
  isApproved: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [reviews, setReviews] = useState<TeacherReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'questions' | 'reviews'>('questions')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/all')
      const data = await res.json()
      if (res.ok) {
        setQuestions(data.questions || [])
        setReviews(data.reviews || [])
      }
    } catch (err) {
      console.error('Failed to load admin data', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle Approve / Unapprove toggle
  const handleAction = async (type: 'questions' | 'answers' | 'reviews', id: string, action: 'approve' | 'unapprove') => {
    const isApproved = action === 'approve'
    try {
      const res = await fetch('/api/admin/all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, isApproved }),
      })
      if (res.ok) {
        fetchAdminData() // Refresh list
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      console.error('Network error', err)
    }
  }

  // Handle Delete
  const handleDelete = async (type: 'questions' | 'answers' | 'reviews', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/admin/all?type=${type}&id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchAdminData() // Refresh list
      } else {
        alert('Failed to delete item')
      }
    } catch (err) {
      console.error('Network error', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] p-6 lg:p-12 font-sans">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
            <p className="text-sm text-[#64748B]">Moderate questions, answers, and teacher reviews submitted anonymously.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'questions' ? 'bg-[#0052FF] text-white shadow-sm' : 'bg-white border border-[#E2E8F0] text-[#64748B]'
              }`}
            >
              Questions & Answers ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'reviews' ? 'bg-[#0052FF] text-white shadow-sm' : 'bg-white border border-[#E2E8F0] text-[#64748B]'
              }`}
            >
              Teacher Reviews ({reviews.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-[#64748B]">Loading admin dashboard data...</div>
        ) : activeTab === 'questions' ? (
          /* QUESTIONS & ANSWERS TAB */
          <div className="space-y-6">
            {questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center text-sm text-[#64748B]">
                No questions submitted yet.
              </div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-[#0052FF]/10 text-[#0052FF] px-3 py-1 rounded-full">
                        #{q.tags}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${q.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {q.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {q.isApproved ? (
                        <button
                          onClick={() => handleAction('questions', q.id, 'unapprove')}
                          className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100"
                        >
                          Unapprove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction('questions', q.id, 'approve')}
                          className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete('questions', q.id)}
                        className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">{q.title}</h3>
                    <p className="text-sm text-[#64748B] mt-1">{q.content}</p>
                  </div>

                  {/* Answers Sub-list */}
                  <div className="mt-4 pl-4 border-l-2 border-[#E2E8F0] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Answers ({q.answers.length})</h4>
                    {q.answers.map((ans) => (
                      <div key={ans.id} className="flex items-center justify-between bg-[#FAFAFA] border border-[#E2E8F0] p-3 rounded-xl text-sm">
                        <div>
                          <p>{ans.content}</p>
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-medium ${ans.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {ans.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ans.isApproved ? (
                            <button
                              onClick={() => handleAction('answers', ans.id, 'unapprove')}
                              className="text-xs text-amber-700 underline"
                            >
                              Unapprove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction('answers', ans.id, 'approve')}
                              className="text-xs text-emerald-700 underline"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('answers', ans.id)}
                            className="text-xs text-red-600 underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* TEACHER REVIEWS TAB */
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center text-sm text-[#64748B]">
                No teacher reviews submitted yet.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-[#0052FF]/10 text-[#0052FF] px-3 py-1 rounded-full font-semibold">
                        {rev.courseCode}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rev.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {rev.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      <span className="text-xs text-[#64748B]">Rating: {rev.rating}/5 | Grading: {rev.gradingEase}/5</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">{rev.teacherName}</h3>
                    <p className="text-sm text-[#64748B]">{rev.reviewText}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rev.isApproved ? (
                      <button
                        onClick={() => handleAction('reviews', rev.id, 'unapprove')}
                        className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100"
                      >
                        Unapprove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction('reviews', rev.id, 'approve')}
                        className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete('reviews', rev.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}