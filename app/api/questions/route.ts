import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission } from '@/lib/moderation'
import { z } from 'zod'

const questionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(150),
  content: z.string().min(10, 'Content must be at least 10 characters long').max(1000),
  tags: z.string().optional(),
})

// GET: Fetch all active, approved questions
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { answers: true } },
      },
    })
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST: Submit a new anonymous question with hybrid moderation routing
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = questionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { title, content, tags } = validation.data

   // 2. Hybrid Moderation Check
const evaluation = await evaluateSubmission(`${title} ${content}`)

if (evaluation.status === 'PENDING_REVIEW') {
  return NextResponse.json(
    { error: `Submission blocked: ${evaluation.reason || 'Contains prohibited or toxic language.'}` },
    { status: 403 }
  )
}

// Then create it directly as approved since it passed moderation
const newQuestion = await prisma.question.create({
  data: {
    title,
    content,
    tags: tags || 'general',
    isApproved: true, // Automatically live if it bypassed the block
  },
})
    return NextResponse.json(
      {
        question: newQuestion,
        status: evaluation.status,
        message: 'Published successfully!', // ✅ Fixed
      },
      { status: 201 }
    )
    
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}