import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all questions and answers (pending + approved) for the admin dashboard
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    console.error('Admin Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch admin questions' }, { status: 500 })
  }
}

// PATCH: Approve a specific question or answer by ID
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, type } = body // type should be either 'question' or 'answer'

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
    }

    if (type === 'question') {
      const updatedQuestion = await prisma.question.update({
        where: { id },
        data: { isApproved: true },
      })
      return NextResponse.json({ success: true, data: updatedQuestion }, { status: 200 })
    } 
    
    if (type === 'answer') {
      const updatedAnswer = await prisma.answer.update({
        where: { id },
        data: { isApproved: true },
      })
      return NextResponse.json({ success: true, data: updatedAnswer }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 })
  } catch (error) {
    console.error('Approval Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}