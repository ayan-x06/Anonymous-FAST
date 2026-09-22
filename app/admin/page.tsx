'use client'

import React, { useState, useEffect } from 'react'

interface Question {
  id: string
  title: string
  content: string
  tags: string
  status: string
  createdAt: string
}

interface Answer {
  id: string
  content: string
  questionId: string
  createdAt: string
}

interface TeacherReview {
  id: string
  teacherName: string
  courseCode: string
  rating: number
  gradingEase: number
  reviewText: string
  createdAt: string
}

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [reviews, setReviews] = useState<TeacherReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllAdminData()
  }, [])

  const fetchAllAdminData = async () => {
    setLoading(true)
    try {
      // Fetching data from your respective admin or standard API routes
      const [qRes, aRes, rRes] = await Promise.all([
        fetch('/api/questions'),
        fetch('/api/answers'),
        fetch('/api/reviews'),
      ])
      
      if (qRes.ok) setQuestions(await qRes.json())
      if (aRes.ok) setAnswers(await aRes.json())
      if (rRes.ok) setReviews(await rRes.json())
    } catch (err) {
      console.error('Failed to load admin data', err)
    } finally {
      setLoading(false)
    }
  }

  // Generic delete handler
  const handleDelete = async (type: 'questions' | 'answers' | 'reviews', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return

    try {
      const res = await fetch(`/api/${type}?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchAllAdminData()
      } else {
        alert('Failed to delete item.')
      }
    } catch (err) {
      console.error('Error deleting item', err)
      alert('Network error while deleting.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Master Admin Control Panel</h1>
            <p className="text-xs text-[#64748B] mt-1">Manage, moderate, or remove user-submitted content.</p>
          </div>
          <button
            onClick={fetchAllAdminData}
            className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-medium hover:bg-black transition-all"
          >
            Refresh All
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-sm text-[#64748B]">Loading admin dashboard...</div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. QUESTIONS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F172A]">Questions ({questions.length})</h2>
              </div>

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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F172A]">Answers ({answers.length})</h2>
              </div>

              {answers.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No answers found.</p>
              ) : (
                <div className="space-y-3">
                  {answers.map((a) => (
                    <div key={a.id} className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
                      <div>
                        <p className="text-sm text-[#0F172A]">{a.content}</p>
                        <span className="block mt-1 font-mono text-[10px] text-[#64748B]">
                          Question ID: {a.questionId}
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F172A]">Teacher Reviews ({reviews.length})</h2>
              </div>

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