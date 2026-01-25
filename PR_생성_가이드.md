# Master에 병합되지 않은 브랜치들의 PR 생성 가이드

이 문서는 아직 `master` 브랜치에 병합되지 않은 브랜치들에 대한 PR을 생성하는 방법을 안내합니다.

## 중요 안내사항

GitHub Copilot은 환경 제약으로 인해 **직접 PR을 생성할 수 없습니다**. 따라서 PR 생성에 필요한 모든 정보와 명령어를 제공하여, 사용자가 직접 PR을 생성할 수 있도록 준비했습니다.

## 병합되지 않은 브랜치 목록

다음 5개의 브랜치가 master에 아직 병합되지 않았습니다:

### 1. 브랜치: `1`
**목적:** 데이터베이스 스키마 설계

**주요 변경사항:**
- TypeORM을 사용한 PostgreSQL 데이터베이스 스키마 설계
- User 및 Post 엔티티 생성
- DATABASE_SCHEMA.md 문서 추가

**변경된 파일:** 12개 파일 (+302, -6)

**PR 생성 명령어:**
```bash
gh pr create --base master --head 1 \
  --title "데이터베이스 스키마 설계 (TypeORM)" \
  --body "TypeORM을 사용하여 User와 Post 엔티티를 포함한 PostgreSQL 데이터베이스 스키마를 구현합니다."
```

---

### 2. 브랜치: `feature/authentication`
**목적:** 사용자 인증 기능 구현

**주요 변경사항:**
- JWT 기반 인증 시스템
- 회원가입 및 로그인 엔드포인트
- bcryptjs를 이용한 비밀번호 해싱

**커밋 수:** 3개
- 데이터베이스 스키마 설계
- JWT 인증 구현
- TypeScript 및 테스트 오류 수정

**PR 생성 명령어:**
```bash
gh pr create --base master --head feature/authentication \
  --title "JWT를 사용한 사용자 인증 구현" \
  --body "JWT 토큰 기반의 사용자 인증 기능을 구현합니다. 회원가입, 로그인, 인증 가드 등을 포함합니다."
```

---

### 3. 브랜치: `feature/posts-crud`
**목적:** 게시글 CRUD 기능 구현

**주요 변경사항:**
- 게시글 생성, 조회, 수정, 삭제 기능
- JWT 인증 기반 접근 제어
- 페이지네이션 지원
- 조회수 카운팅

**커밋 수:** 5개

**PR 생성 명령어:**
```bash
gh pr create --base master --head feature/posts-crud \
  --title "인증 기반 게시글 CRUD 구현" \
  --body "JWT 인증을 포함한 게시글의 전체 CRUD 기능을 구현합니다. 페이지네이션, 조회수, 작성자 권한 확인 등을 포함합니다."
```

---

### 4. 브랜치: `feature/wysiwyg-editor`
**목적:** WYSIWYG 에디터 구현

**주요 변경사항:**
- ProseMirror 기반 WYSIWYG 에디터
- Next.js 16.1.4, React 19.2.3 업그레이드
- 게시글 작성/수정/목록/상세 페이지
- 로그인/회원가입 UI
- CORS 설정

**커밋 수:** 5개 이상

**PR 생성 명령어:**
```bash
gh pr create --base master --head feature/wysiwyg-editor \
  --title "ProseMirror 기반 WYSIWYG 에디터 구현" \
  --body "ProseMirror를 사용한 WYSIWYG 에디터와 전체 프론트엔드 UI를 구현합니다. 텍스트 서식, 제목, 리스트 등의 기능을 포함합니다."
```

---

### 5. 브랜치: `fix/posts-response-schema`
**목적:** Posts API 응답 형식 리팩토링

**주요 변경사항:**
- Posts API 응답 형식 개선
- 커스텀 훅 추출
- 코드 구조 개선

**커밋 수:** 1개

**PR 생성 명령어:**
```bash
gh pr create --base master --head fix/posts-response-schema \
  --title "Posts API 응답 형식 리팩토링 및 커스텀 훅 추출" \
  --body "Posts API의 응답 구조를 개선하고 재사용 가능한 커스텀 훅을 추출하여 코드 구조를 개선합니다."
```

---

## PR 생성 방법

### 방법 1: GitHub CLI 사용 (권장)
GitHub CLI가 설치되어 있다면, 위의 각 브랜치별 명령어를 실행하세요.

**한 번에 모든 PR 생성하기:**
```bash
# 브랜치 1
gh pr create --base master --head 1 \
  --title "데이터베이스 스키마 설계 (TypeORM)" \
  --body "TypeORM을 사용하여 User와 Post 엔티티를 포함한 PostgreSQL 데이터베이스 스키마를 구현합니다."

# 인증 기능
gh pr create --base master --head feature/authentication \
  --title "JWT를 사용한 사용자 인증 구현" \
  --body "JWT 토큰 기반의 사용자 인증 기능을 구현합니다."

# 게시글 CRUD
gh pr create --base master --head feature/posts-crud \
  --title "인증 기반 게시글 CRUD 구현" \
  --body "JWT 인증을 포함한 게시글의 전체 CRUD 기능을 구현합니다."

# WYSIWYG 에디터
gh pr create --base master --head feature/wysiwyg-editor \
  --title "ProseMirror 기반 WYSIWYG 에디터 구현" \
  --body "ProseMirror를 사용한 WYSIWYG 에디터와 전체 프론트엔드 UI를 구현합니다."

# API 응답 리팩토링
gh pr create --base master --head fix/posts-response-schema \
  --title "Posts API 응답 형식 리팩토링 및 커스텀 훅 추출" \
  --body "Posts API의 응답 구조를 개선하고 재사용 가능한 커스텀 훅을 추출합니다."
```

### 방법 2: GitHub 웹 인터페이스 사용
1. https://github.com/junzero741/untitled 로 이동
2. "Pull requests" 탭 클릭
3. "New pull request" 버튼 클릭
4. base 브랜치: `master` 선택
5. compare 브랜치: 각 feature 브랜치 선택
6. 제목과 설명 입력 (위의 정보 참고)
7. "Create pull request" 클릭

### 방법 3: 스크립트 파일로 일괄 생성
아래 내용으로 `create-all-prs.sh` 파일을 생성하고 실행:

```bash
#!/bin/bash

echo "Creating PRs for all unmerged branches..."

gh pr create --base master --head 1 \
  --title "데이터베이스 스키마 설계 (TypeORM)" \
  --body "TypeORM을 사용하여 User와 Post 엔티티를 포함한 PostgreSQL 데이터베이스 스키마를 구현합니다."

gh pr create --base master --head feature/authentication \
  --title "JWT를 사용한 사용자 인증 구현" \
  --body "JWT 토큰 기반의 사용자 인증 기능을 구현합니다."

gh pr create --base master --head feature/posts-crud \
  --title "인증 기반 게시글 CRUD 구현" \
  --body "JWT 인증을 포함한 게시글의 전체 CRUD 기능을 구현합니다."

gh pr create --base master --head feature/wysiwyg-editor \
  --title "ProseMirror 기반 WYSIWYG 에디터 구현" \
  --body "ProseMirror를 사용한 WYSIWYG 에디터와 전체 프론트엔드 UI를 구현합니다."

gh pr create --base master --head fix/posts-response-schema \
  --title "Posts API 응답 형식 리팩토링 및 커스텀 훅 추출" \
  --body "Posts API의 응답 구조를 개선하고 재사용 가능한 커스텀 훅을 추출합니다."

echo "All PRs created successfully!"
```

실행 방법:
```bash
chmod +x create-all-prs.sh
./create-all-prs.sh
```

## 권장 병합 순서

브랜치 간 의존성을 고려한 권장 병합 순서:

1. **1** (데이터베이스 스키마) - 기반이 되는 스키마
2. **feature/authentication** - 스키마에 의존
3. **feature/posts-crud** - 인증 기능에 의존
4. **feature/wysiwyg-editor** - Posts CRUD에 의존
5. **fix/posts-response-schema** - 독립적 (언제든지 가능)

## 현재 PR 상태

- ✅ **copilot/merge-fix-posts-response-schema** - PR #3 존재 (open)
- ✅ **copilot/merge-unstaged-branches-to-master** - PR #4 존재 (open)
- ❌ **1** - PR 없음
- ❌ **feature/authentication** - PR 없음
- ❌ **feature/posts-crud** - PR 없음
- ❌ **feature/wysiwyg-editor** - PR 없음
- ❌ **fix/posts-response-schema** - PR 없음

## 추가 정보

더 자세한 정보는 `UNMERGED_BRANCHES_PR_GUIDE.md` (영문) 파일을 참고하세요.
