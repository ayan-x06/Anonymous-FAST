import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // If your schema uses 'review' instead of 'teacherReview', change prisma.teacherReview to prisma.review
    const reviews = await prisma.teacherReview.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Failed to fetch admin reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    await prisma.teacherReview.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}