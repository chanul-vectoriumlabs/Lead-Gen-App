"use client"

import { useRef, useState, type ReactElement } from "react"
import { FileText, Loader2, Upload, UploadCloud, X } from "lucide-react"

import { saveCv } from "@/components/user/cv-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const MAX_MB = 10
const TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export const UploadResumeDialog = ({ trigger }: { trigger?: ReactElement }) => {
  const input = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)

  const pick = (f?: File) => {
    setError(null)
    if (!f) return
    if (!TYPES.includes(f.type)) return setError("Please upload a PDF or Word file.")
    if (f.size > MAX_MB * 1024 * 1024) return setError(`The limit is ${MAX_MB} MB.`)
    setFile(f)
  }

  const reset = () => {
    setFile(null)
    setError(null)
    setBusy(false)
  }

  const upload = () => {
    if (!file) return
    // Demo only: simulates upload and CV extraction.
    setBusy(true)
    setTimeout(() => {
      saveCv({ name: file.name, size: file.size, uploadedAt: new Date().toISOString() })
      reset()
      setOpen(false)
    }, 1200)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger render={<Button />}>
          <Upload /> Upload new resume
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload a new resume</DialogTitle>
          <DialogDescription>PDF or Word, up to {MAX_MB} MB. It becomes your primary resume.</DialogDescription>
        </DialogHeader>

        <div
          role="button"
          tabIndex={0}
          aria-label="Choose a resume file"
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
            "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
          )}
        >
          <UploadCloud className="size-8 text-primary" />
          <p className="font-medium">Drag and drop, or browse files</p>
          <input
            ref={input}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {file && (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <FileText className="size-5 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            {!busy && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                aria-label="Remove file"
                onClick={() => setFile(null)}
              >
                <X />
              </Button>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="cursor-pointer" disabled={busy} />}>
            Cancel
          </DialogClose>
          <Button className="cursor-pointer" disabled={!file || busy} onClick={upload}>
            {busy && <Loader2 className="animate-spin" />}
            {busy ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
