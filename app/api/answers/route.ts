import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, questionId } = body

    if (!content || !questionId) {
      return NextResponse.json({ error: 'Missing content or questionId' }, { status: 400 })
    }

    const newAnswer = await prisma.answer.create({
      data: {
        content,
        questionId,
      },
    })

    return NextResponse.json(newAnswer, { status: 201 })
  } catch (error) {
    console.error('Error posting answer:', error)
    return NextResponse.json({ error: 'Failed to post answer' }, { status: 500 })
  }
}