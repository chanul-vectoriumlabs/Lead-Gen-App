# JobPilot – AI-Powered Job Intelligence & Recruitment Platform

JobPilot is an AI-powered job intelligence and recruitment platform designed to simplify the hiring process and improve the job search experience.

The platform includes a public-facing website, a candidate dashboard, and an administrative panel, bringing job discovery, candidate management, and recruitment workflows together in one place.

## 🚀 Live Demo

The application is deployed on Vercel and available at the following URLs:

| Application | Live URL |
|---|---|
| Public Website | https://job-pilot-one-mu.vercel.app/ |
| Candidate Area | https://job-pilot-one-mu.vercel.app/login |
| Admin Panel | https://job-pilot-one-mu.vercel.app/admin |
| Admin Login | https://job-pilot-one-mu.vercel.app/admin/login |

## ✨ Key Features

- **Public Website:** Explore the platform and discover its recruitment capabilities.
- **Candidate Dashboard:** Access candidate profiles, job opportunities, applications, and related activities.
- **Admin Panel:** Manage candidates, jobs, recruitment activities, and platform data.
- **Job Intelligence:** Interactive job discovery and recruitment-focused experiences.
- **Interactive Demo:** Explore the platform through simulated workflows and sample data.

## 🛠️ Technology Stack

The project is built using modern web technologies:

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework |
| React 19 | UI development |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui | UI components |
| Vercel | Deployment and hosting |

## 📁 Project Structure

```text
jobpilot/
├── app/                  # Next.js application routes
│   ├── admin/            # Admin panel
│   ├── dashboard/        # Candidate dashboard
│   ├── login/            # Candidate login
│   └── ...
├── components/           # Reusable UI components
├── lib/                  # Mock data and application utilities
├── public/               # Static assets
├── CLAUDE.md             # Project development guidelines
├── package.json
└── README.md
```

## 💻 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20.9 or later
- npm

### Installation

1. Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

2. Navigate to the project directory:

```bash
cd jobpilot
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit:

```text
http://localhost:3000
```

## 🧪 Demo Environment

**Current implementation: UI demonstration only.**

The application currently operates without a connected backend.

- Sample application data is maintained in the `lib/` directory.
- Mock data is available in files such as `lib/mock-data.ts` and `lib/candidate-detail.ts`.
- User interactions, including uploaded CVs, selected jobs, application statuses, and requests, are stored in browser local storage.
- Search operations, recruiter lookups, email interactions, and document generation are simulated.
- Local storage data is specific to the browser being used and is not synchronized across devices.

## 🌐 Deployment

The application is deployed using Vercel.

### Deploy Your Own Instance

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com/).
3. Select **Add New → Project**.
4. Import the JobPilot repository.
5. Select the detected Next.js framework settings.
6. Keep the default build configuration:
   - Framework: Next.js
   - Build Command: `next build`
   - Output Directory: Automatically managed by Vercel.
7. Click **Deploy**.

No additional environment variables or deployment configurations are currently required.

### Production Build

To verify the application locally before deployment:

```bash
npm run build
npm start
```

## 📋 Development Guidelines

Please refer to `CLAUDE.md` for the project's development conventions.

Key guidelines include:

- Use shadcn/ui components for UI development.
- Preserve the existing application theme and design system.
- Use arrow functions.
- Use Tailwind CSS utility classes for styling.
- Maintain consistency with the existing component structure.

## 🔮 Future Improvements

Potential areas for further development include:

- Backend API integration.
- Database integration and persistent data storage.
- AI-powered job matching and recommendations.
- Real recruiter and candidate communication workflows.
- Authentication and role-based access control.
- Real-time recruitment analytics and reporting.

## 📄 License

No license has currently been specified. All rights are reserved unless a license is added to this repository.

---

**JobPilot** – Making job discovery and recruitment smarter.