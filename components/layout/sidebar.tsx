"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Dumbbell, Apple, TrendingUp, Calendar, Settings } from "lucide-react"

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/diet", label: "Diet", icon: Apple },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/weekly-tracker", label: "Weekly Tracker", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border p-6 no-print hidden lg:block overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">GymLine</h1>
        <p className="text-sm text-muted-foreground">12-Week Transformation</p>
      </div>

      <nav className="space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
