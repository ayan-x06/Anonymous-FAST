import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all pending questions and answers for the admin review queue
export async function GET() {
  try {
    const pendingQuestions = await prisma.question.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    })

    const pendingAnswers = await prisma.answer.findMany({
      where: { isApproved: false },
      include: { question: true }, // Includes the parent question so you know what the answer is replying to
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      {
        pendingQuestions,
        pendingAnswers,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin Review Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch review queue' }, { status: 500 })
  }
}

// PATCH: Approve or Reject a specific question or answer
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, type, action } = body // type: 'question' | 'answer', action: 'approve' | 'reject'

    if (!id || !type || !action) {
      return NextResponse.json({ error: 'Missing required fields (id, type, action)' }, { status: 400 })
    }

    if (type === 'question') {
      if (action === 'approve') {
        const updated = await prisma.question.update({
          where: { id },
          data: { isApproved: true },
        })
        return NextResponse.json({ success: true, data: updated }, { status: 200 })
      } else {
        // Rejecting deletes the unapproved submission from the database
        await prisma.question.delete({ where: { id } })
        return NextResponse.json({ success: true, message: 'Question rejected and removed.' }, { status: 200 })
      }
    }

    if (type === 'answer') {
      if (action === 'approve') {
        const updated = await prisma.answer.update({
          where: { id },
          data: { isApproved: true },
        })
        return NextResponse.json({ success: true, data: updated }, { status: 200 })
      } else {
        await prisma.answer.delete({ where: { id } })
        return NextResponse.json({ success: true, message: 'Answer rejected and removed.' }, { status: 200 })
      }
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 })
  } catch (error) {
    console.error('Review Action Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}