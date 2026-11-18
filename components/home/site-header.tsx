import Link from "next/link"
import { Target } from "lucide-react"

import { HeaderActions } from "@/components/home/header-actions"

const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Target className="size-5" />
          </div>
          <span className="font-heading text-lg font-semibold">JobPilot</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <HeaderActions />
        </div>
      </div>
    </header>
  )
}
