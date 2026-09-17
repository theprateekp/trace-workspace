# Trace

Trace is a focused collaborative workspace for teams that manage complex workflows. It brings project execution, meeting context, files, documents, and operational signals into one calm surface.

## What is included

The current product shell includes a multi-project workspace with an overview dashboard, a drag-and-drop Kanban board, a task detail drawer, calendar planning, a meeting room concept, a shared file library, quick slide editing, and analytics views.

The UI is designed around a consistent loop: a decision becomes a task, the task carries its files and comments, and the meeting or project history remains searchable instead of disappearing into separate tools.

### Core workflows

- **Overview:** team pulse, open work, recent activity, project progress, and calendar preview.
- **Projects:** four-column Kanban board with drag-and-drop status changes, task creation, filtering, priorities, labels, subtasks, attachments, comments, assignees, and linked context.
- **Task drawer:** editable task title, status, priority, assignee, subtasks, linked files, pull requests, attachments, and comments.
- **Calendar:** month planning with shared events, milestones, focus blocks, and an agenda for the selected day.
- **Meetings:** huddle room with participant tiles, microphone and camera controls, screen-share and recording affordances, live captions, chat, meeting notes, and recent recordings.
- **Files & docs:** project library, starred/recent views, shared avatars, file metadata, version history affordance, and a lightweight editable slide surface.
- **Analytics:** delivery velocity, cycle-time distribution, insights, and portfolio health.

## Product direction

Trace is intentionally opinionated about the gaps that appear when task tools, meeting tools, and file tools are separated. It prioritizes decision capture, context carry-over, low-noise follow-up, visible ownership, and a clear record of changes.

The meeting room in this repository is a product-ready interaction surface for a real-time provider integration. Production media transport, recording storage, transcription, calendar sync, and collaborative document conflict resolution should be wired to the team's chosen infrastructure before shipping to customers. The full-stack scaffold already includes the server, database, storage, and authentication foundations needed for that next phase.

## Design system

Trace uses a light workspace canvas with cool gray surfaces, sky blue navigation and data accents, bright coral for action and urgency, and restrained purple and green status cues. Typography combines DM Sans for readable UI copy with Space Grotesk for compact, editorial headings. Interactions use short transitions and honor reduced-motion preferences.

## Run locally

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm check
pnpm test
pnpm build
```

## Project structure

```text
client/src/pages/Home.tsx     Main Trace workspace and interactive views
client/src/index.css          Trace visual system and responsive layout
client/src/App.tsx            App shell and routing
server/                       tRPC server and authentication foundation
drizzle/                      Database schema and migrations
```

## Verification

The repository includes the scaffold authentication test and a Trace router smoke test. The project has been checked with TypeScript, Vitest, and the production build.

## License

MIT
