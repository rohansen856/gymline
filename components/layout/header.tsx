"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between no-print">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </Button>
        <h2 className="text-xl font-bold text-primary hidden sm:block">GymLine</h2>
      </div>
      <div className="text-sm text-muted">💪 Build Your Best Self</div>
    </header>
  )
}
