"use client"

import { useEffect, useState, type ReactElement, type ReactNode } from "react"
import { Download, Eye, FileText, FileX, X } from "lucide-react"

import { loadCvFile, type StoredCv } from "@/components/user/cv-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

const isPdf = (f: File) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")

type Loaded = { file: File; url: string } | null | undefined

/**
 * Opens a CV in a large viewer. With `loadFile`, it shows the file uploaded in this browser
 * (PDFs inline, other types as a download). Otherwise, or when no file is stored, it shows `fallback`.
 */
export const CvViewer = ({
  cv,
  loadFile = true,
  fileKey,
  fallback,
  trigger,
  children,
}: {
  cv: Pick<StoredCv, "name"> & Partial<StoredCv>
  loadFile?: boolean
  /** Which stored file to show; defaults to the signed-in user's CV. */
  fileKey?: string
  fallback?: ReactNode
  trigger?: ReactElement
  children?: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState<Loaded>(undefined)

  useEffect(() => {
    if (!open) return
    let url = ""
    let cancelled = false
    const load = loadFile ? loadCvFile(fileKey) : Promise.resolve(null)
    load.then((file) => {
      if (cancelled) return
      if (!file) return setLoaded(null)
      url = URL.createObjectURL(file)
      setLoaded({ file, url })
    })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
      setLoaded(undefined)
    }
  }, [open, loadFile, fileKey])

  const meta = [
    cv.size ? formatSize(cv.size) : null,
    cv.uploadedAt ? `uploaded ${new Date(cv.uploadedAt).toLocaleDateString()}` : null,
  ].filter(Boolean)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? <Button variant="outline" className="cursor-pointer bg-background" />}>
        {children ?? (
          <>
            <Eye /> View CV
          </>
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex h-[92vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
      >
        <div className="flex items-center gap-2 border-b bg-background px-4 py-2.5">
          <FileText className="size-4 shrink-0 text-primary" />
          <div className="mr-auto min-w-0">
            <DialogTitle className="truncate text-sm font-semibold">{loaded ? loaded.file.name : cv.name}</DialogTitle>
            <DialogDescription className="text-xs">{meta.length ? meta.join(" · ") : "CV"}</DialogDescription>
          </div>
          {loaded && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              nativeButton={false}
              render={<a href={loaded.url} download={loaded.file.name} />}
            >
              <Download /> Download
            </Button>
          )}
          <Separator orientation="vertical" className="mx-1 h-5" />
          <DialogClose render={<Button variant="ghost" size="icon-sm" className="cursor-pointer" aria-label="Close" />}>
            <X />
          </DialogClose>
        </div>

        <div className="flex min-h-0 flex-1 bg-muted">
          {loaded === undefined ? (
            <Skeleton className="m-6 flex-1" />
          ) : loaded === null ? (
            fallback ? (
              <div className="flex-1 overflow-auto px-4 py-8">{fallback}</div>
            ) : (
              <Message
                title="Preview not available"
                text="The original file isn't stored in this browser. Use Switch to upload your CV again to view it here."
              />
            )
          ) : isPdf(loaded.file) ? (
            <iframe title={`CV: ${loaded.file.name}`} src={loaded.url} className="size-full flex-1 border-0" />
          ) : (
            <Message
              title="Preview isn't available for this file type"
              text="Word documents can't be shown in the browser. Download the file to open it."
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const Message = ({ title, text }: { title: string; text: string }) => (
  <div className="m-auto flex max-w-sm flex-col items-center gap-2 p-6 text-center">
    <FileX className="size-8 text-muted-foreground" />
    <p className="font-medium">{title}</p>
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
)
