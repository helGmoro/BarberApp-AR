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
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

  const menuItems =
    userType === "comercio"
      ? [
          { href: "/panel/comercio", label: "Dashboard", icon: LayoutDashboard },
          { href: "/panel/comercio/turnos", label: "Turnos", icon: Calendar },
          { href: "/panel/comercio/servicios", label: "Servicios", icon: ScissorsIcon },
          { href: "/panel/comercio/promociones", label: "Promociones", icon: Tag },
          { href: "/panel/comercio/balances", label: "Balances", icon: DollarSign },
          { href: "/panel/comercio/integracion-mp", label: "Mercado Pago", icon: CreditCard },
          { href: "/panel/comercio/suscripcion", label: "Suscripción", icon: Settings },
          { href: "/panel/comercio/configuracion", label: "Configuración", icon: Settings },
        ]
      : [
          { href: "/panel/cliente", label: "Inicio", icon: LayoutDashboard },
          { href: "/panel/cliente/mis-turnos", label: "Mis Turnos", icon: Calendar },
          { href: "/buscar", label: "Buscar Barberías", icon: ScissorsIcon },
        ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">BarberApp AR</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
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

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
