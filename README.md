# IncuXai - India's Ultimate AI Gaming Hackathon

Production-ready full-stack platform for running AI gaming hackathons.

## Structure
- frontend/ — Next.js (App Router) frontend
- backend/ — Express + TypeScript API
- database/ — Schema files and ER diagram
- docs/ — Guides, architecture, and deployment notes
- scripts/ — Utility scripts (seeding, migrations, etc.)

## Prerequisites
- Node.js 18+ and npm or pnpm
- Docker & Docker Compose (for production/local containers)
- PostgreSQL or a compatible database (see backend config)

## Environment
Create environment files for each service from the examples:
- frontend/.env.example -> frontend/.env
- backend/.env.example -> backend/.env

Required backend vars (examples):
- DATABASE_URL=postgres://user:pass@localhost:5432/dbname
- JWT_SECRET=supersecret
- CLOUDINARY_URL=cloudinary://...

Required frontend vars (examples):
- NEXT_PUBLIC_API_URL=http://localhost:4000

## Quick Start (local development)
1. Copy env examples: `cp backend/.env.example backend/.env` and `cp frontend/.env.example frontend/.env` (or create them on Windows accordingly).
2. Install dependencies:
	- Backend: `cd backend && npm install`
	- Frontend: `cd frontend && npm install`
3. Run services in separate terminals:
	- Backend: `cd backend && npm run dev`
	- Frontend: `cd frontend && npm run dev`
4. Run tests:
	- Backend unit tests: `cd backend && npm test`
	- Frontend tests: `cd frontend && npm test`

## Scripts
- Frontend: `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e`
- Backend: `npm run dev`, `npm run build`, `npm run test`

## Database
- See `database/schema.md` and `backend/src/config/db.ts` for connection and migration steps.

## Deployment
Follow the guides in `docs/deployment.md` and `docs/production-checklist.md` for production setup, Docker Compose, and cloud specifics.

## Contributing
- Read contributor guidelines in `docs/participant-guide.md` and open issues/PRs for changes.

## License
This repository's license and contributor terms are documented in LICENSE (if present).

If you'd like, I can also add `.env.example` files for frontend and backend, or wire up a local Docker Compose for full-stack development. Which would you like me to do next?
