import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all answers (pending and approved) for the admin dashboard
export async function GET() {
  try {
    const answers = await prisma.answer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        question: true, // Includes the parent question so you can see context
      },
    })
    return NextResponse.json(answers, { status: 200 })
  } catch (error) {
    console.error('Admin Fetch Answers Error:', error)
    return NextResponse.json({ error: 'Failed to fetch admin answers' }, { status: 500 })
  }
}

// PATCH: Approve a specific answer by ID
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing answer id' }, { status: 400 })
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { isApproved: true },
    })

    return NextResponse.json({ success: true, data: updatedAnswer }, { status: 200 })
  } catch (error) {
    console.error('Answer Approval Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}