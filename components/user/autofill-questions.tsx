"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AutofillForm, useAutofillState } from "@/components/user/autofill-form"
import { saveAnswers } from "@/components/user/answers-store"
import { StickySave } from "@/components/user/settings-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const AutofillQuestions = () => {
  const { answers, onAnswer, screening, setScreening } = useAutofillState()
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Autofill questions</h2>
        <p className="text-sm text-muted-foreground">
          We use these answers to fill in applications as far as possible. You still approve every application.
        </p>
      </div>

      <Card className="border border-border">
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-muted/60 px-4 py-3">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">Priya Sharma</p>
            </div>
            <div className="rounded-lg bg-muted/60 px-4 py-3">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">priya@example.com</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-primary" nativeButton={false} render={<Link href="/account" />}>
              Go to account info <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AutofillForm
        scope="autofill"
        answers={answers}
        onAnswer={(k, v) => {
          setSaved(false)
          onAnswer(k, v)
        }}
        screening={screening}
        onScreening={(v) => {
          setSaved(false)
          setScreening(v)
        }}
      />

      <StickySave saved={saved} label="Answers saved" onSave={() => {
          saveAnswers(answers, screening)
          setSaved(true)
        }} />
    </div>
  )
}
