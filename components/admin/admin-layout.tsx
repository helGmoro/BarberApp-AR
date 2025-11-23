import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Scissors, LayoutDashboard, Building2, Users, DollarSign, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: React.ReactNode
}

export async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/comercios", label: "Comercios", icon: Building2 },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    { href: "/admin/pagos", label: "Pagos", icon: DollarSign },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">BarberApp AR</span>
        </Link>

        <div className="mb-4 px-3 py-2 bg-primary/10 rounded-lg">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Panel Admin</p>
        </div>

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
