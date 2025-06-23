# Project History & Technical Decisions (Frontend)

This document records the main decisions, problems, solutions, and technical context of the VideoToNotes.ai frontend project. It is intended to provide onboarding and historical context for any developer joining or maintaining the system.

---

## 1. Project Overview

VideoToNotes.ai frontend is a modern web application built with Next.js (TypeScript), deployed on Netlify. It provides a user-friendly interface for uploading audio/video files, selecting AI providers, viewing transcriptions, summaries, flashcards, questions, and study plans. It integrates with a FastAPI backend and uses Google authentication via NextAuth.

---

## 2. Major Technical Decisions & Rationale

### 2.1. Framework & Deployment
- **Next.js** was chosen for its SSR/SSG capabilities, React ecosystem, and easy deployment on Netlify.
- **Netlify** is used for hosting due to its seamless integration with Next.js, automatic deploy previews, and environment variable management.

### 2.2. Authentication
- **Google authentication via NextAuth** is used for secure, user-friendly login.
- JWT tokens are obtained after login and sent in the Authorization header to the backend for all protected endpoints.
- Avatar and user info are displayed in the UI; image domain is configured in `next.config.js` for security.

### 2.3. File Upload & Provider Selection
- Users can upload audio or video files (with client-side validation for size and type).
- Provider selection (OpenAI or T5) is available via UI; OpenAI is the default and recommended provider.
- The frontend enforces the 25MB file size limit for OpenAI and provides user feedback if the file is too large.

### 2.4. UI/UX
- Clean, modern interface with clear feedback for each step (upload, processing, results).
- Tabs for Transcription, Summary, Questions, Flashcards, and Study Plan.
- All YouTube-related UI and mind map features were removed for clarity and maintainability.

### 2.5. API Integration
- All requests to the backend include the JWT in the Authorization header.
- Endpoints for transcription, questions, flashcards, and study plan are integrated.
- Error handling and loading states are implemented for all API calls.

### 2.6. CI/CD & Branch Protection
- Deploy previews are automatically created by Netlify for every PR.
- Netlify status checks are used as the main branch protection mechanism.
- GitHub Actions CI is optional for the frontend, as Netlify deploy checks are sufficient.
- Auto-merge and branch deletion are configured via GitHub settings for workflow hygiene.

---

## 3. Problems Faced & Solutions

### 3.1. YouTube & Mind Map Features
- Problem: YouTube and mind map features were initially present but removed due to backend/cloud limitations and to simplify the user experience.
- Solution: All related components and types were deleted; UI and logic were refactored to focus on file upload and core features.

### 3.2. File Size Limit Enforcement
- Problem: Users could attempt to upload files larger than the OpenAI API limit (25MB).
- Solution: Client-side validation blocks large files and provides clear error messages.

### 3.3. Avatar/Image Domain Issues
- Problem: User avatars from Google required explicit domain configuration in Next.js.
- Solution: `next.config.js` was updated to allow the correct image domains.

### 3.4. CI/CD Consistency
- Problem: Deciding between GitHub Actions CI and Netlify deploy checks for branch protection.
- Solution: Netlify deploy checks are used as the main status check for PRs; GitHub Actions CI is optional.

---

## 4. Production Checklist

- [x] Next.js app deployed on Netlify
- [x] Google/NextAuth authentication configured and tested
- [x] JWT integration with backend
- [x] File upload with size/type validation
- [x] Provider selection and feedback
- [x] All YouTube and mind map logic removed
- [x] Netlify deploy previews and status checks enabled
- [x] Environment variables managed via Netlify dashboard
- [x] Error handling and user feedback implemented
- [x] Documentation and onboarding guides up to date

---

## 5. Technical Limitations & Considerations

- OpenAI Whisper API: 25MB file size limit; enforced on the client
- No YouTube or mind map support (features removed for simplicity and reliability)
- All backend endpoints require JWT authentication
- Netlify does not support custom Docker builds for Next.js; standard build is used
- Cloud Run cold starts may affect perceived latency for first requests

---

## 6. Integration Context (Frontend/Backend)

- After Google login, NextAuth provides a JWT which is sent to the backend in the Authorization header
- File uploads are sent as multipart/form-data to the `/transcribe` endpoint
- Results (transcription, summary, questions, flashcards, study plan) are displayed in UI tabs
- All additional backend endpoints (questions, flashcards, study plan) are integrated and require authentication

---

## 7. Future Improvements

- Add support for drag-and-drop file upload
- Improve progress feedback for long-running operations
- Add support for more languages and providers
- Enhance accessibility and mobile responsiveness
- Expand test coverage and CI automation

---

## 8. Contact

Project lead: Camilo Raitz
Email: craitz@gmail.com
GitHub: https://github.com/craitz

---

End of document. 