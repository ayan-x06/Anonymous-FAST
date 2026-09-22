import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { containsProfanity } from '@/lib/moderation'
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

// POST: Submit a new anonymous question with moderation check
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = questionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { title, content, tags } = validation.data

    const titleFlagged = containsProfanity(title)
    const contentFlagged = containsProfanity(content)

    if (titleFlagged || contentFlagged) {
      return NextResponse.json(
        { error: 'Your submission contains prohibited language or policy violations.' },
        { status: 403 }
      )
    }

    // POST: Submit a new anonymous question for moderation
const newQuestion = await prisma.question.create({
  data: {
    title,
    content,
    tags: tags || 'general',
    isApproved: false, // Ensures it waits for admin approval before appearing publicly
  },
})
    return NextResponse.json(newQuestion, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}