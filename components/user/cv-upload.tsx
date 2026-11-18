"use client"

import { useRef, useState } from "react"
import {
  FileText,
  Loader2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"

import { HowItWorks } from "@/components/home/how-it-works"
import { saveCv, saveCvFile } from "@/components/user/cv-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const MAX_MB = 10
const TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]


export const CvUpload = ({ onCancel }: { onCancel?: () => void }) => {
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const [progress, setProgress] = useState(0)

  const pick = (f?: File) => {
    setError(null)
    if (!f) return
    if (!TYPES.includes(f.type)) return setError("Please upload a PDF or Word file (.pdf, .doc, .docx).")
    if (f.size > MAX_MB * 1024 * 1024) return setError(`That file is too large. The limit is ${MAX_MB} MB.`)
    setFile(f)
  }

  const upload = () => {
    if (!file) return
    // Demo only: simulates upload and CV extraction.
    void saveCvFile(file)
    setProgress(8)
    const t = setInterval(() => {
      setProgress((p) => {
        const n = p + 12
        if (n >= 100) {
          clearInterval(t)
          setTimeout(
            () => saveCv({ name: file.name, size: file.size, uploadedAt: new Date().toISOString() }),
            700
          )
          return 100
        }
        return n
      })
    }, 250)
  }

  const busy = progress > 0

  return (
    <div className="w-full space-y-6">
      {onCancel ? (
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Upload another CV</h1>
          <p className="text-muted-foreground">
            Your new CV replaces the current one, and our team reviews it again to find jobs for you.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="size-3" /> Step 1 of 3
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Upload your CV to get started</h1>
          <p className="text-muted-foreground">
            We use your CV to find and rank jobs for you. It takes about a minute.
          </p>
        </div>
      )}

      <Card className="border border-border">
        <CardContent className="space-y-5">
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload CV"
            onClick={() => !busy && input.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && !busy && input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDrag(false)
              if (!busy) pick(e.dataTransfer.files[0])
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors",
              drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
            )}
          >
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UploadCloud className="size-7" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold">Drag and drop your CV here</p>
              <p className="text-sm text-muted-foreground">
                or <span className="font-medium text-primary">browse files</span> &middot; PDF or Word, up to {MAX_MB} MB
              </p>
            </div>
            <input
              ref={input}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <span>{error}</span>
              <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => input.current?.click()}>
                Try again
              </Button>
            </div>
          )}

          {file && (
            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB &middot;{" "}
                    {progress === 0 ? "Ready to upload" : progress < 100 ? "Uploading and reading your CV..." : "Done"}
                  </p>
                </div>
                {!busy && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="cursor-pointer"
                    aria-label="Remove file"
                    onClick={() => setFile(null)}
                  >
                    <X />
                  </Button>
                )}
              </div>
              {busy && <Progress value={progress} />}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Your CV is encrypted and only used to find jobs for you.
            </p>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" className="cursor-pointer" onClick={onCancel} disabled={busy}>
                  Cancel
                </Button>
              )}
              <Button className="cursor-pointer" disabled={!file || busy} onClick={upload}>
                {busy && <Loader2 className="animate-spin" />}
                {busy ? "Uploading..." : "Upload CV"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t pt-8">
        <HowItWorks compact />
      </div>
    </div>
  )
}
