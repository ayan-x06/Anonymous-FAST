import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Incoming answer body:', body) // Check your Vercel logs if it fails

    // Support both camelCase and snake_case or alternative field names
    const content = body.content || body.answerContent || body.text
    const questionId = body.questionId || body.question_id

    if (!content || !questionId) {
      return NextResponse.json({ error: 'Missing content or questionId', received: body }, { status: 400 })
    }

    const newAnswer = await prisma.answer.create({
      data: {
        content,
        questionId,
      },
    })

    return NextResponse.json(newAnswer, { status: 201 })
  } catch (error: any) {
    console.error('Error posting answer detail:', error)
    return NextResponse.json({ error: error.message || 'Failed to post answer' }, { status: 500 })
  }
}