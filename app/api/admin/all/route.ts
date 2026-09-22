import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all questions (with answers) and teacher reviews for admin moderation
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        answers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const reviews = await prisma.teacherReview.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ questions, reviews }, { status: 200 })
  } catch (error) {
    console.error('Admin Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to load admin data' }, { status: 500 })
  }
}

// PATCH: Approve or unapprove a question, answer, or review
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { type, id, isApproved } = body

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or ID' }, { status: 400 })
    }

    let updatedItem

    if (type === 'questions') {
      updatedItem = await prisma.question.update({
        where: { id },
        data: { isApproved },
      })
    } else if (type === 'answers') {
      // Answer approval logic handled properly here
      updatedItem = await prisma.answer.update({
        where: { id },
        data: { isApproved },
      })
    } else if (type === 'reviews') {
      updatedItem = await prisma.teacherReview.update({
        where: { id },
        data: { isApproved },
      })
    } else {
      return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 })
    }

    return NextResponse.json({ success: true, updatedItem }, { status: 200 })
  } catch (error) {
    console.error('Admin Update Error:', error)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }
}

// DELETE: Remove a question, answer, or review completely
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or ID parameters' }, { status: 400 })
    }

    if (type === 'questions') {
      await prisma.question.delete({ where: { id } })
    } else if (type === 'answers') {
      // Answer deletion handler
      await prisma.answer.delete({ where: { id } })
    } else if (type === 'reviews') {
      await prisma.teacherReview.delete({ where: { id } })
    } else {
      return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Admin Delete Error:', error)
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}