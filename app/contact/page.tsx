import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, HelpCircle, Mail, ShieldCheck } from "lucide-react"

import { ContactForm } from "@/components/home/contact-form"
import { PageIntro, SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact us | JobPilot",
  description: "Get in touch with the JobPilot team.",
}

// Placeholder contact details. Replace with the client's real addresses.
const channels = [
  { icon: Mail, title: "Email support", text: "support@example.com", note: "For account and application questions" },
  { icon: ShieldCheck, title: "Privacy requests", text: "privacy@example.com", note: "Data access and deletion requests" },
  { icon: Clock, title: "Response time", text: "Within one business day", note: "Monday to Friday" },
]

const ContactPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <PageIntro
          eyebrow="Contact us"
          title="We're here to help"
          description="Questions about your account, matches or applications? Send us a message and we'll get back to you."
        />

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:px-8 lg:grid-cols-[1fr_22rem]">
          <Card className="border border-border">
            <CardContent className="space-y-6 px-6 py-2 sm:px-8 sm:py-4">
              <div className="space-y-1">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">Send us a message</h2>
                <p className="text-sm text-muted-foreground">All fields are required.</p>
              </div>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {channels.map((c) => (
              <div key={c.title} className="flex gap-4 rounded-2xl border p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="truncate font-heading font-semibold">{c.text}</p>
                  <p className="text-xs text-muted-foreground">{c.note}</p>
                </div>
              </div>
            ))}

            <Link
              href="/faq"
              className="group flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground transition-opacity hover:opacity-95"
            >
              <HelpCircle className="size-6 shrink-0" />
              <div className="flex-1">
                <p className="font-heading font-semibold">Check the FAQ first</p>
                <p className="text-sm text-primary-foreground/80">Most questions are answered there.</p>
              </div>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default ContactPage
