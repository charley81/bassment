import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Fail closed: without a configured secret there is NO way to
    // authenticate callers, so refuse rather than allow open revalidation.
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('SANITY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ message: 'Revalidation not configured' }, { status: 500 })
    }
    // Accept the secret from the URL query (standard Sanity webhook
    // pattern — the secret rides in the configured webhook URL) or from
    // the JSON body (legacy callers).
    const secret =
      request.nextUrl.searchParams.get('secret') ?? body.secret
    if (secret !== webhookSecret) {
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
