# AI Agents & Assistants Guidelines

## Project Context

This is an app called Venta - a management platform for small and mid-size businesses. It consists of 2 parts. The Admin Portal and the Employee Portal.

### Feature Breakdown

#### Admin Portal

After a successful sign up, the user goes through the Onboarding flow where they set up their first store, store branches, designations, and employees. After a successful sign in, the admins can manage their store, employees, products, inventory, orders, sales, employee timesheet, employee attendance-related requests, and view an insightful dashboard.

#### Employee Portal

After a successful sign in using their username, a page where an employee can clock in/out is displayed. Employees can also view their attendance logs here. They also can make requests to admin such as a request to clock them out if they forgot to clock out. This is also the portal where employees on duty can fill in things like expenses today, cash-on-hand, and orders so that the "daily sales" (hence, Venta) can be realized for that business day.

## Tech Stack

- React
- TypeScript
- TanStack Start
- shandcn/ui with base-ui
- TailwindCSS
- Prisma
- Postgresql

## Lint, Format, and Type-checking Commands

Always run these commands after working on a feature or doing changes:

Lint: `pnpm run lint --fix`
Format: `pnpm run format`
Type-check: `pnpm run typecheck`

## DB-related Commands

Run these commands if necessary but make sure the action is confirmed first by the developer:

Seed the database: `pnpm run db:seed`
Execute migrations: `pnpm run db:migrate`
Generate Prisma client: `pnpm run db:generate`
