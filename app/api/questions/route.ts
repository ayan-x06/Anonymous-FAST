import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission } from '@/lib/moderation'
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
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      include: { 
        answers: {
          where: { isApproved: true }, // Only show approved answers publicly
          orderBy: { createdAt: 'asc' }
        } 
      },
    })
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
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

    // Hybrid Moderation Check
    const evaluation = await evaluateSubmission(`${title} ${content}`)
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