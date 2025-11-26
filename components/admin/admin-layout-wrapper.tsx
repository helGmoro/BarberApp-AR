import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "./admin-layout"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export async function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar que sea admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single()

  if (profile?.user_type !== "admin") {
    redirect("/panel")
  }

  return <AdminLayout>{children}</AdminLayout>
}
