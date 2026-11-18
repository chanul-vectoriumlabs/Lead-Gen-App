"use client"

import Link from "next/link"
import { CheckCircle2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

const preview = [
  { label: "Availability", value: "Immediately" },
  { label: "Age verification", value: "Yes, over 18" },
  { label: "Work mode preference", value: "Remote, hybrid" },
]

export const AutoApplyDialog = ({
  open,
  count,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  count: number
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="relative flex justify-center bg-primary/10 px-6 pt-6 pb-10">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary/10" />
          <div className="relative w-64 space-y-3 rounded-xl border bg-background p-4 shadow-lg">
            {preview.map((p, i) => (
              <div key={p.label} className="space-y-1">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {p.label}
                </p>
                <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5 text-sm font-medium">
                  {p.value}
                  {i === 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Sparkles className="size-3" />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <span className="absolute -bottom-3 -left-4 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
              <CheckCircle2 className="size-3.5" /> Ready for your approval
            </span>
          </div>
        </div>

        <div className="space-y-3 px-6 pt-7 text-center">
          <DialogTitle className="font-heading text-2xl font-semibold">Auto apply</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Our AI tailors a resume and cover letter for {count === 1 ? "this job" : `these ${count} jobs`} and
            fills in the application answers for you. You review and approve before anything is sent. Some
            answers may be incorrect if you don&apos;t{" "}
            <Link
              href="/resume-settings?tab=autofill"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              manage your autofill settings
            </Link>{" "}
            first.
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-2 px-6 pt-6 pb-6">
          <Button
            size="lg"
            className="h-11 w-full"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Start auto apply
          </Button>
          <DialogClose render={<Button variant="ghost" className="w-full text-primary" />}>
            Not yet
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
