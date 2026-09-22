import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission } from '@/lib/moderation'
import { z } from 'zod'

const answerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  content: z.string().min(2, 'Answer must be at least 2 characters long').max(1000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = answerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { questionId, content } = validation.data

    // Optional moderation check for answers
    const evaluation = await evaluateSubmission(content)
    const isApproved = evaluation.status === 'APPROVED'

    const newAnswer = await prisma.answer.create({
      data: {
        questionId,
        content,
        isApproved,
      },
    })

    return NextResponse.json(
      { 
        answer: newAnswer, 
        message: isApproved ? 'Answer posted successfully!' : 'Answer submitted for moderation.' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Answer submission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}