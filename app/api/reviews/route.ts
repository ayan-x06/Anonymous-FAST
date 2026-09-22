import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all teacher reviews for the admin control panel
export async function GET() {
  try {
    const reviews = await prisma.teacherReview.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch teacher reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch teacher reviews' }, { status: 500 })
  }
}

// POST: Handle approve, unapprove (hide), or delete actions from the admin panel
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body

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
    
    if (action === 'unapprove') {
      const updated = await prisma.teacherReview.update({
        where: { id },
        data: { isApproved: false },
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
    console.error('Admin teacher review action error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}