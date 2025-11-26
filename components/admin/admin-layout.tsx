"use client"

import type React from "react"
import { Scissors, LayoutDashboard, Building2, Users, DollarSign, Settings, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/comercios", label: "Comercios", icon: Building2 },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    { href: "/admin/pagos", label: "Pagos", icon: DollarSign },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ]

  const SidebarContent = () => (
    <>
      <Link href="/" className="flex items-center gap-2 mb-6 sm:mb-8" onClick={() => setIsOpen(false)}>
        <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <span className="font-bold text-lg sm:text-xl">BarberApp AR</span>
      </Link>

      <div className="mb-4 px-3 py-2 bg-primary/10 rounded-lg">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide">Panel Admin</p>
      </div>

      <nav className="flex-1 space-y-1 sm:space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
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
              <SheetTitle>Menú de administración</SheetTitle>
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
      <main className="pt-14 lg:pt-0 lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
