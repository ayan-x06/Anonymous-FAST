import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission } from '@/lib/moderation'
import { z } from 'zod'

const questionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(150),
  content: z.string().min(5, 'Content must be at least 5 characters long').max(2000),
  tags: z.string().optional(),
})

// Simple in-memory rate limiter map (IP -> { count, lastReset })
const ipRequestMap = new Map<string, { count: number; lastReset: number }>()

// GET: Fetch all active, approved questions
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isApproved: true }, // Only show approved questions publicly
      orderBy: { createdAt: 'desc' },
      include: { answers: true },
    })
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST: Submit a new question with hybrid AI moderation routing
export async function POST(request: Request) {
  try {
    // 1. Basic Rate Limiting Defense against spam/script floods
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute window
    const maxRequests = 5 // Max 5 requests per minute per IP

    let record = ipRequestMap.get(ip)
    if (!record || now - record.lastReset > windowMs) {
      record = { count: 1, lastReset: now }
      ipRequestMap.set(ip, record)
    } else {
      record.count++
      if (record.count > maxRequests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a minute before submitting again.' },
          { status: 429 }
        )
      }
    }

    const body = await request.json()
    const validation = questionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { title, content, tags } = validation.data

    // 2. Hybrid Moderation Check (Local Regex + Strict Gemini AI)
    const evaluation = await evaluateSubmission(`${title} ${content}`)
    const isApproved = evaluation.status === 'APPROVED' // False if flagged, routing to admin queue

    // 3. Create Question in Database with dynamic approval routing
    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        tags: tags || 'general',
        isApproved, // True goes live instantly; False routes straight to /admin queue
      },
    })

    return NextResponse.json(
      {
        question: newQuestion,
        status: evaluation.status,
        message: isApproved ? 'Published successfully!' : 'Submitted successfully! Pending admin approval.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Question submission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}