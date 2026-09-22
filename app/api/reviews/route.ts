import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all unapproved/pending teacher reviews for the admin queue
export async function GET() {
  try {
    const reviews = await prisma.teacherReview.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch pending reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch pending reviews' }, { status: 500 })
  }
}

// POST: Approve or Delete a teacher review from the admin panel
export async function POST(request: Request) {
  try {
    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing review id or action' }, { status: 400 })
    }

    if (action === 'approve') {
      const updated = await prisma.teacherReview.update({
        where: { id },
        data: { isApproved: true },
      })
      return NextResponse.json({ success: true, updated }, { status: 200 })
    } 
    
    if (action === 'delete') {
      await prisma.teacherReview.delete({
        where: { id },
      })
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 })
  } catch (error) {
    console.error('Admin review action error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}