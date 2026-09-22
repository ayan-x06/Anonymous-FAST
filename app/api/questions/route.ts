import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all unapproved/pending questions for the admin queue
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch pending questions:', error)
    return NextResponse.json({ error: 'Failed to fetch pending questions' }, { status: 500 })
  }
}

// POST: Approve or Delete a question from the admin panel
export async function POST(request: Request) {
  try {
    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing question id or action' }, { status: 400 })
    }

    if (action === 'approve') {
      const updated = await prisma.question.update({
        where: { id },
        data: { isApproved: true },
      })
      return NextResponse.json({ success: true, updated }, { status: 200 })
    } 
    
    if (action === 'delete') {
      await prisma.question.delete({
        where: { id },
      })
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 })
  } catch (error) {
    console.error('Admin question action error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}