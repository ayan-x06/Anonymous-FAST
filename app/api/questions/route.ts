import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission, containsProfanity } from '@/lib/moderation'
import { z } from 'zod'

const questionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(150),
  content: z.string().min(5, 'Content must be at least 5 characters long').max(2000),
  tags: z.string().optional(),
})

// GET: Fetch all active, approved questions for the public feed
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isApproved: true }, // Only show approved questions publicly
      include: {
        answers: true, // Required to fetch nested answers
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(questions, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST: Submit a new question from the public frontend form
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = questionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { title, content, tags } = validation.data

    // 1. Hard block if it contains blacklisted/abusive words
    if (containsProfanity(title, content, tags)) {
      return NextResponse.json(
        { error: 'Your post contains prohibited or abusive words and cannot be posted.' },
        { status: 400 }
      )
    }

    // 2. Optional AI check or direct approval
    const evaluation = await evaluateSubmission(title, content, tags)
    const isApproved = evaluation.status === 'APPROVED'

    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        tags: tags || 'general',
        isApproved,
      },
    })

    return NextResponse.json(
      {
        question: newQuestion,
        message: 'Published successfully!',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Question submission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}