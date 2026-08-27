# Changelog

All notable changes to this project will be documented in this file.

## [2.1.2] - 2026-08-27

### Added
- **SEO & Google Search Entity Optimization**:
  - Direct search index targeting for "Chester Maligaso", "Chester Luke Maligaso", "Chester Luke", "Maligaso", and "Kukaass" across page meta tags, OpenGraph, and Twitter summaries.
  - Implemented Schema.org `ProfilePage` structured data with explicit `mainEntity` mapping to Chester's `Person` node.
  - Expanded `Person` schema with `givenName`, `familyName`, `additionalName`, and comprehensive `alternateName` array for exact Google Knowledge Graph entity resolution.
  - Added Schema.org `BreadcrumbList` structured data on the homepage and dynamic project detail views (`/projects/[id]`).
  - Added dynamic sitemap generation (`app/sitemap.ts`) ensuring all project detail routes are submitted for Google crawl indexing.
- **Tech Stack & DevOps Capabilities**:
  - Added Angular, PostgreSQL/Postgres, CI/CD, AWS, GCP (Google Cloud Platform), Linux VM, and DevOps tools to `stack.config.ts`, `AboutFile.tsx`, and schema `knowsAbout`.
- **QRTY 3D QR Generator Brand & Search Visibility**:
  - Generated full Google-compliant icon suite (48x48, 96x96, 192x192, 512x512, apple-touch-icon 180x180, and multi-size ICO with 48px+ resolutions) so Google search snippets display the tactical QRTY logo.
  - Added high-resolution OpenGraph preview image (`og-image.png`) and schema `image`/`logo` properties.
  - Standardized clean single-domain breadcrumb hierarchy (`qrty` > `Studio`) for Google rich snippet display.

### Fixed
- Fixed missing `updatedAt` field on the `Project` interface in `hooks/use-projects.ts`.
- Restored truncated `framer-motion` and `@tanstack/react-query` package type definitions.
- Hardened database connection in `lib/db.ts` to defer `MONGODB_URI` environment validation to runtime connection requests, avoiding build-time static evaluation crashes.

## [2.1.1] - 2026-02-17

### Added
- **Admin Settings Feature**:
  - **Feature Toggle**: Implemented a global settings system to enable/disable the AI chatbot from the admin dashboard.
  - **Admin UI**: Added a new "Settings" tab in the Admin Dashboard with a real-time toggle switch.
  - **Settings API**: Created `models/Settings.ts` and `app/api/settings` endpoint for managing application configuration.
  - **Conditional Rendering**: Updated `ChatWidget` to respect the global `chatbot_enabled` setting.

### Changed
- **Model Upgrade**: Switched from `gemini-3-flash-preview` to `gemini-2.0-flash` for better rate limits and performance.
- **API Authentication**: Refactored `app/api/settings/route.ts` to use shared `isAuthenticated` utility to fix 401 errors.
- **Component Restructure**: Renamed `AdminSettings` to `SettingsTab` to resolve import path conflicts.

## [2.1.0] - 2026-02-17

### Added
- **AI Chatbot Assistant**:
  - **Google Generative AI Integration**: Implemented official `@google/generative-ai` SDK with `gemini-3-flash-preview` model.
  - **Streaming Responses**: Real-time message streaming with custom `ReadableStream` implementation.
  - **Markdown Support**: Rich text formatting using `react-markdown` with support for links, lists, bold text, and inline code.
  - **Enhanced Context**: Comprehensive chatbot knowledge including:
    - Full name and brand (Chester.dev)
    - Education background (BS IT, MarSU 2024)
    - Complete social media links (GitHub, LinkedIn, Facebook, Instagram)
    - Work experience and project details from database
  - **Multi-turn Conversations**: Proper conversation history handling with message format conversion.
  - **Improved UI**: Thin 4px scrollbar with rounded edges and hover effects.

### Changed
- **API Route** (`app/api/chat/route.ts`):
  - Replaced `@ai-sdk/google` with official `@google/generative-ai` SDK.
  - Implemented custom streaming response handling.
  - Added message format conversion to strip `type` field from parts for API compatibility.
- **ChatWidget** (`components/ChatWidget.tsx`):
  - Removed `useChat` hook dependency for manual streaming control.
  - Added `react-markdown` for formatted message rendering.
  - Implemented custom message state management and streaming logic.
- **Context Loader** (`lib/context-loader.ts`):
  - Added full name, brand, and education information.
  - Updated social links with complete URLs.
  - Added specific instructions for handling name and education queries.

### Fixed
- Model 404 errors by switching to `gemini-3-flash-preview`.
- Multi-turn conversation errors by properly formatting message parts.
- ReactMarkdown className prop error by wrapping in styled div.
- TypeScript errors in message handling and form submission.

## [2.0.2] - 2026-02-16

### Added
- **Server-Side Admin Security Hardening**:
  - **JWT Authentication**: Moved admin authentication from client-side to server-side using JSON Web Tokens (JWT).
  - **Secure Session Management**: Implemented HTTP-only cookies for session storage, preventing client-side JavaScript access and potential token theft.
  - **Global Route Protection**: Created a global `AdminLayout` to wrap all `/admin` routes, enforcing authentication before rendering any sub-page content.
  - **API Middleware Protection**: Added `isAuthenticated` checks to all mutation API endpoints (POST, PUT, DELETE) for projects, experiences, and resumes.
  - **Shared Auth Components**: Extracted `AdminLogin` for global reuse across the admin section.

### Changed
- **Secret Management**: Renamed `NEXT_PUBLIC_ADMIN_PASSWORD` to `ADMIN_PASSWORD` to prevent exposure in the client-side bundle.
- **Environment Configuration**: Added `JWT_SECRET` for secure token signing.
- **Admin Dashboard Cleanup**: Simplified the `AdminDashboard` component by removing redundant client-side authentication logic and adding a proper loading state to prevent UI flicker.

## [2.0.1] - 2026-02-16

### Added
- **Production Console Protection**:
  - Implemented a "STOP!" security warning in the browser console for production environments.
  - Disabled all `console` methods (`log`, `warn`, `error`, etc.) in production to prevent data leakage and deter "self-XSS" injection attacks.
  - Used `Object.defineProperty` to lock console methods, making them difficult to re-enable manually.

## [2.0.0] - 2026-02-16

### Added
- **Dynamic Resume Management System**:
  - **Base64 Storage**: Implemented efficient PDF storage directly in MongoDB using Base64 strings.
  - **Version Control**: Added `isActive` flag to manage multiple resume versions.
  - **Identity Tracking**: Introduced `originalFilename` to track the actual name of uploaded files regardless of their public download name.
  - **Inline Editing**: Added a "Resume Management" tab in the admin dashboard for seamless label and filename updates.
  - **File Replacement**: Developed a custom "Attached File" UI for replacing existing PDF files in the database.
  - **In-App Browser Robustness**: Created a server-side binary stream endpoint (`/api/resumes/active/download`) to resolve download blocks in Facebook and Instagram browsers.
- **Professional Experience Timeline**:
  - **Schema Design**: Created a Mongoose model with automatic timestamp handling.
  - **Admin Panel**: Dedicated "Experiences" tab with full CRUD capabilities.
  - **Google Maps Integration**: Added `mapUrl` support to make work locations clickable on the frontend.
  - **Auto-Sorting**: Experiences are now dynamically sorted by `startDate` in descending order.
- **Enhanced UI & Feedback**:
  - **Hero Section**: Added an interactive "Download CV" button with a satisfying 1-second loading animation and spinner.
  - **Project Gallery**: Optimized the layout to a 2-column grid on large screens for better visual balance.
  - **Skeleton Loading**: Implemented refined skeleton screens for Projects and Experiences sections.
  - **Date Selectors**: Added custom Month/Year dropdown selectors in the admin panel for standardized date entry.

### Changed
- **Framework & Engine**: Migrated the entire codebase to **Next.js 16.1** with **Turbopack** for near-instant development builds.
- **React Upgrade**: Updated core components to **React 19**, enabling latest concurrent rendering features.
- **Async Handling**: Updated all dynamic routes and API handlers to comply with Next.js 16's asynchronous `params` requirements.

### Fixed
- **Download Errors**: Fixed "Page cannot be loaded" errors in social media apps by replacing client-side blobs with server-side binary attachments.
- **Schema Conflicts**: Resolved Mongoose timestamp conflicts in the Experience model.
- **Layout Consistency**: Corrected grid alignment and spacing issues in the project gallery.
