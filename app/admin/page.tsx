'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch all questions from admin route
      const qRes = await fetch('/api/admin/questions')
      const qData = await qRes.json()
      if (qRes.ok) setQuestions(qData)

      // Fetch pending reviews or answers
      const rRes = await fetch('/api/admin/reviews')
      const rData = await rRes.json()
      if (rRes.ok) {
        setReviews(rData.pendingAnswers || rData.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Master Admin Control Panel</h1>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-gray-900 text-white text-xs rounded-xl font-medium"
          >
            Refresh All
          </button>
        </div>

        {/* Questions Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-blue-600">All Questions ({questions.length})</h2>
          {questions.length === 0 ? (
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs text-gray-400">No questions found.</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{q.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${q.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {q.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{q.content}</p>
              </div>
            ))
          )}
        </section>

        {/* Reviews Section */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-blue-600">All Teacher Reviews / Answers ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs text-gray-400">No reviews found.</div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                <p className="text-xs text-gray-600">{r.content}</p>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  )
}