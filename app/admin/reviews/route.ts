import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const reviews = await prisma.teacherReview.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body
    const targetId = id || body.reviewId

    if (!targetId || !action) {
      return NextResponse.json({ error: 'Missing review id or action', received: body }, { status: 400 })
    }

    if (action === 'approve') {
      const updated = await prisma.teacherReview.update({
        where: { id: targetId },
        data: { isApproved: true },
      })
      return NextResponse.json({ success: true, updated })
    } else if (action === 'unapprove') {
      const updated = await prisma.teacherReview.update({
        where: { id: targetId },
        data: { isApproved: false },
      })
      return NextResponse.json({ success: true, updated })
    } else if (action === 'delete') {
      await prisma.teacherReview.delete({
        where: { id: targetId },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin review action error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}