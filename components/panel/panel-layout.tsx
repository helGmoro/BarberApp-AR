"use client"

import type React from "react"
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
  Menu,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface PanelLayoutProps {
  children: React.ReactNode
  userType?: "cliente" | "comercio"
  isPremium?: boolean
}

export function PanelLayout({ children, userType, isPremium = false }: PanelLayoutProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
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
          { href: "/panel/cliente/perfil", label: "Perfil", icon: Settings, premium: false },
          { href: "/buscar", label: "Buscar Barberías", icon: ScissorsIcon, premium: false },
        ]

  const SidebarContent = () => (
    <>
      <Link href="/" className="flex items-center gap-2 mb-6 sm:mb-8" onClick={() => setIsOpen(false)}>
        <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <span className="font-bold text-lg sm:text-xl">BarberApp AR</span>
      </Link>

      <nav className="flex-1 space-y-1 sm:space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium group"
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {item.premium && !isPremium && (
              <Crown className="h-3 w-3 text-primary opacity-60 group-hover:opacity-100" />
            )}
          </Link>
        ))}
      </nav>

      <Button 
        variant="ghost" 
        className="w-full justify-start mt-4" 
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-3" />
        Cerrar Sesión
      </Button>
    </>
  )

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b bg-background/95 backdrop-blur z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">BarberApp AR</span>
        </Link>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6 flex flex-col">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r bg-muted/40 p-6 flex-col">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="pt-14 lg:pt-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
