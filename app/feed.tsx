'use client'
import { useState } from 'react'

export default function QuestionCard({ question }: { question: any }) {
  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState(question.answers || [])

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerContent.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          content: answerContent,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setAnswers([...answers, data.answer]) // Add new answer to local state
        setAnswerContent('') // Clear input
      } else {
        alert(data.error || 'Failed to post answer')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm mb-4">
      <h3 className="font-bold text-lg">{question.title}</h3>
      <p className="text-gray-700 mt-2">{question.content}</p>

      {/* Render existing answers */}
      <div className="mt-4 border-t pt-2">
        <h4 className="text-sm font-semibold text-gray-500">Answers ({answers.length})</h4>
        {answers.map((ans: any) => (
          <p key={ans.id} className="text-sm bg-gray-50 p-2 rounded mt-2">{ans.content}</p>
        ))}
      </div>

      {/* Answer Input Form */}
      <form onSubmit={handleAnswerSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          placeholder="Write a reply..."
          className="border rounded px-3 py-1 text-sm flex-1"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-700"
        >
          {submitting ? 'Posting...' : 'Reply'}
        </button>
      </form>
    </div>
  )
}