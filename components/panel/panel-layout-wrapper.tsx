import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "./panel-layout"

interface PanelLayoutWrapperProps {
  children: React.ReactNode
  userType?: "cliente" | "comercio"
}

export async function PanelLayoutWrapper({ children, userType }: PanelLayoutWrapperProps) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener plan del comercio si es comercio
  let isPremium = false
  if (userType === "comercio") {
    const { data: comercio } = await supabase
      .from("comercios")
      .select("subscription_plan")
      .eq("owner_id", user.id)
      .single()
    isPremium = comercio?.subscription_plan === "premium"
  }

  return (
    <PanelLayout userType={userType} isPremium={isPremium}>
      {children}
    </PanelLayout>
  )
}
