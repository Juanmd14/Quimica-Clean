import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const ASESORA_IDS = ['luciana', 'rocio', 'laura'] as const
type AsesoraId = (typeof ASESORA_IDS)[number]

const COOKIE_NAME = 'qc-asesora-id'
const ONE_YEAR = 60 * 60 * 24 * 365

function isAsesoraId(v: string | undefined): v is AsesoraId {
  return !!v && (ASESORA_IDS as readonly string[]).includes(v)
}

export async function GET() {
  const jar = await cookies()
  const existing = jar.get(COOKIE_NAME)?.value

  if (isAsesoraId(existing)) {
    return NextResponse.json({ id: existing })
  }

  let id: AsesoraId
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.rpc('next_asesora_index', {
      p_modulus: ASESORA_IDS.length,
    })
    if (error || typeof data !== 'number') throw error ?? new Error('bad data')
    id = ASESORA_IDS[data] ?? ASESORA_IDS[0]
  } catch {
    id = ASESORA_IDS[Math.floor(Math.random() * ASESORA_IDS.length)]
  }

  const res = NextResponse.json({ id })
  res.cookies.set(COOKIE_NAME, id, {
    maxAge: ONE_YEAR,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  })
  return res
}
