import type { Metadata } from "next"
import Link from "next/link"
import { MessageCircleQuestion } from "lucide-react"

import { PageIntro, SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { faqGroups } from "@/lib/faq"

export const metadata: Metadata = {
  title: "FAQ | JobPilot",
  description: "Answers to common questions about JobPilot.",
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")

const FaqPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <PageIntro
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about how JobPilot finds, ranks and prepares your applications."
        />

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-8 lg:grid-cols-[14rem_1fr]">
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Categories
              </p>
              {faqGroups.map((g) => (
                <a
                  key={g.category}
                  href={`#${slug(g.category)}`}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {g.category}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-12">
            {faqGroups.map((g) => (
              <div key={g.category} id={slug(g.category)} className="scroll-mt-24 space-y-4">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">{g.category}</h2>
                <Accordion className="rounded-2xl border bg-background px-6">
                  {g.items.map((f) => (
                    <AccordionItem key={f.q} value={f.q}>
                      <AccordionTrigger className="cursor-pointer py-5 text-base">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            <div className="flex flex-col items-start gap-4 rounded-2xl border bg-muted/40 p-6 sm:flex-row sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageCircleQuestion className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-heading text-lg font-semibold">Still have questions?</p>
                <p className="text-sm text-muted-foreground">
                  Our team usually replies within one business day.
                </p>
              </div>
              <Button
                className="cursor-pointer"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Contact us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default FaqPage
