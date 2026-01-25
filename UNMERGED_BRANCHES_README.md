# Unmerged Branches Summary

This directory contains guides for creating Pull Requests for branches that haven't been merged into `master` yet.

## 📋 Available Guides

1. **`PR_생성_가이드.md`** - 한국어 가이드
   - 병합되지 않은 브랜치 목록 및 설명
   - GitHub CLI 명령어 (한글)
   - PR 생성 방법 안내

2. **`UNMERGED_BRANCHES_PR_GUIDE.md`** - English Guide
   - List of unmerged branches with descriptions
   - GitHub CLI commands
   - Instructions for creating PRs

## 🔍 Quick Summary

**Unmerged Branches (5):**
- `1` - Database Schema Design
- `feature/authentication` - JWT Authentication
- `feature/posts-crud` - Posts CRUD Operations
- `feature/wysiwyg-editor` - WYSIWYG Editor with ProseMirror
- `fix/posts-response-schema` - API Response Refactoring

## 🚀 Quick Start

To create all PRs at once using GitHub CLI:

```bash
# Make sure you're in the repository directory
cd <your-repository-directory>

# Run these commands one by one, or create a script
gh pr create --base master --head 1 --title "Database Schema Design with TypeORM" --body "..."
gh pr create --base master --head feature/authentication --title "Implement User Authentication with JWT" --body "..."
gh pr create --base master --head feature/posts-crud --title "Implement Posts CRUD with Authentication" --body "..."
gh pr create --base master --head feature/wysiwyg-editor --title "Implement WYSIWYG Editor with ProseMirror" --body "..."
gh pr create --base master --head fix/posts-response-schema --title "Refactor Posts API Response Format" --body "..."
```

For detailed instructions and full command text, see the guide files above.

## 📝 Note

Due to environment limitations, PRs cannot be created automatically via the GitHub API. The guides provide all necessary information and commands to create the PRs manually.
