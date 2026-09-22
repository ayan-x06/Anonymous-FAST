'use client'

import { useState } from 'react'

interface Question {
  id: string
  title: string
  content: string
  tags: string
  isApproved: boolean
  createdAt: string
}

interface Review {
  id: string
  teacherName: string
  courseCode: string
  rating: number
  reviewText: string
  isApproved: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'pheonxzvanguard2007') {
      setIsAuthenticated(true)
      fetchAllData()
    } else {
      alert('Incorrect admin password!')
    }
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Let's fetch ALL items so you can see and delete public or pending ones
      const [qRes, rRes] = await Promise.all([
        fetch('/api/admin/questions-all'), // Or we can adjust your API route to return all
        fetch('/api/admin/reviews-all')
      ])
      
      // Alternatively, let's create a single admin endpoint that returns everything easily
      const res = await fetch('/api/admin/all')
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions)
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (type: 'questions' | 'reviews', id: string, action: 'approve' | 'unapprove' | 'delete') => {
    try {
      const res = await fetch(`/api/admin/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })

      if (res.ok) {
        fetchAllData() // Refresh list
      } else {
        alert('Action failed.')
      }
    } catch (err) {
      console.error(err)
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
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold">
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
          <h1 className="text-3xl font-bold text-gray-800">Master Admin Control Panel</h1>
          <button onClick={fetchAllData} className="bg-gray-800 text-white px-4 py-2 rounded text-sm">
            {loading ? 'Loading...' : 'Refresh All'}
          </button>
        </div>
        
        {/* All Questions Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">All Questions ({questions.length})</h2>
          {questions.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded shadow-sm">No questions found.</p>
          ) : (
            questions.map(q => (
              <div key={q.id} className="bg-white p-5 rounded-lg shadow-md mb-4 flex justify-between items-start border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${q.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {q.isApproved ? 'Public / Approved' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{q.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {q.isApproved ? (
                    <button onClick={() => handleAction('questions', q.id, 'unapprove')} className="bg-yellow-600 text-white px-3 py-1.5 rounded text-sm">Hide</button>
                  ) : (
                    <button onClick={() => handleAction('questions', q.id, 'approve')} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">Approve</button>
                  )}
                  <button onClick={() => handleAction('questions', q.id, 'delete')} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm">Delete</button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* All Reviews Section */}
        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-4">All Teacher Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded shadow-sm">No reviews found.</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-lg shadow-md mb-4 flex justify-between items-start border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800">{r.teacherName} <span className="text-sm font-normal text-gray-500">({r.courseCode})</span></h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${r.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {r.isApproved ? 'Public / Approved' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{r.reviewText}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {r.isApproved ? (
                    <button onClick={() => handleAction('reviews', r.id, 'unapprove')} className="bg-yellow-600 text-white px-3 py-1.5 rounded text-sm">Hide</button>
                  ) : (
                    <button onClick={() => handleAction('reviews', r.id, 'approve')} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">Approve</button>
                  )}
                  <button onClick={() => handleAction('reviews', r.id, 'delete')} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm">Delete</button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}