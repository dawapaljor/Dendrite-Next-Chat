# 💬 Workspace Communication Deck (Matrix Edition)

A high-fidelity, modern collaborative chat client built with **Next.js 15**, **React 19**, **Tailwind CSS v4**, and **Motion**. This client is fully integrated with **Matrix** via the `matrix-js-sdk`, connecting directly to a **Dendrite homeserver** hosted at `https://im.tibcert.org`.

---

## ✨ Core Features

*   **👥 Real-Time Room Synchronization**: Listens directly to Matrix sync events. Dynamically maps homeserver Rooms $\rightarrow$ `chats`, timeline entries $\rightarrow$ `messages`, and user states $\rightarrow$ `presence`.
*   **🔑 Secure Authentication Wall**: A premium gateway to register new accounts or log into existing ones on the homeserver. Bypasses the login overlay instantly if session tokens exist in client LocalStorage.
*   **🛠️ Group Channel provisioner**: Dialog modal allowing users to select multiple active colleagues, invite them, and initialize private multi-user room workspaces.
*   **🧭 Discovered Teammates**: Integrates local mock teammates alongside active Matrix users in the contact directory. Clicking "Connect" on local mocks automatically computes and invites their respective homeserver addresses (e.g., `@alex:im.tibcert.org`).
*   **😀 Searchable Emoji Picker**: Integrated category-based emoji popover supporting smileys, people, nature, activities, and searchable filters.
*   **🎙️ Voice Message Recorder**: Native audio recording using the browser `MediaRecorder` API with dynamic timing indicators and a custom waveform progress player.
*   **📎 Asset Attachment Uploads**: Dynamic image, video, and general document uploader with progress overlays and full-screen image lightbox support.
*   **🔗 Link & GIF Previews**: Autodetects URLs to render inline image/GIF media and rich Microlink-powered site metadata cards.
*   **📇 Contact Card Sharing & Copying**: Share selectable identity coordinates (email, phone, title) with an interactive live card preview and right-aligned toggles. Includes inline copy-to-clipboard icons inside the chat card.
*   **⚙️ Global Feature Config Flags**: Control and toggle individual chat features statically or via environment variables (`NEXT_PUBLIC_ENABLE_...`).
*   **🎨 Personalized Design**: Rich dark/light layouts synchronized with global CSS variable mappings and custom component themes.
*   **💾 Local Storage Cache**: Stores active display preferences and profile metadata securely inside the client's browser.

---

## 🛠️ Technical Stack

*   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
*   **Client Core**: [React 19](https://react.dev/)
*   **Matrix Protocol Client**: [`matrix-js-sdk`](https://github.com/matrix-org/matrix-js-sdk)
*   **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
*   **Animations**: [Motion](https://motion.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Design Templates**: Customized templates from [shadcn/ui](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/).

---

## 📋 Integration Process & Implementation Steps

Here is the step-by-step documentation of how the Matrix client communication was integrated (Phase 2):

### 1. SDK Installation & Initialization
*   Installed `matrix-js-sdk` as a client dependency.
*   Created a browser-safe, SSR-compliant client manager in [matrix.ts](file:///e:/Github%20Pages/Messaging%20App/messaging-web-client/lib/matrix.ts). It checks if `window` is defined before instantiating the SDK client, preventing Next.js server pre-rendering crashes.

### 2. Session Caching & Authentication
*   Implemented `loginMatrixUser` and `registerMatrixUser` helper methods using Dummy Interactive Auth (`m.login.dummy`) for open-server registrations.
*   Configured a credential structure (`MatrixSession`) storing the `accessToken`, `userId`, `deviceId`, and `homeserverUrl` inside LocalStorage.
*   Built the [auth-view.tsx](file:///e:/Github%20Pages/Messaging%20App/messaging-web-client/components/messenger/auth-view.tsx) component offering input fields, validations, connection feedback, and login/registration switching.

### 3. The Real-Time Sync Loop Pipeline
*   Wired a synchronization pipeline in [page.tsx](file:///e:/Github%20Pages/Messaging%20App/messaging-web-client/app/page.tsx) that triggers on authentication success.
*   Listens to `"sync"` events. Once the sync state reaches `PREPARED` or `SYNCING`, it reads the room list and updates client states:
    *   **Matrix Rooms $\rightarrow$ UI Chat Threads**: Mapped room IDs, user lists, unread counters, and presence statuses.
    *   **Timeline Events $\rightarrow$ Message History**: Filters for `m.room.message` events and translates them into styled sender/receiver chat bubbles.
    *   **Matrix Members $\rightarrow$ Contact directory**: Gathers members across all joined rooms to dynamically build the search index.
*   Listens to `"Room.timeline"` to capture incoming messages and trigger list state syncs.

### 4. Event Dispatch & Room Management
*   **Send Action**: Submits text payloads via `client.sendMessage()` specifying the `m.text` parameter type.
*   **Direct Messaging**: Iterates through active rooms to look for existing DMs with a contact. If none is found, it calls `client.createRoom()` with invitees and configures the direct preset parameter.
*   **Group Creation**: Dispatches `client.createRoom()` with invited Matrix user IDs and configures a private space.

---

## 🔧 Dendrite Server Configuration & Troubleshooting

If you encounter issues during **Login** or **Registration**, consult these configurations to ensure your homeserver is fully compatible with browser client applications.

### 1. CORS Configuration (Cross-Origin Resource Sharing)
By default, web browsers block network requests made to domains other than the host (e.g. from `localhost:3000` to `im.tibcert.org`). You must configure your Matrix homeserver or proxy to inject CORS headers.

#### Option A: In the `dendrite.yaml` Config
Add or verify the `cors` configurations under the `global` section:
```yaml
global:
  # ...
  cors:
    allowed_origins: ["*"]
    allowed_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
```

#### Option B: In Nginx Reverse Proxy (Nginx Proxy Manager)
If your homeserver is served behind Nginx, add the following configuration inside the server `location` blocks:
```nginx
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    add_header 'Access-Control-Max-Age' 1728000;
    add_header 'Content-Type' 'text/plain; charset=utf-8';
    add_header 'Content-Length' 0;
    return 204;
}

add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
```

### 2. Manual User Creation (Closed Registration)
Most Matrix homeservers disable open signups (`enable_registration: false`) to mitigate spam. If registration fails through the client, create the account via the homeserver console:

Run the user creation script bundled with your Dendrite setup:
```bash
./dendrite-create-user -config /path/to/dendrite.yaml -username myusername -password mypassword
```
*(If you are running Dendrite in Docker, run this command inside the container shell, or prefix with `docker exec -it <container_name>`).*

### 3. Error Codes & Diagnostic Guidelines
*   **`M_FORBIDDEN` (403)**: Access denied. Registration is closed on the server or the password provided is incorrect.
*   **`M_USER_IN_USE` (400)**: The registration name is already taken. Try signing up with a different username.
*   **CORS Error (Dev Console)**: Browser fails to reach `im.tibcert.org` with preflight check block. Configure headers as shown in Step 1.
*   **HTTP mixed-content block**: Ensure your Next.js client is hosted with HTTP/HTTPS rules that match the homeserver protocol.

---

## 📂 Project Directory Structure

```text
├── app/
│   ├── globals.css          # Tailwind CSS variable mappings and custom visual definitions
│   ├── layout.tsx           # Main application root layout
│   └── page.tsx             # Home view orchestrating Matrix SDK state bindings
├── components/
│   ├── messenger/
│   │   ├── auth-view.tsx    # Sign In & Registration form views
│   │   ├── chat-view.tsx    # Timeline messages panel and input fields
│   │   ├── desktop-view.tsx # Primary application container grid
│   │   ├── discover-contacts.tsx # Contact directory filter list
│   │   ├── new-group-view.tsx    # Channel creation builder dialog
│   │   ├── profile-settings.tsx  # User preferences form and session logout triggers
│   │   ├── sidebar-threads.tsx   # Recents sidebar list and unread count badges
│   │   └── types.ts         # TypeScript schema definitions for the messenger
│   └── ui/                  # Tailored layout components (avatars, scrolls, dropdowns, etc.)
├── hooks/
│   └── use-mobile.ts        # Responsive layout device hook
├── lib/
│   ├── config.ts            # Global feature configuration toggles and overrides
│   ├── matrix.ts            # Matrix API manager, session storage, and client provider
│   └── utils.ts             # Styling class utility
├── .env.example             # Documented example local settings variables
├── package.json             # Build scripts and package dependencies
└── tsconfig.json            # Strict TypeScript compiler options
```

---

## ⚙️ Feature Flags Configuration

The client features can be customized statically inside [config.ts](file:///e:/Github%20Pages/Messaging%20App/messaging-web-client/lib/config.ts) or dynamically using environment variables.

To disable specific chat features, configure the following keys inside your `.env` or `.env.local` file:

| Environment Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_ENABLE_EMOJI_PICKER` | Controls the smileys popover icon and search deck. | `true` |
| `NEXT_PUBLIC_ENABLE_VOICE_MESSAGES` | Controls microphone recording and waveform audio playback. | `true` |
| `NEXT_PUBLIC_ENABLE_MEDIA_ATTACHMENTS` | Controls Plus menu upload buttons (images, videos, documents). | `true` |
| `NEXT_PUBLIC_ENABLE_LINK_PREVIEWS` | Controls automatic URL previews and Microlink website cards. | `true` |
| `NEXT_PUBLIC_ENABLE_CONTACT_CARD_SHARING`| Controls Contact Card sharing toggles and business card timeline cards. | `true` |

---

## 🚀 Getting Started

### Prerequisites
Ensure you have **Node.js** (v18+) installed.

### 1. Installation
Install dependency libraries:
```bash
npm install
```

### 2. Launch Development Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

### 3. Production Build
Verify type checks, lint rules, and compile the optimized static production bundle:
```bash
npm run build
```

### 4. Production Start
Run the optimized Next.js production build:
```bash
npm run start
```
