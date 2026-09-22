import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { questionId, content } = await req.json()
    
    if (!content || !questionId) {
      return NextResponse.json({ error: 'Content and questionId are required' }, { status: 400 })
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
      },
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create answer' }, { status: 500 })
  }
}