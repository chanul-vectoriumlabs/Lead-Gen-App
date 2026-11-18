"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  DollarSign,
  FileSignature,
  FileText,
  Globe,
  History,
  LayoutList,
  Loader2,
  Lock,
  MapPin,
  PenLine,
  RotateCw,
  Search,
  Send,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

import { CandidateCell } from "@/components/admin/candidate-cell";
import { ProfileCv } from "@/components/admin/candidate-detail";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCv } from "@/components/user/cv-store";
import { CvViewer } from "@/components/user/cv-viewer";
import {
  DocumentEditor,
  type LetterDoc,
  type ResumeDoc,
} from "@/components/user/document-editor";
import {
  getMatchDetail,
  type MatchDetail as MatchDetailData,
} from "@/lib/candidate-detail";
import { candidateList } from "@/lib/mock-data";
import { useSelectedJobs } from "@/lib/selection-store";
import { markRecruitersFound, useRecruiterStatuses } from "@/lib/recruiters-store";
import { markApplied, useAppliedVia } from "@/lib/applied-store";
import {
  JOB_STATUSES,
  setJobStatus,
  statusTone,
  useJobStatuses,
  type JobStatus,
} from "@/lib/job-status-store";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_CANDIDATE_ID } from "@/lib/top-jobs-store";
import { cn } from "@/lib/utils";

const initials = (s: string) =>
  s
    .split(" ")
    .map((p) => p[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();

const Fact = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium">{title}</p>
    <ul className="space-y-1.5 text-sm text-muted-foreground">
      {items.map((x) => (
        <li key={x} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          {x}
        </li>
      ))}
    </ul>
  </div>
);

// Placeholder draft. Replace with the Application Agent's tailored cover letter.
const draftCoverLetter = (m: MatchDetailData, r?: Recruiter): LetterDoc => {
  const c = m.candidate;
  const first = c.name.split(" ")[0];
  return {
    sender: `${c.name}\n${m.detail.email}  ·  ${m.detail.phone}\n${c.location}`,
    date: new Date().toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    recipient: r ? `${r.name}\n${r.role}\n${m.match.company}` : `Hiring Team\n${m.match.company}`,
    greeting: r ? `Dear ${r.name.split(" ")[0]},` : `Dear ${m.match.company} hiring team,`,
    paragraphs: [
      `I'm writing to apply for the ${m.match.title} role at ${m.match.company}. With ${m.detail.profile.years} years of experience as a ${c.title.toLowerCase()}, I'd welcome the chance to bring my skills to your team.`,
      `My work with ${m.matched.slice(0, 3).join(", ")} lines up closely with what you're looking for. ${m.detail.profile.experience[0] ? `In my current role at ${m.detail.profile.experience[0].company}, I` : "I"} take ownership of my work end to end and partner closely with the people around me.`,
      `${m.match.company}'s focus on quality and delivery is what draws me to this role. I'd be glad to talk about how I could help. Thank you for your time and consideration.`,
    ],
    closing: "Kind regards,",
    signature: c.name.replace(/\.$/, "") || first,
  };
};

type Recruiter = MatchDetailData["recruiters"][number];

const RecruitersCard = ({
  m,
  found,
  notFound,
  searching,
  onFind,
  appliedVia,
  onApply,
  recruiters,
  letters,
  setLetter,
  creatingLetter,
  onCreateLetter,
  onFindMore,
  findingMore,
  noMore,
}: {
  m: MatchDetailData;
  found: boolean;
  /** The last search couldn't find anyone. */
  notFound: boolean;
  searching: boolean;
  onFind: () => void;
  /** Contacts found so far, including any from Find more recruiters. */
  recruiters: Recruiter[];
  /** Cover letter written for each recruiter. */
  letters: Record<string, LetterDoc>;
  setLetter: (recruiterId: string, l: LetterDoc) => void;
  /** The recruiter a cover letter is being written for. */
  creatingLetter: string | null;
  onCreateLetter: (r: Recruiter) => void;
  onFindMore: () => void;
  findingMore: boolean;
  /** The last Find more recruiters run turned up nobody new. */
  noMore: boolean;
  /** The recruiter the application was sent to (null = not applied yet). */
  appliedVia: string | null;
  onApply: (r: Recruiter) => void;
}) => {
  const appliedTo = recruiters.find((r) => r.id === appliedVia);
  return (
  <Card className="border border-border">
    <CardHeader>
      <CardTitle className="text-base">Recruiters for this job</CardTitle>
      <CardDescription>
        Hiring contacts at {m.match.company} found by the Recruiter Research
        Agent. Check before reaching out.
      </CardDescription>
      {found && (
        <CardAction>
          <Button
            variant="outline"
            className="cursor-pointer bg-background"
            disabled={findingMore || noMore}
            onClick={onFindMore}
          >
            {findingMore ? <Loader2 className="animate-spin" /> : <Search />}
            {findingMore
              ? "Searching..."
              : noMore
                ? "No more recruiters found"
                : "Find more recruiters"}
          </Button>
        </CardAction>
      )}
    </CardHeader>
    <CardContent>
      {!found ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
          {searching ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <Users className="size-8 text-muted-foreground" />
          )}
          <div className="space-y-1">
            <p className="font-medium">
              {searching
                ? `Searching ${m.match.company}...`
                : notFound
                  ? "Couldn't find recruiters"
                  : "No recruiters found yet"}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              {searching
                ? "Checking the company careers page and public profiles for hiring contacts."
                : notFound
                  ? `The last search found no hiring contacts at ${m.match.company}. Search again to try more sources.`
                  : `Find the people hiring for ${m.match.title} at ${m.match.company}.`}
            </p>
          </div>
          <Button className="cursor-pointer" disabled={searching} onClick={onFind}>
            {searching ? <Loader2 className="animate-spin" /> : <Search />}
            {searching ? "Finding recruiters..." : notFound ? "Find recruiters again" : "Find recruiters"}
          </Button>
        </div>
      ) : recruiters.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Users className="size-8 text-muted-foreground" />
          <p className="font-medium">No recruiters found for this job</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {["Contact", "Email", "LinkedIn", "Source", "Found", "Cover letter", ""].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="h-10 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recruiters.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="py-3">
                    <CandidateCell name={r.name} subtitle={r.role} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm">
                        {r.emailStatus === "Not found" ? "Not found" : r.email}
                      </span>
                      <Badge
                        variant={
                          r.emailStatus === "Verified" ? "secondary" : "outline"
                        }
                        className={cn(
                          r.emailStatus === "Verified" && "gap-1 text-primary",
                        )}
                      >
                        {r.emailStatus === "Verified" && (
                          <CheckCircle2 className="size-3" />
                        )}
                        {r.emailStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.linkedin}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.source}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.found}
                  </TableCell>
                  <TableCell>
                    {letters[r.id] ? (
                      <DocumentEditor
                        compact
                        // Sent with the application, so it can't change any more.
                        readOnly={r.id === appliedVia}
                        kind="letter"
                        value={letters[r.id]}
                        onSave={(l) => setLetter(r.id, l)}
                        icon={FileSignature}
                        title="Cover letter"
                        description={`For ${r.name} at ${m.match.company}`}
                        fileName={`${m.candidate.name.split(" ")[0]}_Cover_Letter_${m.match.company.replace(/\s+/g, "")}.pdf`}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer bg-background"
                        disabled={creatingLetter === r.id || (!!appliedVia && r.id !== appliedVia)}
                        onClick={() => onCreateLetter(r)}
                      >
                        {creatingLetter === r.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Sparkles />
                        )}
                        {creatingLetter === r.id ? "Writing..." : "Create"}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.id === appliedVia ? (
                      <Badge variant="secondary" className="gap-1 text-primary">
                        <CheckCircle2 className="size-3" /> Applied
                      </Badge>
                    ) : appliedVia || r.emailStatus === "Not found" || !letters[r.id] ? (
                      // One application per job, so the other contacts are blocked once it's sent.
                      <Tooltip>
                        <TooltipTrigger render={<span tabIndex={0} />}>
                          <Button size="sm" disabled>
                            <Lock /> Apply
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {appliedVia
                            ? `Already applied through ${appliedTo?.name ?? "another recruiter"}`
                            : r.emailStatus === "Not found"
                              ? "No email found for this contact"
                              : "Create a cover letter for this recruiter first"}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => onApply(r)}
                      >
                        <Send /> Apply
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
  );
};

// Placeholder draft. Replace with the Application Agent's tailored resume.
const draftTailoredCv = (m: MatchDetailData): ResumeDoc => {
  const c = m.candidate;
  const d = m.detail;
  return {
    name: c.name,
    contact: `${d.email}  ·  ${d.phone}  ·  ${c.location}`,
    links: [{ label: "LinkedIn", url: d.linkedin }],
    headline: m.match.title,
    summary: `${d.profile.level} ${c.title.toLowerCase()} with ${d.profile.years} years of experience. Strong in ${m.matched.slice(0, 3).join(", ")}, which ${m.match.company} lists for this role.`,
    experience: d.profile.experience.map((x, i) => ({
      role: x.role,
      company: x.company,
      dates: x.years,
      bullets:
        i === 0
          ? [
              `Delivered work using ${m.matched.slice(0, 2).join(" and ")} across core projects.`,
              "Partnered with product and engineering to plan and ship on time.",
            ]
          : [
              "Built and maintained day-to-day work for the team.",
              `Used ${m.matched[2] ?? d.profile.skills[0]} to improve quality and speed.`,
            ],
    })),
    skills: [
      ...m.matched,
      ...d.profile.skills.filter((s) => !m.matched.includes(s)),
    ].join("  ·  "),
    education: d.profile.education,
  };
};

const useOriginalCv = (m: MatchDetailData) => {
  const uploaded = useCv();
  const isDemoUser = m.candidate.id === DEMO_CANDIDATE_ID;
  const original =
    isDemoUser && uploaded
      ? uploaded
      : { name: `${m.candidate.name.split(" ")[0]}_CV.pdf` };
  return { original, isDemoUser };
};

/** The CV tab: the candidate's CV, and tailoring a version to this job. */
const CvCard = ({
  m,
  cv,
  setCv,
}: {
  m: MatchDetailData;
  cv: ResumeDoc | null;
  setCv: (c: ResumeDoc) => void;
}) => {
  const { original, isDemoUser } = useOriginalCv(m);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    // Demo only: simulates the Application Agent tailoring the CV.
    setTimeout(() => {
      setCv(draftTailoredCv(m));
      setGenerating(false);
    }, 1200);
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4 text-primary" /> CV
        </CardTitle>
        <CardDescription>
          The candidate&apos;s CV, and a version tailored to this job. Choose
          which one to send when applying.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/40 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{original.name}</p>
            <p className="text-xs text-muted-foreground">Original CV</p>
          </div>
          <CvViewer
            cv={original}
            loadFile={isDemoUser}
            fallback={<ProfileCv candidate={m.candidate} detail={m.detail} />}
          />
        </div>
        {cv ? (
          <>
            <DocumentEditor
              kind="resume"
              value={cv}
              onSave={setCv}
              icon={Sparkles}
              title="Tailored CV"
              description={`Reordered for ${m.match.title} at ${m.match.company}`}
              fileName={`${m.candidate.name.split(" ")[0]}_CV_${m.match.company.replace(/\s+/g, "")}.pdf`}
            />
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              disabled={generating}
              onClick={generate}
            >
              {generating ? <Loader2 className="animate-spin" /> : <RotateCw />}{" "}
              Regenerate
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No tailored CV yet for this job.
            </p>
            <Button
              className="cursor-pointer"
              disabled={generating}
              onClick={generate}
            >
              {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {generating ? "Tailoring..." : "Tailor CV for this job"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type CvChoice = "original" | "tailored";

/** In the Apply window: pick the original or the tailored CV to send. */
const CvPicker = ({
  m,
  hasTailored,
  use,
  setUse,
}: {
  m: MatchDetailData;
  hasTailored: boolean;
  use: CvChoice;
  setUse: (c: CvChoice) => void;
}) => {
  const { original } = useOriginalCv(m);
  const options: {
    value: CvChoice;
    icon: LucideIcon;
    name: string;
    note: string;
  }[] = [
    { value: "original", icon: FileText, name: original.name, note: "Original CV" },
    ...(hasTailored
      ? [
          {
            value: "tailored" as const,
            icon: Sparkles,
            name: "Tailored CV",
            note: `For ${m.match.title} at ${m.match.company}`,
          },
        ]
      : []),
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">CV to send</p>
      <RadioGroup
        value={use}
        onValueChange={(v) => setUse(v as CvChoice)}
        className="gap-3"
      >
        {options.map((o) => (
          <Label
            key={o.value}
            htmlFor={`cv-${o.value}`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-4",
              use === o.value ? "border-primary bg-primary/5" : "bg-muted/40",
            )}
          >
            <RadioGroupItem id={`cv-${o.value}`} value={o.value} />
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <o.icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{o.name}</span>
              <span className="block text-xs font-normal text-muted-foreground">
                {o.note}
              </span>
            </span>
          </Label>
        ))}
      </RadioGroup>
      {!hasTailored && (
        <p className="text-xs text-muted-foreground">
          To send a CV tailored to this job, create one in the CV tab first.
        </p>
      )}
    </div>
  );
};

/** Applies to the job through one recruiter: check the CV and cover letter, then send. */
const ApplyDialog = ({
  m,
  recruiter,
  onClose,
  hasTailored,
  onSent,
}: {
  m: MatchDetailData;
  /** The recruiter to send the application to; null closes the window. */
  recruiter: Recruiter | null;
  onClose: () => void;
  /** A tailored CV has been made in the CV tab. */
  hasTailored: boolean;
  onSent: (r: Recruiter, cvLabel: string) => void;
}) => {
  const [step, setStep] = useState<"review" | "sending" | "sent">("review");
  // The tailored CV by default when there is one, otherwise the original.
  const [cvPick, setCvPick] = useState<CvChoice | null>(null);
  const use: CvChoice = hasTailored ? (cvPick ?? "tailored") : "original";
  const cvLabel = use === "tailored" ? "tailored CV" : "original CV";

  const send = () => {
    if (!recruiter) return;
    setStep("sending");
    // Demo only: simulates the Application Agent sending the application.
    setTimeout(() => {
      onSent(recruiter, cvLabel);
      setStep("sent");
    }, 1500);
  };

  const close = () => {
    onClose();
    setStep("review");
  };

  return (
    <Dialog
      open={!!recruiter}
      onOpenChange={(o) => !o && step !== "sending" && close()}
    >
      <DialogContent
        showCloseButton={step !== "sending"}
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
      >
        {step === "sent" && recruiter ? (
          <>
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-7" />
              </span>
              <DialogTitle>Application sent</DialogTitle>
              <DialogDescription className="max-w-md">
                The {cvLabel} and cover letter were sent to {recruiter.name} (
                {recruiter.email}) for {m.match.title} at {m.match.company}. The
                job is now marked as Applied.
              </DialogDescription>
            </div>
            <DialogFooter>
              <Button className="cursor-pointer" onClick={close}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Apply to {m.match.title} at {m.match.company}
              </DialogTitle>
              <DialogDescription>
                Choose the CV to send to {recruiter?.name} ({recruiter?.role})
                at {recruiter?.email}, with the cover letter written for them. A
                job is applied to through one recruiter only.
              </DialogDescription>
            </DialogHeader>
            <CvPicker
              m={m}
              hasTailored={hasTailored}
              use={use}
              setUse={setCvPick}
            />
            <DialogFooter className="items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                The {cvLabel} and cover letter will be attached.
              </p>
              <div className="flex gap-2">
                <DialogClose
                  render={<Button variant="outline" className="cursor-pointer" />}
                  disabled={step === "sending"}
                >
                  Cancel
                </DialogClose>
                <Button
                  className="cursor-pointer"
                  disabled={step === "sending"}
                  onClick={send}
                >
                  {step === "sending" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                  {step === "sending" ? "Sending..." : "Send application"}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

type Activity = {
  id: number;
  icon: LucideIcon;
  text: string;
  /** Who did it: an agent or the admin. */
  by: "Agent" | "You";
  when: string;
};

/** Everything that has happened on this job, newest first. */
const ActivityCard = ({ items }: { items: Activity[] }) => (
  <Card className="border border-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <History className="size-4 text-primary" /> Activity history
      </CardTitle>
      <CardDescription>
        Every step taken on this job by the agents and by you, newest first.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ol className="space-y-4">
        {items.map((a, i) => (
          <li key={a.id} className="relative flex gap-3">
            {i < items.length - 1 && (
              <span className="absolute top-9 bottom-[-1rem] left-4 w-px bg-border" />
            )}
            <span
              className={cn(
                "relative flex size-8 shrink-0 items-center justify-center rounded-full",
                a.by === "You"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              <a.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm">{a.text}</p>
              <p className="text-xs text-muted-foreground">
                {a.by === "You" ? "You" : "Agent"} &middot; {a.when}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </CardContent>
  </Card>
);

/** A ranked job for one candidate: the posting and how well it fits them. */
export const MatchDetail = () => {
  const { id, jobId } = useParams<{ id: string; jobId: string }>();
  const candidate = candidateList.find((c) => c.id === id);
  const m = candidate
    ? getMatchDetail(candidate, decodeURIComponent(jobId))
    : null;
  const selectedIds = useSelectedJobs(
    id,
    m
      ? m.detail.matches.filter((x) => x.status === "Selected").map((x) => x.id)
      : [],
  );
  const statuses = useJobStatuses(m ? [m.match.id] : []);
  const recruiterStatus = useRecruiterStatuses()[m?.match.id ?? ""];
  const recruitersFound = recruiterStatus === "found";
  const [findingRecruiters, setFindingRecruiters] = useState(false);
  // How many extra contacts Find more recruiters has turned up (demo: two per run).
  const [extraCount, setExtraCount] = useState(0);
  const [findingMore, setFindingMore] = useState(false);
  const [noMore, setNoMore] = useState(false);
  // Drafts for this job, kept while the page is open.
  const [cv, setCv] = useState<ResumeDoc | null>(null);
  // One cover letter per recruiter, addressed to them.
  const [letters, setLetters] = useState<Record<string, LetterDoc>>({});
  const [creatingLetter, setCreatingLetter] = useState<string | null>(null);
  const setLetterFor = (recruiterId: string, l: LetterDoc) =>
    setLetters((all) => ({ ...all, [recruiterId]: l }));
  // The recruiter being applied to (null = window closed), and the one already applied through.
  const [applyTo, setApplyTo] = useState<Recruiter | null>(null);
  const appliedVia = useAppliedVia(m?.match.id ?? "");
  // Steps taken while this page is open. Placeholder: comes from the activity log API.
  const [log, setLog] = useState<Activity[]>([]);
  // Steps done on this visit are in the log, so they aren't repeated as "Earlier".
  const [doneNow, setDoneNow] = useState({ found: false, applied: false });
  const addLog = (icon: LucideIcon, text: string, by: Activity["by"] = "You") =>
    setLog((l) => [
      {
        id: Date.now() + Math.random(),
        icon,
        text,
        by,
        when: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...l,
    ]);
  const updateCv = (c: ResumeDoc) => {
    addLog(Sparkles, cv ? "Tailored CV updated" : "Tailored CV created", cv ? "You" : "Agent");
    setCv(c);
  };

  // Only jobs selected for the candidate can be viewed.
  if (candidate && m && !selectedIds.includes(m.match.id)) {
    return (
      <Card className="border border-border">
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <Lock className="size-8 text-muted-foreground" />
          <p className="font-heading text-lg font-semibold">
            This job isn&apos;t selected
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Only jobs selected for {candidate.name} can be viewed. Select it in
            the candidate&apos;s Select step first.
          </p>
          <Button
            className="cursor-pointer"
            nativeButton={false}
            render={<Link href={`/admin/candidates/${candidate.id}`} />}
          >
            Back to {candidate.name}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!candidate || !m) {
    return (
      <Card className="border border-border">
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="font-heading text-lg font-semibold">Job not found</p>
          <Button
            nativeButton={false}
            render={
              <Link
                href={
                  candidate
                    ? `/admin/candidates/${candidate.id}`
                    : "/admin/candidates"
                }
              />
            }
          >
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { match: job } = m;
  const recruiters = [...m.recruiters, ...m.moreRecruiters.slice(0, extraCount)];
  const status = statuses[job.id];
  const appliedTo = recruiters.find((r) => r.id === appliedVia);
  // Earlier steps, from before this page was opened (oldest last).
  const history: Activity[] = [
    ...log,
    ...(appliedVia && !doneNow.applied
      ? [
          {
            id: -1,
            icon: Send,
            text: `Application sent to ${appliedTo?.name ?? "a recruiter"}`,
            by: "You" as const,
            when: "Earlier",
          },
        ]
      : []),
    ...(recruitersFound && !doneNow.found
      ? [
          {
            id: -2,
            icon: Users,
            text: `Recruiter Research Agent found ${m.recruiters.length} recruiters at ${job.company}`,
            by: "Agent" as const,
            when: "Earlier",
          },
        ]
      : []),
    {
      id: -3,
      icon: CheckCircle2,
      text: `Selected for ${candidate.name} to pursue`,
      by: "You",
      when: "Earlier",
    },
    {
      id: -4,
      icon: Trophy,
      text: `Ranked #${m.rank} with a match score of ${job.score}`,
      by: "Agent",
      when: "Earlier",
    },
    {
      id: -5,
      icon: Globe,
      text: `Job found on ${m.source}`,
      by: "Agent",
      when: m.posted,
    },
  ];

  return (
    <>
      {/* Header */}
      <Card className="border border-border">
        <CardContent className="flex flex-wrap items-start gap-5">
          <Avatar className="size-16 rounded-xl">
            <AvatarFallback className="rounded-xl bg-primary/10 text-xl font-semibold text-primary">
              {initials(job.company)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-60 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                {job.title}
              </h1>
              {status && <Badge variant={statusTone(status)}>{status}</Badge>}
            </div>
            <p className="text-muted-foreground">
              {job.company} &middot; {m.location}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-status" className="text-xs text-muted-foreground">
              Application status
            </Label>
            <Select
              items={JOB_STATUSES.map((s) => ({ value: s, label: s }))}
              value={status ?? null}
              onValueChange={(v) => {
                setJobStatus(job.id, v as JobStatus);
                addLog(CircleDashed, `Application status changed to ${v}`);
              }}
            >
              <SelectTrigger id="job-status" className="h-10! w-52 cursor-pointer bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="p-1.5">
                {JOB_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="cursor-pointer rounded-md px-2.5 py-2">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-primary/5 px-4 py-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground">
              {job.score}
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Match score</p>
              <p className="text-sm font-medium">
                Ranked #{m.rank} for {candidate.name}
              </p>
            </div>
          </div>
          <div className="grid basis-full gap-x-8 gap-y-3 border-t pt-4 sm:grid-cols-2 xl:grid-cols-5">
            <Fact icon={Building2} label="Company" value={job.company} />
            <Fact icon={MapPin} label="Location" value={m.location} />
            <Fact
              icon={DollarSign}
              label="Salary"
              value={m.salary ?? "Not listed"}
            />
            <Fact icon={Globe} label="Source" value={m.source} />
            <Fact icon={CalendarDays} label="Posted" value={m.posted} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="gap-6">
        <TabsList
          variant="line"
          className="h-auto! w-full justify-start gap-1 overflow-x-auto rounded-none border-b p-0"
        >
          {(
            [
              ["overview", "Overview", LayoutList],
              ["recruiters", "Recruiters", Users],
              ["cv", "CV", FileText],
            ] as const
          ).map(([value, label, Icon]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-11 flex-none gap-2 rounded-none px-4 text-muted-foreground after:bg-primary hover:text-foreground data-active:text-primary group-data-horizontal/tabs:after:-bottom-px!"
            >
              <Icon className="size-4" /> {label}
              {value === "recruiters" && recruitersFound && (
                <Badge variant="secondary" className="h-5 px-1.5">
                  {recruiters.length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
            {/* Posting */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base">About the role</CardTitle>
                <CardDescription>{m.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
                <Separator />
                <List title="What you'll do" items={m.responsibilities} />
                <List title="What they're looking for" items={m.requirements} />
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Fit */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="size-4 text-primary" /> Fit for{" "}
                    {candidate.name}
                  </CardTitle>
                  <CardDescription>
                    How this job compares with the candidate&apos;s CV.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-sm">
                    <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
                    {job.reason}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Skills that match
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {m.matched.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1">
                          <CheckCircle2 className="size-3 text-primary" /> {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Missing from the CV
                    </p>
                    {m.missing.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nothing important is missing.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {m.missing.map((s) => (
                          <Badge
                            key={s}
                            variant="outline"
                            className="gap-1 text-muted-foreground"
                          >
                            <CircleDashed className="size-3" /> {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Recruiters */}
        <TabsContent value="recruiters" className="space-y-6">
          <RecruitersCard
            m={m}
            found={recruitersFound}
            notFound={recruiterStatus === "none"}
            searching={findingRecruiters || recruiterStatus === "searching"}
            appliedVia={appliedVia}
            onApply={setApplyTo}
            recruiters={recruiters}
            letters={letters}
            setLetter={(rid, l) => {
              setLetterFor(rid, l);
              const r = recruiters.find((x) => x.id === rid);
              addLog(PenLine, `Cover letter for ${r?.name ?? "a recruiter"} edited`);
            }}
            creatingLetter={creatingLetter}
            onCreateLetter={(r) => {
              setCreatingLetter(r.id);
              // Demo only: simulates the Application Agent drafting the letter.
              setTimeout(() => {
                setLetterFor(r.id, draftCoverLetter(m, r));
                setCreatingLetter(null);
                addLog(FileSignature, `Cover letter created for ${r.name}`, "Agent");
              }, 1200);
            }}
            findingMore={findingMore}
            noMore={noMore}
            onFindMore={() => {
              setFindingMore(true);
              // Demo only: simulates the Recruiter Research Agent searching again.
              setTimeout(() => {
                const found = m.moreRecruiters.slice(extraCount, extraCount + 2);
                if (found.length === 0) {
                  setNoMore(true);
                  addLog(Search, "Searched for more recruiters: no new contacts found", "Agent");
                } else {
                  setExtraCount(extraCount + found.length);
                  addLog(
                    Search,
                    `Found ${found.length} more ${found.length === 1 ? "recruiter" : "recruiters"}: ${found.map((x) => x.name).join(", ")}`,
                    "Agent",
                  );
                }
                setFindingMore(false);
              }, 1500);
            }}
            onFind={() => {
              setFindingRecruiters(true);
              // Demo only: simulates the Recruiter Research Agent.
              setTimeout(() => {
                markRecruitersFound(m.match.id);
                setFindingRecruiters(false);
                setDoneNow((d) => ({ ...d, found: true }));
                addLog(
                  Users,
                  `Recruiter Research Agent found ${m.recruiters.length} recruiters at ${m.match.company}`,
                  "Agent",
                );
              }, 1500);
            }}
          />
          <ActivityCard items={history} />
        </TabsContent>

        {/* CV */}
        <TabsContent value="cv">
          <div className="max-w-3xl">
            <CvCard m={m} cv={cv} setCv={updateCv} />
          </div>
        </TabsContent>
      </Tabs>

      <ApplyDialog
        m={m}
        recruiter={applyTo}
        onClose={() => setApplyTo(null)}
        hasTailored={!!cv}
        onSent={(r, cvLabel) => {
          markApplied(m.match.id, r.id);
          setDoneNow((d) => ({ ...d, applied: true }));
          setJobStatus(m.match.id, "Applied");
          addLog(Send, `Application sent to ${r.name} (${r.email}) with the ${cvLabel} and cover letter`);
        }}
      />
    </>
  );
};
