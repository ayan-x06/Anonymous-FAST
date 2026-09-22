'use client'

import React, { useState, useEffect } from 'react'
import { FACULTY_DEPARTMENTS } from '@/lib/facultyData'

interface Question {
  id: string
  title: string
  content: string
  tags: string
  createdAt: string
  _count?: { answers: number }
}

interface TeacherReview {
  id: string
  teacherName: string
  courseCode: string
  rating: number
  reviewText: string
  gradingEase: number
  createdAt: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'questions' | 'reviews'>('questions')
  
  // States for Data
  const [questions, setQuestions] = useState<Question[]>([])
  const [reviews, setReviews] = useState<TeacherReview[]>([])
  const [loading, setLoading] = useState(true)

  // Question Form States
  const [qTitle, setQTitle] = useState('')
  const [qContent, setQContent] = useState('')
  const [qTags, setQTags] = useState('general')
  const [qSubmitting, setQSubmitting] = useState(false)
  const [qError, setQError] = useState('')
  const [qSuccess, setQSuccess] = useState('')

  // Review Form States
  const [rTeacher, setRTeacher] = useState('')
  const [rCourse, setRCourse] = useState('')
  const [rRating, setRRating] = useState(5)
  const [rGrading, setRGrading] = useState(5)
  const [rText, setRText] = useState('')
  const [rSubmitting, setRSubmitting] = useState(false)
  const [rError, setRError] = useState('')
  const [rSuccess, setRSuccess] = useState('')

  // Fetch data on load and tab switch
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'questions') {
        const res = await fetch('/api/questions')
        const data = await res.json()
        if (Array.isArray(data)) setQuestions(data)
      } else {
        const res = await fetch('/api/reviews')
        const data = await res.json()
        if (Array.isArray(data)) setReviews(data)
      }
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle Question Submission
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setQSubmitting(true)
    setQError('')
    setQSuccess('')

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: qTitle, content: qContent, tags: qTags }),
      })
      const data = await res.json()

      if (!res.ok) {
        setQError(data.error?.message || data.error || 'Submission failed. Check constraints or moderation guidelines.')
      } else {
        setQSuccess('Submitted successfully! Pending admin approval.')
        setQTitle('')
        setQContent('')
        setQTags('general')
        fetchData()
      }
    } catch (err) {
      setQError('Network error. Please try again.')
    } finally {
      setQSubmitting(false)
    }
  }

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRSubmitting(true)
    setRError('')
    setRSuccess('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName: rTeacher,
          courseCode: rCourse,
          rating: Number(rRating),
          gradingEase: Number(rGrading),
          reviewText: rText,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setRError(data.error?.message || data.error || 'Review rejected by moderation or validation rules.')
      } else {
        setRSuccess('Submitted successfully! Pending admin approval.')
        setRTeacher('')
        setRCourse('')
        setRText('')
        setRRating(5)
        setRGrading(5)
        fetchData()
      }
    } catch (err) {
      setRError('Network error. Please try again.')
    } finally {
      setRSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] selection:bg-[#0052FF]/20 font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white shadow-md shadow-[#0052FF]/20 font-mono font-bold">
              AF
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#0F172A]">Anonymous FAST</h1>
              <p className="text-xs text-[#64748B]">FAST-NUCES Karachi Hub • 100% Zero PII</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F1F5F9]/50 p-1">
            <button
              onClick={() => setActiveTab('questions')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === 'questions'
                  ? 'bg-[#0052FF] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Q&A Feed
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === 'reviews'
                  ? 'bg-[#0052FF] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Teacher Reviews
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-[#E2E8F0]">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#0052FF]/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#0052FF]/30 bg-[#0052FF]/5 px-5 py-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#0052FF] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#0052FF]">
              Protected Student Community
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h2 className="text-4xl md:text-6xl font-normal tracking-tight font-serif max-w-3xl leading-[1.15]">
                Speak freely. <span className="bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] bg-clip-text text-transparent">Zero identity tracking.</span>
              </h2>
              <p className="mt-4 text-lg text-[#64748B] max-w-xl font-normal leading-relaxed">
                Ask academic questions, check course difficulties, and rate professors anonymously with complete peace of mind. Guarded by an advanced anti-abuse filter.
              </p>
            </div>

            {/* Developer GitHub Card */}
            <div className="lg:col-span-4">
              <a
                href="https://github.com/ayan-x06"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-xl hover:border-[#0052FF]/40 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-[#0052FF]/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-4">
                  <img
                    src="https://github.com/ayan-x06.png"
                    alt="ayan-x06"
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#E2E8F0] group-hover:ring-[#0052FF] transition-all"
                  />
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#0052FF] font-semibold">Creator & Maintainer</span>
                    <h3 className="text-base font-semibold text-[#0F172A] group-hover:text-[#0052FF] transition-colors">ayan-x06</h3>
                    <p className="text-xs text-[#64748B]">View GitHub Profile →</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {activeTab === 'questions' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Ask Question Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold tracking-tight text-[#0F172A]">Ask a Question</h3>
                <p className="mt-1 text-sm text-[#64748B]">Post anonymously to your fellow batchmates.</p>

                {qError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
                    {typeof qError === 'string' ? qError : JSON.stringify(qError)}
                  </div>
                )}
                {qSuccess && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-700">
                    {qSuccess}
                  </div>
                )}

                <form onSubmit={handleQuestionSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Title</label>
                    <input
                      type="text"
                      required
                      minLength={5}
                      maxLength={150}
                      placeholder="e.g. Best professor for OOP in KHI campus?"
                      value={qTitle}
                      onChange={(e) => setQTitle(e.target.value)}
                      className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all bg-[#FAFAFA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Content</label>
                    <textarea
                      required
                      minLength={10}
                      maxLength={1000}
                      rows={4}
                      placeholder="Provide details about your query..."
                      value={qContent}
                      onChange={(e) => setQContent(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all bg-[#FAFAFA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Tag / Category</label>
                    <input
                      type="text"
                      placeholder="general, exams, admissions, fee"
                      value={qTags}
                      onChange={(e) => setQTags(e.target.value)}
                      className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all bg-[#FAFAFA]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={qSubmitting}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white font-medium shadow-sm hover:shadow-lg hover:shadow-[#0052FF]/25 transition-all duration-200 disabled:opacity-50"
                  >
                    {qSubmitting ? 'Checking & Publishing...' : 'Post Question'}
                  </button>
                </form>
              </div>
            </div>

            {/* Questions Feed */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <h3 className="text-xl font-semibold tracking-tight text-[#0F172A]">Recent Q&A Feed</h3>
                <span className="font-mono text-xs text-[#64748B] uppercase tracking-wider">{questions.length} Active Posts</span>
              </div>

              {loading ? (
                <div className="py-20 text-center text-sm text-[#64748B]">Loading secure feed...</div>
              ) : questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center">
                  <p className="text-sm text-[#64748B]">No questions asked yet. Be the first freshie to spark a discussion!</p>
                </div>
              ) : (
                questions.map((q) => (
                  <div key={q.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center rounded-full bg-[#0052FF]/10 px-3 py-1 font-mono text-xs text-[#0052FF]">
                        #{q.tags}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#0F172A]">{q.title}</h4>
                    <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{q.content}</p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B]">
                      <span>Anonymous Student</span>
                      <span className="font-medium text-[#0F172A]">{q._count?.answers || 0} Answers</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Top Section: Submit Form + Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <div className="sticky top-28 rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-semibold tracking-tight text-[#0F172A]">Rate a Professor</h3>
                  <p className="mt-1 text-sm text-[#64748B]">Click 'Rate Professor' on any faculty card below to autofill their name.</p>

                  {rError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
                      {rError}
                    </div>
                  )}
                  {rSuccess && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-700">
                      {rSuccess}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Teacher Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Anam Qureshi"
                        value={rTeacher}
                        onChange={(e) => setRTeacher(e.target.value)}
                        className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all bg-[#FAFAFA]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Course Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SE1001"
                        value={rCourse}
                        onChange={(e) => setRCourse(e.target.value)}
                        className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all bg-[#FAFAFA]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Overall (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={rRating}
                          onChange={(e) => setRRating(Number(e.target.value))}
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-[#FAFAFA]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Grading Ease (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={rGrading}
                          onChange={(e) => setRGrading(Number(e.target.value))}
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-[#FAFAFA]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#64748B] mb-2">Review Details</label>
                      <textarea
                        required
                        minLength={10}
                        maxLength={1000}
                        rows={4}
                        placeholder="How are lectures, assignments, and quizzes handled?"
                        value={rText}
                        onChange={(e) => setRText(e.target.value)}
                        className="w-full rounded-xl border border-[#E2E8F0] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all bg-[#FAFAFA]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rSubmitting}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white font-medium shadow-sm hover:shadow-lg hover:shadow-[#0052FF]/25 transition-all duration-200 disabled:opacity-50"
                    >
                      {rSubmitting ? 'Moderating & Publishing...' : 'Submit Teacher Review'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Submitted Reviews Directory Feed on the right */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <h3 className="text-xl font-semibold tracking-tight text-[#0F172A]">Recent Student Reviews</h3>
                  <span className="font-mono text-xs text-[#64748B] uppercase tracking-wider">{reviews.length} Verified</span>
                </div>

                {loading ? (
                  <div className="py-20 text-center text-sm text-[#64748B]">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center">
                    <p className="text-sm text-[#64748B]">No teacher reviews submitted yet. Pick a faculty member below and write the first one!</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center rounded-full bg-[#0052FF]/10 px-3 py-1 font-mono text-xs text-[#0052FF] font-semibold">
                          {rev.courseCode}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                            Rating: {rev.rating}/5
                          </span>
                          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                            Grading: {rev.gradingEase}/5
                          </span>
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-[#0F172A]">{rev.teacherName}</h4>
                      <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{rev.reviewText}</p>
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B]">
                        <span>Anonymous Student Review</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Section: Official Faculty Directory Grids */}
            <div className="space-y-12 pt-12 border-t border-[#E2E8F0]">
              <div>
                <h3 className="text-2xl font-normal font-serif text-[#0F172A]">FAST-NUCES Karachi Faculty Directory</h3>
                <p className="text-sm text-[#64748B] mt-1">Select an instructor department-wise to read or write anonymous reviews.</p>
              </div>

              {/* Department Sections Loop */}
              {FACULTY_DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0052FF]" />
                    <h4 className="font-mono text-sm uppercase tracking-wider text-[#0F172A] font-bold">
                      {dept.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dept.faculty.map((prof) => (
                      <div 
                        key={prof.id} 
                        className="group rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-xl hover:border-[#0052FF]/30 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={prof.image}
                              alt={prof.name}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none'
                              }}
                              className="h-16 w-16 rounded-2xl object-cover border border-[#E2E8F0] bg-[#F1F5F9]"
                            />
                            <div>
                              <h5 className="text-base font-semibold text-[#0F172A] group-hover:text-[#0052FF] transition-colors">
                                {prof.name}
                              </h5>
                              <p className="text-xs text-[#64748B] mt-0.5">{prof.designation}</p>
                              <span className="inline-block mt-2 font-mono text-[10px] text-[#0052FF] bg-[#0052FF]/5 px-2 py-0.5 rounded-md">
                                {prof.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setRTeacher(prof.name)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="w-full mt-4 h-10 rounded-xl border border-[#0052FF]/30 bg-[#0052FF]/5 text-[#0052FF] text-xs font-medium hover:bg-[#0052FF] hover:text-white transition-all"
                        >
                          Rate Professor →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}