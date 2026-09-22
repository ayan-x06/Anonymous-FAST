'use client'

import { useState, useEffect } from 'react'

interface Question {
  id: string
  title: string
  content: string
  tags: string
  createdAt: string
}

interface Review {
  id: string
  teacherName: string
  courseCode: string
  rating: number
  reviewText: string
  createdAt: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([])
  const [pendingReviews, setPendingReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Matches your password setup
    if (password === 'pheonxzvanguard2007') {
      setIsAuthenticated(true)
      fetchPendingData()
    } else {
      alert('Incorrect admin password!')
    }
  }

  const fetchPendingData = async () => {
    setLoading(true)
    try {
      const [qRes, rRes] = await Promise.all([
        fetch('/api/admin/questions'),
        fetch('/api/admin/reviews')
      ])

      if (qRes.ok) {
        const qData = await qRes.json()
        setPendingQuestions(qData)
      }
      if (rRes.ok) {
        const rData = await rRes.json()
        setPendingReviews(rData)
      }
    } catch (error) {
      console.error('Failed to fetch pending admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (type: 'questions' | 'reviews', id: string, action: 'approve' | 'delete') => {
    try {
      const res = await fetch(`/api/admin/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })

      if (res.ok) {
        if (type === 'questions') {
          setPendingQuestions(prev => prev.filter(q => q.id !== id))
        } else {
          setPendingReviews(prev => prev.filter(r => r.id !== id))
        }
      } else {
        alert('Action failed to execute.')
      }
    } catch (err) {
      console.error('Error performing admin action:', err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Admin Portal Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Moderation Queue</h1>
          <button 
            onClick={fetchPendingData}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            {loading ? 'Refreshing...' : 'Refresh Queue'}
          </button>
        </div>
        
        {/* Pending Questions Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Pending Questions ({pendingQuestions.length})</h2>
          {pendingQuestions.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded shadow-sm border border-gray-200">No pending questions.</p>
          ) : (
            pendingQuestions.map(q => (
              <div key={q.id} className="bg-white p-5 rounded-lg shadow-md mb-4 flex justify-between items-start border border-gray-200">
                <div className="pr-4">
                  <h3 className="font-bold text-lg text-gray-800">{q.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{q.content}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium mt-3 inline-block">#{q.tags}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => handleAction('questions', q.id, 'approve')} 
                    className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded text-sm font-medium transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction('questions', q.id, 'delete')} 
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pending Teacher Reviews Section */}
        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Pending Teacher Reviews ({pendingReviews.length})</h2>
          {pendingReviews.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded shadow-sm border border-gray-200">No pending teacher reviews.</p>
          ) : (
            pendingReviews.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-lg shadow-md mb-4 flex justify-between items-start border border-gray-200">
                <div className="pr-4">
                  <h3 className="font-bold text-lg text-gray-800">{r.teacherName} <span className="text-sm font-normal text-gray-500">({r.courseCode})</span></h3>
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{r.reviewText}</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium mt-3 inline-block">Rating: {r.rating}/5</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => handleAction('reviews', r.id, 'approve')} 
                    className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded text-sm font-medium transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction('reviews', r.id, 'delete')} 
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}