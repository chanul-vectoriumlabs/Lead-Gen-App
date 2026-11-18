export type FaqGroup = { category: string; items: { q: string; a: string }[] }

export const faqGroups: FaqGroup[] = [
  {
    category: "Getting started",
    items: [
      { q: "Is it free to start?", a: "Yes. Create an account, upload your CV and see your ranked matches." },
      { q: "What file types can I upload?", a: "PDF or Word (.pdf, .doc, .docx). Scanned CVs that cannot be read will show a clear message so you can upload another version." },
      { q: "What does the AI take from my CV?", a: "Only the facts stated in it: job titles, level, skills, years of experience, education and certifications. Anything the CV does not say is marked unknown for you to confirm." },
      { q: "Why do I need to confirm preferences?", a: "A CV states facts, not what you want next. You confirm target titles, locations, remote or onsite, expected salary and work authorization before any search runs." },
    ],
  },
  {
    category: "Jobs and matching",
    items: [
      { q: "Where do the jobs come from?", a: "From approved sources: published employer job boards, government job APIs and licensed job-data providers. Sites whose terms forbid automated access are not used." },
      { q: "How are jobs ranked?", a: "Each job is compared with your CV and given a 0-100 score with a short reason, for example “strong Python and AWS match; missing 5 years of management”. You see the top matches." },
      { q: "What happens to jobs with no salary listed?", a: "They are kept and flagged, not dropped, because many good postings omit salary." },
      { q: "Can I search again for newer jobs?", a: "Yes. Results come from saved open jobs first. You can run a fresh search on the platforms at any time." },
    ],
  },
  {
    category: "Applications and approval",
    items: [
      { q: "Will anything be sent without my permission?", a: "No. You approve the exact version of every resume and cover letter. If a document changes after approval, it needs your approval again." },
      { q: "Will the AI make things up on my resume?", a: "No. Documents are written only from facts stated in your CV. It never invents experience." },
      { q: "How are applications submitted?", a: "Where a platform offers a permitted integration, we submit through it. Otherwise you get a ready package with your documents and the official application link." },
      { q: "Can I apply to the same job twice by mistake?", a: "No. Duplicate applications to the same job are blocked automatically." },
    ],
  },
  {
    category: "Privacy and data",
    items: [
      { q: "How is my data protected?", a: "Data is encrypted in transit and at rest, access is role-based, and every action is logged." },
      { q: "Can I delete my data?", a: "Yes. You can request deletion of your account and data at any time." },
      { q: "Do you sell my information?", a: "No. Your CV and personal data are only used to find and prepare applications for you." },
    ],
  },
]
