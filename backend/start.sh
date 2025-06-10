#!/bin/sh

# Run prisma generate to generate Prisma client
npx prisma generate

# Start the application using npm
npm run start:dev