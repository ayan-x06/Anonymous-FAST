import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const reviews = await prisma.teacherReview.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ questions, reviews }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch all admin data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}