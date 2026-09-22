import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission } from '@/lib/moderation'
import { z } from 'zod'

const reviewSchema = z.object({
  teacherName: z.string().min(2, 'Teacher name is required').max(100),
  courseCode: z.string().min(3, 'Course code is required').max(20),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters long').max(1000),
  gradingEase: z.number().int().min(1).max(5),
})

// Simple in-memory rate limiter map (IP -> { count, lastReset })
const ipRequestMap = new Map<string, { count: number; lastReset: number }>()

// GET: Fetch all active, approved teacher reviews
export async function GET() {
  try {
    const reviews = await prisma.teacherReview.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST: Submit a new teacher review with hybrid moderation routing
export async function POST(request: Request) {
  try {
    // 1. Basic Rate Limiting Defense against spam/script floods
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute window
    const maxRequests = 5 // Max 5 reviews per minute per IP

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
    const validation = reviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { teacherName, courseCode, rating, reviewText, gradingEase } = validation.data
    const normalizedTeacher = teacherName.trim()
    const normalizedText = reviewText.trim()

    // 2. Hybrid Moderation Check (Routes flagged items to admin queue instead of 403 blocking)
    const evaluation = evaluateSubmission(normalizedText)
    const isApproved = evaluation.status === 'APPROVED'

    // 3. Duplicate Review Protection
    // Prevents identical text submissions for the same professor to protect the database
    const existingDuplicate = await prisma.teacherReview.findFirst({
      where: {
        teacherName: { equals: normalizedTeacher, mode: 'insensitive' },
        reviewText: normalizedText,
      },
    })

    if (existingDuplicate) {
      return NextResponse.json(
        { error: 'Duplicate review detected. This exact feedback has already been posted.' },
        { status: 400 }
      )
    }

    // 4. Create Review in Database with dynamic approval routing
    const newReview = await prisma.teacherReview.create({
      data: {
        teacherName: normalizedTeacher,
        courseCode: courseCode.toUpperCase().trim(),
        rating,
        reviewText: normalizedText,
        gradingEase,
        isApproved, // True goes live instantly; False routes straight to /admin queue
      },
    })

    return NextResponse.json(
      { 
        message: isApproved ? 'Review published successfully!' : 'Review submitted for admin review.', 
        status: evaluation.status,
        newReview 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}