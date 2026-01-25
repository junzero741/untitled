# Guide to Create PRs for Unmerged Branches

This document provides information about branches that are not yet merged into `master` and instructions to create Pull Requests for them.

## Unmerged Branches Overview

### 1. Branch: `1`
**Purpose:** Database Schema Design

**Changes:**
- Design PostgreSQL database schema with User and Post entities using TypeORM
- Added DATABASE_SCHEMA.md documentation
- Created entity files (User, Post)
- Set up TypeORM configuration

**Files Changed:** 12 files (+302 insertions, -6 deletions)
- DATABASE_SCHEMA.md
- Backend database configuration
- Entity definitions (User, Post)

**GitHub CLI Command to Create PR:**
```bash
gh pr create --base master --head 1 --title "Database Schema Design with TypeORM" --body "This PR implements the PostgreSQL database schema with User and Post entities using TypeORM.

Changes include:
- User entity with authentication fields
- Post entity with content and metadata
- TypeORM configuration and data source setup
- DATABASE_SCHEMA.md documentation"
```

---

### 2. Branch: `feature/authentication`
**Purpose:** User Authentication Implementation

**Changes:**
- Implement JWT-based user authentication
- SignUp and Login endpoints
- Fix TypeScript and test errors
- Built on top of database schema

**Commits:** 3 commits
1. Design PostgreSQL database schema
2. Implement user authentication with JWT
3. Fix TypeScript and test errors

**GitHub CLI Command to Create PR:**
```bash
gh pr create --base master --head feature/authentication --title "Implement User Authentication with JWT" --body "This PR implements user authentication functionality with JWT tokens.

Features:
- JWT-based authentication system
- SignUp endpoint (/auth/signup)
- Login endpoint (/auth/login)
- Password hashing with bcryptjs
- Authentication guards and strategies
- Comprehensive test coverage

This PR builds on the database schema design."
```

---

### 3. Branch: `feature/posts-crud`
**Purpose:** Posts CRUD Operations

**Changes:**
- Implement complete CRUD operations for posts
- Authentication-based access control
- Remove type assertions for better type safety
- Built on authentication feature

**Commits:** 5 commits
1. Database schema
2. Authentication implementation
3. Fix authentication tests
4. Implement posts CRUD functionality
5. Remove 'as any' type assertions

**GitHub CLI Command to Create PR:**
```bash
gh pr create --base master --head feature/posts-crud --title "Implement Posts CRUD with Authentication" --body "This PR implements full CRUD functionality for posts with JWT authentication.

Features:
- Create post (POST /posts)
- Read post (GET /posts/:id)
- Read all posts (GET /posts) with pagination
- Update post (PATCH /posts/:id)
- Delete post (DELETE /posts/:id)
- Get posts by author (GET /posts/author/:authorId)
- View count tracking
- Author-only edit/delete permissions
- Type-safe implementation

This PR builds on the authentication feature."
```

---

### 4. Branch: `feature/wysiwyg-editor`
**Purpose:** WYSIWYG Editor with ProseMirror

**Changes:**
- Implement ProseMirror-based WYSIWYG editor
- Upgrade Next.js to 16.1.4 and React to 19.2.3
- Frontend pages for post creation, editing, and viewing
- CORS configuration
- Backend environment setup

**Commits:** 5+ commits
- Complete WYSIWYG editor implementation
- Frontend UI for posts
- Login/signup UI
- Backend CORS configuration
- Environment configuration

**GitHub CLI Command to Create PR:**
```bash
gh pr create --base master --head feature/wysiwyg-editor --title "Implement WYSIWYG Editor with ProseMirror" --body "This PR implements a full-featured WYSIWYG editor using ProseMirror and creates the complete frontend UI.

Features:
- ProseMirror-based WYSIWYG editor component
- Text formatting (bold, italic, code)
- Headings (H1-H3)
- Lists (ordered/unordered)
- Undo/redo functionality
- Post creation/editing pages
- Post list and detail views
- Login/signup UI
- Next.js 16.1.4 and React 19.2.3 upgrade
- CORS configuration for frontend-backend communication

This PR builds on the posts CRUD feature."
```

---

### 5. Branch: `fix/posts-response-schema`
**Purpose:** Refactor Posts API Response Format

**Changes:**
- Refactor posts API response format
- Extract custom hooks for better code organization
- Single commit with focused changes

**Commits:** 1 commit
- Refactor posts API response format and extract custom hooks

**GitHub CLI Command to Create PR:**
```bash
gh pr create --base master --head fix/posts-response-schema --title "Refactor Posts API Response Format and Extract Custom Hooks" --body "This PR refactors the posts API response format for better structure and extracts custom hooks for improved code organization.

Changes:
- Improved API response schema for posts endpoints
- Extracted reusable custom hooks
- Better separation of concerns
- Cleaner frontend code structure"
```

---

## How to Create PRs

### Option 1: Using GitHub CLI (Recommended)
If you have GitHub CLI installed, run the commands provided above for each branch.

### Option 2: Using GitHub Web Interface
1. Go to https://github.com/junzero741/untitled
2. Click on "Pull requests" tab
3. Click "New pull request"
4. Select `master` as base branch
5. Select the feature branch as compare branch
6. Fill in title and description (use the information above)
7. Click "Create pull request"

### Option 3: Create All PRs at Once (Batch Script)
Save this script as `create-prs.sh` and run it:

```bash
#!/bin/bash

# Create PR for branch "1"
gh pr create --base master --head 1 \
  --title "Database Schema Design with TypeORM" \
  --body "This PR implements the PostgreSQL database schema with User and Post entities using TypeORM."

# Create PR for feature/authentication
gh pr create --base master --head feature/authentication \
  --title "Implement User Authentication with JWT" \
  --body "This PR implements user authentication functionality with JWT tokens."

# Create PR for feature/posts-crud
gh pr create --base master --head feature/posts-crud \
  --title "Implement Posts CRUD with Authentication" \
  --body "This PR implements full CRUD functionality for posts with JWT authentication."

# Create PR for feature/wysiwyg-editor
gh pr create --base master --head feature/wysiwyg-editor \
  --title "Implement WYSIWYG Editor with ProseMirror" \
  --body "This PR implements a full-featured WYSIWYG editor using ProseMirror."

# Create PR for fix/posts-response-schema
gh pr create --base master --head fix/posts-response-schema \
  --title "Refactor Posts API Response Format and Extract Custom Hooks" \
  --body "This PR refactors the posts API response format for better structure."
```

Then run:
```bash
chmod +x create-prs.sh
./create-prs.sh
```

## Notes

- **Branch "1"** should be merged first as it contains the database schema
- **feature/authentication** depends on branch "1"
- **feature/posts-crud** depends on feature/authentication
- **feature/wysiwyg-editor** depends on feature/posts-crud
- **fix/posts-response-schema** appears to be independent

Consider merging them in this order for a clean integration.

## Current PR Status

- ✅ **copilot/merge-fix-posts-response-schema** - Already has PR #3 (open)
- ✅ **copilot/merge-unstaged-branches-to-master** - Already has PR #4 (open)
- ❌ **1** - No PR yet
- ❌ **feature/authentication** - No PR yet
- ❌ **feature/posts-crud** - No PR yet
- ❌ **feature/wysiwyg-editor** - No PR yet
- ❌ **fix/posts-response-schema** - No PR yet (but copilot/merge-fix-posts-response-schema might be related)
