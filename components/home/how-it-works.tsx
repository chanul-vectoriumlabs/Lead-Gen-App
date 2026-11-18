import { FileText, Gauge, ListChecks, Upload } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const steps = [
  { icon: Upload, title: "Upload your CV", text: "PDF or Word. AI reads your titles, skills, experience and certifications." },
  { icon: ListChecks, title: "Confirm what you want", text: "Set target titles, locations, remote or onsite and salary. Edit anything." },
  { icon: Gauge, title: "Get ranked matches", text: "Jobs scored 0-100 against your CV, each with a short reason." },
  { icon: FileText, title: "Approve and apply", text: "Pick jobs, review a tailored resume and cover letter, then approve." },
]

/** "From CV to application in four steps", shared by the home page and the CV upload screen. */
export const HowItWorks = ({ compact = false }: { compact?: boolean }) => (
  <div className={cn(compact ? "space-y-6" : "space-y-12")}>
    <div className={cn("space-y-3", compact ? "" : "mx-auto max-w-2xl text-center")}>
      <p className="text-sm font-semibold tracking-wider text-primary uppercase">How it works</p>
      <h2
        className={cn(
          "font-heading font-semibold tracking-tight",
          compact ? "text-2xl" : "text-3xl md:text-4xl"
        )}
      >
        From CV to application in four steps
      </h2>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <Card key={s.title} className="border border-border transition-shadow hover:shadow-md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </div>
              <span className="font-heading text-3xl font-semibold text-muted-foreground/40">0{i + 1}</span>
            </div>
            <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)
