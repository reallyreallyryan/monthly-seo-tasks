SEO Client Monthly Tracker - Project Brief
Overview
A simple web-based checklist tool for tracking recurring monthly SEO tasks across multiple clients. Hosted on GitHub Pages with data persistence via JSONbin.io.

Problem Statement
Ryan needs to track the same 5-8 SEO tasks for multiple clients each month. Currently there's no centralized, persistent way to see what's done vs. outstanding across all clients. The tool should be accessible from any computer and maintain state month-to-month.

Core Requirements
Functional Requirements

Client Management

Add new clients (text input + button)
Remove existing clients (delete button per client)
Clients persist between sessions


Task Management

Add new tasks (text input + button)
Remove existing tasks (delete button per task)
Tasks apply globally to all clients
Tasks persist between sessions


Checklist Interface

Display grid/table: clients as rows, tasks as columns (or vice versa)
Checkbox at each client/task intersection
Checked state saves immediately to JSONbin


Month Reset

"New Month" button clears all checkboxes
Clients and tasks remain intact
Optional: prompt for confirmation before reset
Optional: store current month label for display



Non-Functional Requirements

Accessible from any device with a browser
No login required (security through obscurity - private JSONbin ID)
Fast load time (minimal dependencies)
Mobile-friendly (responsive layout)


Technical Architecture
Hosting

GitHub Pages - Static file hosting (free)
Repository: monthly-seo-tasks
URL: https://github.com/reallyreallyryan/monthly-seo-tasks

Data Persistence

JSONbin.io - JSON storage API (free tier: 500 requests/month)
Single JSON bin stores all application state
API calls via fetch() from client-side JavaScript

File Structure
seo-monthly-tracker/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Styling (keep minimal)
├── js/
│   └── app.js          # All application logic
└── README.md           # Setup instructions

Data Model
json{
  "currentMonth": "2026-01",
  "clients": [
    "Client A",
    "Client B",
    "Client C"
  ],
  "tasks": [
    "Content Drafts",
    "Local SEO",
    "Technical SEO",
    "Monthly Report"
  ],
  "completions": {
    "Client A": {
      "GSC Review": true,
      "Backlink Audit": false,
      % SEO Client Monthly Tracker — Project Brief

      ## Overview

      A simple web-based checklist tool for tracking recurring monthly SEO tasks across multiple clients. Hosted on GitHub Pages with data persistence via JSONbin.io.

      ## Problem Statement

      Ryan needs to track the same 5–8 SEO tasks for multiple clients each month. Currently there is no centralized, persistent way to see what's done vs. outstanding across all clients. The tool should be accessible from any computer and maintain state month-to-month.

      ## Core Requirements

      ### Functional Requirements

      #### Client Management

      - Add new clients (text input + button)
      - Remove existing clients (delete button per client)
      - Clients persist between sessions

      #### Task Management

      - Add new tasks (text input + button)
      - Remove existing tasks (delete button per task)
      - Tasks apply globally to all clients
      - Tasks persist between sessions

      #### Checklist Interface

      - Display grid/table: clients as rows, tasks as columns (or vice versa)
      - Checkbox at each client/task intersection
      - Checked state saves immediately to JSONbin

      #### Month Reset

      - "New Month" button clears all checkboxes
      - Clients and tasks remain intact
      - Optional: prompt for confirmation before reset
      - Optional: store current month label for display

      ### Non-Functional Requirements

      - Accessible from any device with a browser
      - No login required (security through obscurity — private JSONbin ID)
      - Fast load time (minimal dependencies)
      - Mobile-friendly (responsive layout)

      ## Technical Architecture

      ### Hosting

      - GitHub Pages — static file hosting (free)
      - Repository: monthly-seo-tasks
      - URL pattern: https://github.com/reallyreallyryan/monthly-seo-tasks

      ### Data Persistence

      - JSONbin.io — JSON storage API (free tier: 500 requests/month)
      - Single JSON bin stores all application state
      - API calls via `fetch()` from client-side JavaScript

      ## File Structure

      ```
      seo-monthly-tracker/
      ├── index.html          # Main HTML structure
      ├── css/
      │   └── styles.css      # Styling (keep minimal)
      ├── js/
      │   └── app.js          # All application logic
      └── README.md           # Setup instructions
      ```

      ## Data Model

      ```json
      {
        "currentMonth": "2026-01",
        "clients": [
          "Client A",
          "Client B",
          "Client C"
        ],
        "tasks": [
          "Content Outlines",
          "Local SEO",
          "Technical SEO",
          "Monthly Report"
        ],
        "completions": {
          "Client A": {
            "Content Outlines": true,
            "Local SEO": false,
            "Technical SEO": true,
            "Monthly Report": false
          },
          "Client B": {
            "Content Outlines": true,
            "Local SEO": false,
            "Technical SEO": true,
            "Monthly Report": false
          }
        }
      }
      ```

      ## UI Wireframe (Text-Based)

      ```
      ┌─────────────────────────────────────────────────────────────────┐
      │  SEO Monthly Tracker                          January 2026      │
      │                                               [New Month]       │
      ├─────────────────────────────────────────────────────────────────┤
      │                                                                 │
      │  ┌─────────────────────────────────────────────────────────┐   │
      │  │           │ GSC    │ Backlink │ Rank   │ Content │ Report│   │
      │  │           │ Review │ Audit    │ Track  │ Check   │       │   │
      │  ├───────────┼────────┼──────────┼────────┼─────────┼───────┤   │
      │  │ Client A  │  [✓]   │   [ ]    │  [✓]   │   [ ]   │  [ ]  │   │
      │  │ Client B  │  [ ]   │   [ ]    │  [ ]   │   [ ]   │  [ ]  │   │
      │  │ Client C  │  [✓]   │   [✓]    │  [✓]   │   [ ]   │  [ ]  │   │
      │  └───────────┴────────┴──────────┴────────┴─────────┴───────┘   │
      │                                                                 │
      │  [+ Add Client: ___________]    [+ Add Task: ___________]       │
      │                                                                 │
      └─────────────────────────────────────────────────────────────────┘
      ```

      ## JSONbin.io Setup Instructions

      1. Go to https://jsonbin.io and create a free account.
      2. Create a new bin with the initial data structure (clients/tasks arrays may be empty).
      3. Copy the Bin ID: 6966f7d3d0ea881f406a513b.
      4. Copy your API Key (Account Settings → API Keys).
      5. Add both to `app.js` as constants (or use an environment-based approach or server-side proxy).

      ## API Endpoints

      Read data:

      ```http
      GET https://api.jsonbin.io/v3/b/{BIN_ID}/latest
      Headers: X-Access-Key: {API_KEY}
      ```

      Update data:

      ```http
      PUT https://api.jsonbin.io/v3/b/{BIN_ID}
      Headers:
        X-Access-Key: {API_KEY}
        Content-Type: application/json
      Body: { full JSON object }
      ```

      ## Implementation Steps

      ### Phase 1: Setup

      - Create GitHub repository
      - Create JSONbin account and bin with initial structure
      - Create basic file structure
      - Test JSONbin API calls from the browser console

      ### Phase 2: Core UI

      - Build HTML structure (header, table, input forms)
      - Add basic CSS styling (clean, functional)
      - Implement data fetch on page load
      - Render clients/tasks grid dynamically

      ### Phase 3: CRUD Operations

      - Add client functionality
      - Remove client functionality
      - Add task functionality
      - Remove task functionality
      - Toggle checkbox functionality
      - Auto-save on every change

      ### Phase 4: Month Reset

      - Add "New Month" button
      - Implement reset logic (clear completions, keep clients/tasks)
      - Update `currentMonth` display
      - Add confirmation prompt

      ### Phase 5: Polish

      - Loading state while fetching data
      - Error handling for API failures
      - Mobile responsive adjustments
      - Test across browsers

      ## Security Considerations

      - JSONbin API key will be visible in client-side code.
      - Acceptable for a personal tool with non-sensitive data.
      - Anyone with the bin ID + API key could access/modify data.

      Mitigation: keep the repository private, use JSONbin's "Private" bin setting, or move API calls to a serverless function that holds the API key server-side (Cloudflare Worker, Vercel Edge Function).

      ## Future Enhancements (Out of Scope for V1)

      - Historical month tracking (archive past months)
      - Progress percentage display per client
      - Due date reminders
      - Multiple users with auth
      - Export to CSV
      - Notes field per client/task

      ## Success Criteria

      - Can add/remove clients
      - Can add/remove tasks
      - Checkboxes save immediately and persist on refresh
      - Accessible from multiple devices with same data
      - "New Month" resets checkboxes without losing clients/tasks
      - Loads quickly, works on mobile

      ## Reference Links

      - JSONbin.io Docs: https://jsonbin.io/api-reference
      - GitHub Pages Docs: https://docs.github.com/en/pages
      - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
