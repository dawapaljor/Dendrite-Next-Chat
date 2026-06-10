# 🗺️ Project Architecture & Tech Stack

This document details the core components powering the Messaging App and its surrounding infrastructure.

---

## 🎨 Frontend & Interface (The User Layer)

* **⚡ [Next.js](https://nextjs.org/)**  
    The React framework used to build both the Chat Client and the Observation Dashboard. Provides fast performance through server-side rendering (SSR), static site generation (SSG), and efficient app routing.
* **🔌 [`matrix-js-sdk`](https://github.com/matrix-org/matrix-js-sdk)**  
    The official JavaScript/TypeScript client library for interacting with Matrix servers. It manages the "sync loop" that keeps your chat updated in real-time and handles complex tasks like sending messages, managing room state, and user events.
* **💅 [shadcn/ui](https://ui.shadcn.com/)**  
    A Tailwind CSS component library used for quickly styling the chat and dashboard interfaces with a responsive, highly premium, and modern design system.

---

## ⚙️ Core Infrastructure (The Engine)

* **🛡️ [Dendrite](https://github.com/matrix-org/dendrite)**  
    A high-performance, second-generation Matrix homeserver written in Go. Dendrite handles all core chat functionalities like room management, room federation, media services, and end-to-end encryption.
* **🗄️ [PostgreSQL](https://www.postgresql.org/)**  
    A production-grade relational database that stores persistent chat data, including user credentials, room states, event logs, and message metadata.

### Phase 1: Infrastructure & Core Server

The foundation is your Dendrite homeserver. Since you are using the ELK stack, you need to ensure logs are structured.

* Deploy Dendrite: Use Docker for a consistent environment. Configure it with PostgreSQL (required for production).
* Identity & Keys: Generate your server signing keys and set up your Matrix domain (<https://im.tibcert.org>). Granfana for dashboard Nginx Proxy Manager
* Logging: prometheus and grafana

### Phase 2: Next.js Chat Client

Build the actual interface  users will see.

* SDK Setup: Install matrix-js-sdk in your Next.js project. This handles the Matrix protocol so we don't have to write raw API calls.

* Core Logic: Implement "Client-Server" actions:
  * Auth: Login/Register screens.
  * The Sync Loop: The most critical part; this keeps the chat updating in real-time without refreshing.
* UI/UX: Use Shardcn(Tailwind CSS) for a responsive chat layout (Sidebar for rooms, Main area for messages).
* Deploy to frontend deployment platform such as Vercel, Netlify or Cloudflare for easy CI/CD and edge performance.

### Phase 3 Dashboard for Chat client Management (Components)

* User management (add,remove,ban, Activities)
* Room management(Create,Delete and room members controls)
* System health status
* Analytics (chart,graph & visualization) :
* Rooms and users analytics
* user activities,IP location,tracking
* IP-based user tracking and access control
* IP geo-location mapping for user insights
* abuse/spam (detection)
* Chat client Instance deployment Setting
  * Instance deployment configuration: branding, themes,logo
  * Automation of one click deployment of instance with aws(cloudfront) or cloudflare(workers&page)
