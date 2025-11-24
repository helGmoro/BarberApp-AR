import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  // Usamos 303 para forzar cambio de método a GET tras un POST y evitar 405 en la página de inicio
  return NextResponse.redirect(new URL("/", request.url), 303)
}
