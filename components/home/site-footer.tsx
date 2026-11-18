import Link from "next/link"
import { Target } from "lucide-react"

const links = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Sign in", href: "/login" },
]

export const SiteFooter = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:px-8">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-primary" />
          <span className="font-medium text-foreground">JobPilot</span>
          <span>&middot; AI Job Intelligence &amp; Recruitment Automation Platform</span>
        </div>
        <div className="flex flex-wrap gap-5">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export const PageIntro = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) => {
  return (
    <section className="relative overflow-hidden border-b bg-muted/40">
      <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/10" />
      <div className="relative mx-auto max-w-3xl space-y-4 px-4 py-16 text-center md:px-8 md:py-20">
        <p className="text-sm font-semibold tracking-wider text-primary uppercase">{eyebrow}</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}
