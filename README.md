# Web-based Bulletin Board (웹 기반 게시판)

WYSIWYG 에디터를 탑재한 웹 기반 게시판 프로젝트

## 기술 스택

- **구조**: Monorepo (Turbo)
- **Frontend**: Next.js 14, TypeScript, React Context, TailwindCSS, Prosemirror
- **Backend**: Nest.js, PostgreSQL
- **패키지 관리**: Yarn Workspaces

## 프로젝트 구조

```
.
├── apps/
│   ├── frontend/          # Next.js 애플리케이션
│   └── backend/           # Nest.js 애플리케이션
├── packages/
│   └── shared/            # 공유 타입 및 유틸리티
├── package.json
├── tsconfig.json
└── turbo.json
```

## 설치 및 실행

### 설치

```bash
yarn install
```

### 개발 모드

```bash
yarn dev
```

### 빌드

```bash
yarn build
```

### 타입 체크

```bash
yarn type-check
```

## 마일스톤

- [x] 프로젝트 구조 설계 및 환경 구성
- [ ] 데이터베이스 스키마 설계 (PostgreSQL)
- [ ] 사용자 인증 기능 구현 (Login/Logout)
- [ ] WYSIWYG 에디터 구현 (Prosemirror)
- [ ] 게시글 조회 및 목록 기능 구현
