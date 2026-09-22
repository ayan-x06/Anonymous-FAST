import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { content, questionId } = await request.json()

    if (!content || !questionId) {
      return NextResponse.json({ error: 'Missing content or question ID' }, { status: 400 })
    }

    const newAnswer = await prisma.answer.create({
      data: {
        content,
        questionId,
        isApproved: false, // Goes to admin moderation first
      },
    })

    return NextResponse.json({ success: true, answer: newAnswer }, { status: 201 })
  } catch (error) {
    console.error('Answer Submission Error:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}