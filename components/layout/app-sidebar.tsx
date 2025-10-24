"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/authContext"
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  FileText,
  Shield,
  Tag,
  History,
  Settings,
  CheckSquare,
  UserCircle,
  Laptop,
} from "lucide-react"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: ("admin" | "stock_manager" | "cashier")[]
  isDashboard?: boolean
}

const navItems: NavItem[] = [
  // Tableaux de bord séparés
  {
    title: "Tableau de bord",
    href: "/admin/dashboard-admin",
    icon: LayoutDashboard,
    roles: ["admin"],
    isDashboard: true,
  },
  {
    title: "Tableau de bord",
    href: "/stock_manager/dashboard-stock",
    icon: LayoutDashboard,
    roles: ["stock_manager"],
    isDashboard: true,
  },
  {
    title: "Tableau de bord",
    href: "/cashier/dashboard-cashier",
    icon: LayoutDashboard,
    roles: ["cashier"],
    isDashboard: true,
  },
  // Routes dynamiques
  {
    title: "Utilisateurs",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Produits",
    href: "/products",
    icon: Package,
    roles: ["admin", "stock_manager"],
  },
  {
    title: "Catégories",
    href: "/categories",
    icon: FolderTree,
    roles: ["admin", "stock_manager"],
  },
  {
    title: "Mouvements Stock",
    href: "/stock-movements",
    icon: TrendingUp,
    roles: ["admin", "stock_manager"],
  },
  {
    title: "Nouvelle Vente",
    href: "/new-sale",
    icon: ShoppingCart,
    roles: ["cashier"],
  },
  {
    title: "Ventes",
    href: "/sales",
    icon: ShoppingCart,
    roles: ["admin", "cashier"],
  },
  {
    title: "Clients",
    href: "/clients",
    icon: UserCircle,
    roles: ["admin", "cashier"],
  },
  {
    title: "Paiements",
    href: "/payments",
    icon: CreditCard,
    roles: ["admin", "cashier"],
  },
  {
    title: "Factures",
    href: "/invoices",
    icon: FileText,
    roles: ["admin", "cashier"],
  },
  {
    title: "Garanties",
    href: "/warranties",
    icon: Shield,
    roles: ["admin", "cashier"],
  },
  {
    title: "Promotions",
    href: "/promotions",
    icon: Tag,
    roles: ["admin"],
  },
  {
    title: "Historique",
    href: "/audit",
    icon: History,
    roles: ["admin"],
  },
  {
    title: "Validations",
    href: "/validations",
    icon: CheckSquare,
    roles: ["admin"],
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },

]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role))

  // fonction utilitaire pour construire href dynamique
  const buildHref = (item: NavItem) => {
    if (item.isDashboard) return item.href
    return `/${user?.role}${item.href}`
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">Computer Store</h1>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const href = buildHref(item)
              const isActive = pathname === href

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gradient-red text-white"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
