# NotifyFlow Backend

A backend notification platform built with NestJS 11, BullMQ, Redis, PostgreSQL, Firebase, and Socket.IO.

## Overview

This repository implements a Notification-as-a-Service backend that supports:

- Email delivery
- Push notifications
- In-app realtime notifications
- Queue-driven worker processing
- JWT-based auth and realtime authentication
- PostgreSQL persistence via Drizzle ORM

## Architecture

![Current Architecture](architecture.png)

## Retry Flow In Workers:
![alt text](retry-flow.png)

## Core Project Flow

1. **HTTP API**
   - `src/main.ts` boots the NestJS application.
   - `src/app.module.ts` imports `NotificationsModule`,`RealtimeModule`,`AuthModule`,etc.

2. **Notification orchestration**
   - `src/modules/notifications` contains the notification controller, service, and repositories.
   - Notification delivery requests are persisted and routed through delivery queues.

3. **Queueing and workers**
   - `src/infrastructure/queues` defines BullMQ queues such as `email.queue.ts`.
   - `src/infrastructure/workers` defines worker entrypoints like `email.worker.ts`.
   - Workers pull jobs from Redis-backed queues and hand them to `src/infrastructure/processors/delivery.processor.ts`.

4. **Delivery processor**
   - `delivery.processor.ts` claims pending delivery records, loads the notification, and dispatches by job type.
   - Supported job types are:
     - `SEND_EMAIL`
     - `SEND_PUSH`
     - `SEND_IN_APP`

5. **Handlers**
   - `src/infrastructure/handlers/email.handler.ts`
     - Loads user email provider config
     - Decrypts BYO API keys
     - Sends email via provider-specific handlers like Resend
   - `src/infrastructure/handlers/push.handler.ts`
     - Reads FCM tokens for the recipient
     - Sends push payloads via Firebase provider code
   - `src/infrastructure/handlers/inapp.handler.ts`
     - Publishes a realtime notification event to Redis pub/sub

6. **Realtime delivery**
   - `src/modules/realtime` contains the Socket.IO gateway, socket registry, emitter, and Redis subscriber.
   - `NotificationWebSocketGateway` authenticates sockets using realtime JWT tokens.
   - Connected sockets are registered by recipient ID.
   - Redis subscriber listens for `realtime.notifications` and forwards messages to active sockets.

## Infrastructure Details

### Redis

- Used for BullMQ queue backplane
- Used for realtime pub/sub channels
- `src/config/redis.ts` exports a shared Redis connection for queues
- `src/infrastructure/realtime/redis/redis-pubsub.ts` exports publisher/subscriber clients for realtime events

### PostgreSQL + Drizzle ORM

- Database schema and migration metadata live under `drizzle/`
- `migrate.ts` runs migrations
- `src/db/queries` contains query helpers for users, notifications, deliveries, devices, and email provider configuration
- `src/db/schema` contains table definitions used by Drizzle ORM

### Authentication

- Realtime socket auth is implemented in `src/modules/auth/services/realtime-auth.service.ts`
- Tokens are verified using `env.REALTIME_JWT_SECRET`
- The realtime gateway expects a JWT in `client.handshake.auth.token`

## Folder Structure

- `src/`
  - `app.module.ts`, `main.ts` - application bootstrap
  - `config/` - environment and Redis configuration
  - `db/` - database initialization, schema, and query helpers
  - `infrastructure/` - workers, queues, handlers, processors, realtime pub/sub, and providers
  - `modules/` - feature modules for auth, notifications, realtime, users, devices, and API keys
  - `types/` - shared TypeScript definitions for DB models, workers, and realtime payloads
  - `utils/` - encryption, API key generation, error handling
- `test/` - e2e tests and browser-based test clients for in-app/push flows
- `drizzle/` - SQL migrations and migration journal
- `package.json` - scripts and dependencies

## Running the Project

### Install dependencies

```bash
npm install
```

### Environment

Create a `.env` file in the project root with values for:

```env
JWT_SECRET=...
REALTIME_JWT_SECRET=...
DATABASE_URL=postgresql://user:pass@host:port/db
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RESEND_API_KEY=...
MASTER_ENCRYPTION_KEY=...
GOOGLE_CLIENT_ID=...
```

### Run local app

```bash
npm run start:dev
```

### Run queue workers

```bash
npm run emailworker
npm run pushworker
npm run inappworker
```

### Run migration

```bash
npm run migrate
```

## Scripts

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run start:debug`
- `npm run start:prod`
- `npm run lint`
- `npm run format`
- `npm test`
- `npm run test:e2e`
- `npm run inappworker`
- `npm run inappq`
- `npm run pushworker`
- `npm run pushq`
- `npm run emailworker`
- `npm run emailq`
- `npm run migrate`

## Notes

- Worker processes are executed directly with `tsx`.
- Realtime delivery is decoupled from email/push via Redis pub/sub.
- The project uses a modular NestJS design to separate delivery, persistence, and realtime layers.
