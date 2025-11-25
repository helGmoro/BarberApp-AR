import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Settings,
  ScissorsIcon,
  Tag,
  LogOut,
  CreditCard,
  DollarSign,
  Crown,
  User,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PanelLayoutProps {
  children: React.ReactNode
  userType?: "cliente" | "comercio"
}

export async function PanelLayout({ children, userType }: PanelLayoutProps) {
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

  const premiumFeatures = ["/panel/comercio/promociones", "/panel/comercio/balances", "/panel/comercio/integracion-mp"]

  const menuItems =
    userType === "comercio"
      ? [
          { href: "/panel/comercio", label: "Dashboard", icon: LayoutDashboard, premium: false },
          { href: "/panel/comercio/turnos", label: "Turnos", icon: Calendar, premium: false },
          { href: "/panel/comercio/servicios", label: "Servicios", icon: ScissorsIcon, premium: false },
          { href: "/panel/comercio/promociones", label: "Promociones", icon: Tag, premium: true },
          { href: "/panel/comercio/balances", label: "Balances", icon: DollarSign, premium: true },
          { href: "/panel/comercio/integracion-mp", label: "Mercado Pago", icon: CreditCard, premium: true },
          { href: "/panel/comercio/suscripcion", label: "Suscripción", icon: Settings, premium: false },
          { href: "/panel/comercio/configuracion", label: "Configuración", icon: Settings, premium: false },
          { href: "/panel/comercio/mi-perfil", label: "Mi Perfil", icon: User, premium: false },
        ]
      : [
          { href: "/panel/cliente", label: "Inicio", icon: LayoutDashboard, premium: false },
          { href: "/panel/cliente/mis-turnos", label: "Mis Turnos", icon: Calendar, premium: false },
          { href: "/panel/perfil", label: "Perfil", icon: Settings, premium: false },
          { href: "/buscar", label: "Buscar Barberías", icon: ScissorsIcon, premium: false },
        ]

  return (
    <div className="min-h-screen">
      {/* Sidebar fixed */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-muted/40 p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">BarberApp AR</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium group"
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.premium && !isPremium && (
                <Crown className="h-3 w-3 text-primary opacity-60 group-hover:opacity-100" />
              )}
            </Link>
          ))}
        </nav>

        <form action="/api/auth/signout" method="POST">
          <Button variant="ghost" className="w-full justify-start" type="submit">
            <LogOut className="h-4 w-4 mr-3" />
            Cerrar Sesión
          </Button>
        </form>
      </aside>
      {/* Main content shifted */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
