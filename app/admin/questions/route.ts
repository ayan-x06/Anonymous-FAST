import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body

    // Fallback safety check if the frontend sent it nested or under a different name
    const targetId = id || body.questionId

    if (!targetId || !action) {
      return NextResponse.json({ error: 'Missing question id or action', received: body }, { status: 400 })
    }

    if (action === 'approve') {
      const updated = await prisma.question.update({
        where: { id: targetId },
        data: { isApproved: true },
      })
      return NextResponse.json({ success: true, updated })
    } else if (action === 'unapprove') {
      const updated = await prisma.question.update({
        where: { id: targetId },
        data: { isApproved: false },
      })
      return NextResponse.json({ success: true, updated })
    } else if (action === 'delete') {
      await prisma.question.delete({
        where: { id: targetId },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin question action error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}