# Adin W-T Interview POS System

# Local (dev) Requirements
- node
- pnpm
- docker
- docker-compose

# Setup Locally (dev)
1. Copy `.env.example` to `.env`
2. Fill out all fields with appropriate secrets
3. Start the database (see step 1 below)
4. Run `pnpm run db:push`

# Running Locally (dev)
1. Run `docker-compose up` (add `-d` to run in detatched mode [the containers
   do not hold the terminal and no output is shown])
2. In a seperate terminal (or optionally the same one if `-d` was used) run
   `pnpm run dev`
