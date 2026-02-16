# Changelog

All notable changes to this project will be documented in this file.

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
