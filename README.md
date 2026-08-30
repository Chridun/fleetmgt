# TrucksPulse

TrucksPulse is a cross-platform fleet management application for trucking
companies. It helps administrators manage trucks and staff, gives drivers and
helpers a simple way to record attendance and fuel usage, and provides the
organization with license, payroll, approval, and compliance visibility.

The application is built with React Native and Expo for iOS, Android, and web,
with an Express and PostgreSQL backend. It is designed for multiple
organizations with role-based access and organization-scoped data.

## Product capabilities

### Fleet and compliance

- Create, edit, view, and deactivate trucks.
- Store truck specifications, registration, insurance, license plates, and
  province information.
- Assign drivers and helpers to trucks, including multiple helpers.
- Track truck notes, permits, and CVSE safety inspection records.
- Track staff licenses and expiration dates.
- View upcoming reminders for expiring licenses, permits, registration, and
  insurance.

### Staff and organization management

- Create and manage trucking organizations and organization users.
- Manage drivers, helpers, trucker administrators, and finance users.
- Store staff profile and KYC information.
- Track employment status, wage amount, pay frequency, and wage history.
- Activate or deactivate users.
- Allow users to update their own profile and password.
- Route protected profile changes through an approval process where required.

### Attendance and payroll

- Driver and helper check-in/check-out.
- Capture GPS coordinates at check-in and check-out.
- Add or edit notes on attendance records.
- Allow authorized organization users to review staff attendance history.
- Flag attendance records and manually resolve flagged records.
- Calculate bi-weekly pay periods: the 1st–15th and the 16th–last day of the
  month.
- Show due payments, days worked, hours, rates, pay type, and amount due.
- Export due payments to an Excel workbook with:
  - A summary sheet.
  - A daily breakdown sheet containing local date/time, attendance status,
    notes, and hours.
- Provide staff pay history and organization-level pay history.

### Requests and approvals

- IOU requests, limited by the application's pay rules.
- Day-off requests.
- Profile/KYC edit requests.
- Trucker approval screens with pending-approval counts on the dashboard.

### Fuel and operations

- Drivers and helpers can log fuel purchases for their assigned truck.
- Record fuel quantity, amount paid, odometer reading, and fueling time.
- Trucker users can review organization and truck fuel logs.
- Fuel analytics are available by truck and organization.

### Localization and user experience

- English, Spanish, French, Chinese, Arabic, Hindi, Portuguese, Russian,
  German, Japanese, and Korean translations.
- Automatic device-language detection on first launch.
- Persisted language selection.
- Right-to-left support for Arabic.
- Light theme across the application.
- Responsive Expo web and mobile layouts.

## User roles

| Role | Main responsibilities |
| --- | --- |
| `super_admin` | Platform-wide administration, organizations, and users |
| `trucker_admin` | Organization fleet, staff, assignments, compliance, attendance, and approvals |
| `trucker_finance` | Organization financial operations, attendance review, payroll, and approvals |
| `driver` | Attendance, assigned-truck fuel logging, licenses, pay, and requests |
| `helper` | Attendance, assigned-truck fuel logging, licenses, pay, and requests |

All protected API requests use session authentication. Authorization is checked
by role and, where applicable, by organization ownership or membership.

## Technology stack

### Frontend

- React 19
- React Native 0.81
- Expo SDK 54
- React Navigation 7
- TanStack React Query
- React Native Web
- React Native Reanimated
- Manrope fonts
- `i18n-js` and Expo Localization

### Backend

- Node.js 22
- Express 5
- TypeScript
- `express-session`
- `bcryptjs`
- REST API under `/api`
- SendGrid connector-backed email helpers

### Data

- PostgreSQL
- Drizzle ORM
- Drizzle Kit
- Zod/drizzle-zod validation

## Repository structure

```text
.
├── client/
│   ├── components/       Shared React Native components
│   ├── constants/        Theme and design constants
│   ├── hooks/            Theme and platform hooks
│   ├── lib/              Auth, API, i18n, utilities, and language state
│   ├── navigation/       Tab and stack navigation
│   ├── screens/          Application screens
│   └── translations/     Translation dictionaries
├── server/
│   ├── db.ts             PostgreSQL/Drizzle connection
│   ├── email.ts          SendGrid email helpers
│   ├── index.ts          Express server and static Expo hosting
│   ├── routes.ts         Authentication and REST API routes
│   ├── storage.ts        Database access layer
│   └── templates/        Server-rendered landing page
├── shared/
│   └── schema.ts         Drizzle tables, relations, insert schemas, and types
├── assets/               Expo application assets
├── attached_assets/      Project-provided and generated source assets
├── scripts/
│   └── build.js          Static Expo Go build preparation
├── static-build/         Generated native Expo bundles/manifests
├── dist-web/             Generated Expo web output
├── app.json              Expo application configuration
├── drizzle.config.ts     Drizzle Kit configuration
├── package.json          Dependencies and development scripts
└── warehouse-equipment-tracker.xlsx
                         Standalone warehouse equipment tracker workbook
```

Generated build directories may be present in the repository for the current
deployment setup. They should be regenerated rather than edited by hand.

## Prerequisites

- Node.js 22 or a compatible Node.js installation.
- npm.
- PostgreSQL 16 or a compatible PostgreSQL server.
- A SendGrid connection if transactional email is enabled.

## Configuration

The backend requires the following environment variables:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret used to sign server sessions |
| `PORT` | No | Express port; defaults to `5000` |
| `EXPO_PUBLIC_DOMAIN` | Development/web | API host used by the Expo client |
| `REPLIT_DEV_DOMAIN` | Replit development | Replit development domain used by the Expo workflow and CORS |
| `REPLIT_DOMAINS` | Replit/deployment | Comma-separated allowed domains for CORS |
| `REPLIT_INTERNAL_APP_DOMAIN` | Static build/deployment | Internal application domain used when preparing native bundles |

Do not commit `.env` files, database URLs, session secrets, API keys, or other
credentials. In Replit, store secrets through the Secrets tool. SendGrid
credentials are resolved through the configured Replit connector rather than
being hard-coded in the application.

## Getting started in Replit

1. Provision or attach a PostgreSQL database.
2. Add `SESSION_SECRET` as a Replit secret.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Apply the Drizzle schema to the configured database:

   ```bash
   npm run db:push
   ```

5. Start the backend and frontend using the configured workflows:

   ```bash
   npm run server:dev
   npm run expo:dev
   ```

The repository's `Start App` workflow starts both services in parallel. The
backend listens on port `5000`; the Expo development server listens on port
`8081`.

On first launch, the app checks `/api/setup/status`. If no super administrator
exists, it displays the setup flow. The first super administrator can also be
created through:

```http
POST /api/setup/super-admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "choose-a-strong-password",
  "fullName": "Administrator"
}
```

After setup, create organizations, trucker users, drivers, helpers, trucks,
assignments, and licenses from the application.

## Development scripts

| Command | Purpose |
| --- | --- |
| `npm run server:dev` | Start the Express API in development mode |
| `npm run expo:dev` | Start the Expo development server |
| `npm run expo:start:static:build` | Start Expo in static/minified mode |
| `npm run expo:static:build` | Build native Expo bundles and manifests for static hosting |
| `npm run server:build` | Bundle the Express server into `server_dist` |
| `npm run server:prod` | Run the bundled production server |
| `npm run db:push` | Apply the current Drizzle schema to PostgreSQL |
| `npm run check:types` | Run TypeScript type checking without emitting files |
| `npm run lint` | Run Expo ESLint checks |
| `npm run lint:fix` | Apply automatic ESLint fixes where possible |
| `npm run check:format` | Check Prettier formatting |
| `npm run format` | Format supported source files with Prettier |

## Database model

The shared schema is defined in `shared/schema.ts` and includes:

- Users and organizations.
- Trucks, helpers, permits, CVSE records, and truck notes.
- Staff licenses.
- Tasks and reminder logs.
- Attendance records with GPS coordinates, notes, flags, and resolution data.
- Pay cycles and wage history.
- IOU, day-off, and KYC/profile change requests.
- Fuel logs.

The schema includes indexes for common organization, user, truck, status, and
date lookups. The application uses `db:push` for schema synchronization during
development.

## API overview

The API is implemented in `server/routes.ts`. Representative endpoint groups
include:

| Area | Example endpoints |
| --- | --- |
| Setup and auth | `/api/setup/status`, `/api/setup/super-admin`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` |
| Organizations and users | `/api/organizations`, `/api/users` |
| Fleet | `/api/trucks`, `/api/trucks/:id`, `/api/trucks/:truckId/helpers`, `/api/trucks/:truckId/permits` |
| Licenses | `/api/users/:userId/licenses`, `/api/licenses` |
| Tasks/reminders | `/api/tasks`, `/api/reminders/upcoming` |
| Attendance | `/api/attendance`, `/api/attendance/today`, `/api/attendance/checked-in`, `/api/attendance/:id/notes` |
| Flagged attendance | `/api/flagged-attendance`, `/api/attendance/:id/manual-resolve` |
| Approvals | `/api/iou-requests`, `/api/day-off-requests`, `/api/profile-edit-requests`, `/api/pending-approvals-count` |
| Payroll | `/api/pay/cycles`, `/api/pay/calculate`, `/api/pay/due-payments`, `/api/pay/work-history/:userId` |
| Fuel | `/api/fuel-logs`, `/api/fuel-logs/my-logs`, `/api/fuel-logs/analytics/...` |

The client uses relative API routes through `client/lib/api.ts` and
`client/lib/query-client.ts`. Browser requests include credentials so the
session cookie is sent with API calls.

## Authentication and security

- Passwords are hashed with bcrypt before storage.
- Authentication uses an HTTP-only Express session cookie.
- Production cookies are marked secure and sessions expire after seven days.
- Role middleware protects privileged routes.
- Organization-scoped access checks prevent cross-organization data access.
- User create/update fields are explicitly restricted.
- The server requires `SESSION_SECRET`; there is no fallback secret.
- CORS is restricted to configured Replit domains plus local development hosts.
- API request logging truncates long JSON responses.

Before deploying, use a unique production `SESSION_SECRET`, restrict database
access to the application, review organization-scoping rules, and confirm that
test accounts and development data are not being used in production.

## Production build and deployment

The Replit deployment configuration targets Cloud Run. The configured build
steps are:

```bash
npm run expo:static:build
npm run server:build
```

The production process is:

```bash
npm run server:prod
```

The Express server serves the API, the Expo web build when available, static
assets, and platform-specific Expo manifests. `scripts/build.js` prepares
static iOS and Android bundles by running Expo in static mode, downloading
bundles/manifests, collecting assets, and updating URLs for the deployment
domain.

For a Replit deployment, use the Replit deployment flow so the platform
provides the deployment domain and runtime environment. Do not hard-code
`localhost` or a development domain into application code.

## Standalone warehouse workbook

`warehouse-equipment-tracker.xlsx` is a separate operational workbook for
tracking blankets, steamers, dollies, and other equipment issued to trucks.
The workbook uses linked sheets and Settings-driven dropdowns for truck numbers
and equipment items. It is not part of the web application's database or API.

## Current roadmap

- Scheduled SMS and email reminder delivery.
- Further production hardening and operational monitoring.
- Native release automation for iOS and Android.

## Contributing

1. Create a focused branch for your change.
2. Install dependencies and update the database schema locally when needed.
3. Run type checks, linting, and formatting checks before opening a change:

   ```bash
   npm run check:types
   npm run lint
   npm run check:format
   ```

4. Test the affected role-specific flow in the web or mobile client.
5. Keep secrets, local environment files, generated caches, and credentials out
   of commits.

## License

No license file is currently included in this repository. Add an explicit
license before distributing or accepting external contributions.