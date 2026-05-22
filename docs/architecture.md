# Architecture

## Overview
- Frontend: Next.js 15 App Router (Vercel)
- Backend: Express + TypeScript (Render/Railway)
- Database: MongoDB Atlas
- Integrations: Razorpay, Resend, Discord, OpenAI, Cloudinary

## Diagram

```mermaid
flowchart LR
  subgraph Frontend
    A[Next.js App]
  end
  subgraph Backend
    B[Express API]
  end
  subgraph Data
    C[(MongoDB Atlas)]
  end
  subgraph Integrations
    D[Razorpay]
    E[Resend]
    F[Discord]
    G[OpenAI]
    H[Cloudinary]
  end

  A -->|REST| B
  B --> C
  B --> D
  B --> E
  B --> F
  B --> G
  B --> H
```
