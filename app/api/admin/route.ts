import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-secure-admin-token'

// GET: Fetch all unapproved pending items
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const pendingQuestions = await prisma.question.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    })

    const pendingReviews = await prisma.teacherReview.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ questions: pendingQuestions, reviews: pendingReviews }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pending items' }, { status: 500 })
  }
}

// PATCH: Approve or Delete a submission
export async function PATCH(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, type, action } = await request.json()

    if (!id || !type || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    if (type === 'question') {
      if (action === 'approve') {
        await prisma.question.update({ where: { id }, data: { isApproved: true } })
      } else {
        await prisma.question.delete({ where: { id } })
      }
    } else if (type === 'review') {
      if (action === 'approve') {
        await prisma.teacherReview.update({ where: { id }, data: { isApproved: true } })
      } else {
        await prisma.teacherReview.delete({ where: { id } })
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}