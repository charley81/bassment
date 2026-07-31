/* BASSMENT — Resident DJ Carousel Section */
import { getResidentDjs } from '@/lib/sanity/fetch'
import { ResidentDjsClient } from './resident-djs-client'

export async function ResidentDjs() {
  const djs = await getResidentDjs()
  return <ResidentDjsClient djs={djs || []} />
}
