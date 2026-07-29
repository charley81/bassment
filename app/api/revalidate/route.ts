import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook secret (if configured)
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
    if (webhookSecret && body.secret !== webhookSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate all pages that fetch from Sanity
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
