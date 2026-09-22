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

// GET: Fetch all active, approved teacher reviews for the public feed
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

// POST: Submit a new teacher review from the public frontend form
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = reviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { teacherName, courseCode, rating, reviewText, gradingEase } = validation.data
    const normalizedTeacher = teacherName.trim()
    const normalizedText = reviewText.trim()

    // Moderation Check
    const evaluation = await evaluateSubmission(normalizedText)
    const isApproved = evaluation.status === 'APPROVED'

    // Duplicate Protection
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

    const newReview = await prisma.teacherReview.create({
      data: {
        teacherName: normalizedTeacher,
        courseCode: courseCode.toUpperCase().trim(),
        rating,
        reviewText: normalizedText,
        gradingEase,
        isApproved,
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