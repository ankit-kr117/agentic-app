CheckPoint — Shared AI Agent Instructions

1. Project Overview

CheckPoint is a project workspace for managing projects, collaborating with teammates, tracking progress, and documenting the development journey.

The developer is a beginner. Keep explanations simple, practical, and beginner-friendly.

Important: Planned features are not necessarily implemented. Always inspect the existing repository before making assumptions.

2. Product Vision

CheckPoint aims to provide:

- A dashboard for projects and recent activity.
- Project creation, editing, organization, and search.
- A task board with To Do, In Progress, and Done statuses.
- Task assignment, teammate collaboration, and comments.
- Project notes, resources, useful links, and an idea inbox.
- Work sessions with a timer and progress checkpoints.
- Project timelines, milestones, and weekly progress recaps.
- Post Studio for turning project progress into editable social media posts.
- Post templates, previews, drafts, and PNG export.

Keep the MVP realistic. Do not build every feature at once.

Do not build an in-browser code editor in the MVP.

3. Proposed Technology Stack

The proposed stack is:

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend, database, and authentication: Supabase
- Version control: Git + GitHub

These are proposed technologies, not permission to replace an existing working stack.

Before making architectural decisions:

1. Inspect the current repository.
2. Identify existing dependencies and working features.
3. Explain any proposed major changes.
4. Wait for user approval before making major changes.

Do not introduce paid APIs, paid services, or mandatory AI API keys without explicit approval. The core application must not depend on a paid AI API.

4. Design Direction

The interface should feel cinematic, modern, polished, and practical.

Follow these principles:

- Consistent typography, spacing, colors, and reusable components.
- Responsive layouts for desktop and mobile.
- Smooth but restrained animations.
- Clear navigation and visual hierarchy.
- Useful loading, empty, error, and success states.
- Accessible contrast and keyboard usability.
- No unnecessary visual clutter or overly complicated interactions.

Preserve the existing design system unless a change is approved.

5. Non-Negotiable Development Rules

1. Inspect existing files before editing.
1. Work only on the currently approved phase.
1. Complete and verify the current phase before proposing the next.
1. Never begin the next phase without explicit user approval.
1. Make small, focused changes.
1. Do not rewrite unrelated code or add unrequested features.
1. Explain important commands before asking the beginner to run them.
1. Do not add dependencies without explaining why they are needed.
1. Never claim that a test, build, or feature works unless it has actually been verified.
1. Report errors honestly instead of hiding them.
1. Never hardcode credentials or expose secrets.
1. Never commit ".env" files containing real secrets.
1. Ask before destructive actions, breaking database changes, paid services, or public deployment.
1. Preserve changes made by the user and other agents.
1. If uncertain, inspect and ask instead of guessing.

1. Multi-Agent Collaboration Rules

This project may use Claude, Codex, and OpenCode.

All agents must follow this file and the currently approved project plan.

Ownership

- Every implementation task must have one clearly identified owner.
- Do not let multiple agents edit the same files simultaneously.
- While the developer is learning, prefer one implementation agent at a time.
- Other agents may review code, inspect architecture, suggest tests, or review diffs without editing the same files.

Coordination

- Before starting work, check the current phase and task.
- Check Git status and inspect existing changes.
- Read the relevant task instructions and acceptance criteria.
- Do not assume another agent's changes are finished or correct without inspecting them.
- For future parallel work, use separate Git branches and review changes before merging.
- Do not commit, push, merge, or deploy without user approval.

Important: GitHub does not automatically coordinate AI agents. Agents must share repository state or exchange changes through reviewed Git branches and commits.

7. Backend, Authentication, and Data Safety

Real collaboration across users and devices requires a backend, authentication, persistent data storage, and proper authorization.

- "localStorage" is acceptable for local preferences or a clearly labelled prototype.
- Do not present local-only storage as real multi-user synchronization.
- Do not rely on frontend-only permission checks to protect private data.
- Enforce authorization in the backend or database.
- If Supabase is approved, plan the database schema, relationships, membership roles, and Row Level Security policies.
- Never expose service-role keys or other privileged credentials in frontend code.
- Use environment variables for configuration and provide an ".env.example" without real secrets.
- Work-session tracking must be transparent and controlled by the user.
- Do not implement hidden surveillance or claim that a timer proves actual work occurred.

8. Development Roadmap

The roadmap is provisional. Adjust it only after repository inspection and user approval.

Phase 00 — Repository Inspection and Planning

- Inspect repository structure, stack, Git status, and documentation.
- Identify existing features and incomplete work.
- Confirm the MVP scope.
- Propose architecture and folder structure.
- Define agent roles, coding rules, tasks, and acceptance criteria.
- Prepare the project plan.

Gate: The user approves the plan before feature implementation begins.

Phase 01 — UI Foundation

- Establish the approved design system.
- Build the shared layout and navigation.
- Create dashboard and project screens.
- Use clearly labelled mock data where necessary.
- Check desktop and mobile layouts.

Acceptance criteria: The application starts successfully, navigation works, the main screens render, and responsive behavior has been checked.

Phase 02 — Backend and Authentication

- Configure the approved backend.
- Set up authentication and the minimum required data model.
- Configure environment variables.
- Implement and review database authorization policies.

Acceptance criteria: Authentication flows work, database access is tested, and authorization policies are reviewed.

Phase 03 — Projects and Persistence

- Implement approved project CRUD operations.
- Add project metadata, links, tags, and search as scoped.

Acceptance criteria: Project data persists correctly and access permissions are verified.

Phase 04 — Tasks and Team Collaboration

- Implement task statuses, assignments, comments, and project memberships.
- Add invitations and real-time updates if approved and needed.

Acceptance criteria: Task workflows and multi-user permissions are tested.

Phase 05 — Work Sessions and Journal

- Implement approved timer controls.
- Save work sessions and associate them with projects or tasks.
- Add progress checkpoints.

Acceptance criteria: Timer behavior, saved sessions, and relevant edge cases are tested.

Phase 06 — Project Organization

- Add approved timelines, milestones, ideas, resources, and recaps.

Acceptance criteria: Data persistence, filters, and empty states work correctly.

Phase 07 — Post Studio

- Create editable social post templates using project information.
- Add previews and drafts.
- Implement PNG export if approved.

Acceptance criteria: Editing, preview, and export are tested without requiring a paid AI API.

Phase 08 — Quality and Release

- Run available tests, lint checks, type checks, and production builds.
- Review permissions and error handling.
- Test responsive layouts and loading states.
- Prepare setup documentation and deployment instructions.

Acceptance criteria: Report exactly what passed, failed, and remains unverified. Public deployment requires user approval.

9. Task Execution Protocol

For every task, follow these steps:

Step 1 — Understand

Inspect the relevant files and explain the goal.

Step 2 — Plan

List the intended changes and the files likely to be affected.

Step 3 — Implement

Make only the changes required for the approved task.

Step 4 — Verify

Run relevant tests, lint checks, type checks, or builds when available.

Step 5 — Report

Summarize changed files, commands executed, results, and remaining issues.

Step 6 — Stop at the Gate

Ask for approval before starting the next phase.

Code generation alone does not mean a task is complete.

10. Git Safety

Before editing, check:

git status

Before reporting or committing changes, inspect:

git diff
git status

Never run destructive commands such as "git reset --hard", delete user files, rewrite Git history, or force-push without explicit permission.

Never assume the working tree is clean.

11. Current Priority

Current phase: Phase 00 — Repository Inspection and Planning.

The immediate task is to:

1. Report the current technology stack and repository structure.
2. Identify what already works and what is incomplete.
3. Identify existing instructions and documentation that must be preserved.
4. Recommend a realistic MVP and architecture.
5. Propose Phase 01 tasks with testable acceptance criteria.

Do not modify files or implement features until the user explicitly approves the plan.

12. Required Final Report

After completing any task, report:

- Done: What changed.
- Files: Which files changed.
- Checks: Commands actually run and their results.
- Issues: Anything failing or unverified.
- Next step: The proposed next action.

Keep reports concise, accurate, and beginner-friendly.
